"""Quote business operations that go beyond plain field updates."""
from datetime import timedelta
from decimal import Decimal, ROUND_HALF_UP
import re

from django.db import transaction
from django.db.models import Sum

from apps.common.exceptions import ConflictError, ServiceError
from apps.products.models import Product
from apps.quotes.models import Quote, QuoteItem
from apps.statuses.services import allowed_target_states


INITIAL_QUOTE_STATUS = "INSERITO"
_CENT = Decimal("0.01")


def _round_money(value):
    return float(Decimal(str(value)).quantize(_CENT, rounding=ROUND_HALF_UP))


def line_amount(price, quantity, discount):
    """
    Importo for a quote line: `prezzo × quantità`, reduced by the discount percent
    when one is set, rounded to cents.

    Returns ``None`` when either the price or the quantity is unknown, so a line
    without those carries no amount. `discount` is a 1–100 percentage (validated at
    the serializer boundary); ``None`` means no discount and leaves the amount at
    the full `prezzo × quantità`.
    """
    if price is None or quantity is None:
        return None
    amount = Decimal(str(price)) * Decimal(str(quantity))
    if discount is not None:
        amount *= Decimal("1") - Decimal(str(discount)) / Decimal("100")
    return _round_money(amount)


def recompute_quote_total(quote_id):
    """
    Set a quote's `totale` to the sum of its line items' `importo` and persist it.

    The total is always derived from the items, never set directly, so this runs
    after any change to a quote's lines (and on quote creation). A quote with no
    lines (or none carrying an amount) totals 0. Returns the stored total.
    """
    total = (
        QuoteItem.objects.filter(id_preventivo=quote_id).aggregate(total=Sum("importo"))["total"]
    )
    total = _round_money(total) if total is not None else 0.0
    Quote.objects.filter(pk=quote_id).update(totale=total)
    return total


def max_expiry_from_days(expiry_days, *, today):
    """
    Derive the stored quote expiry date from a non-negative whole-day count.

    Blank/NULL clears the derived value. Invalid, fractional, negative, or
    out-of-range values raise ``ValueError`` so the API boundary can return a
    deterministic field validation error.
    """
    if expiry_days is None or str(expiry_days).strip() == "":
        return ""

    raw = str(expiry_days).strip()
    if re.fullmatch(r"[0-9]+", raw) is None:
        raise ValueError("Inserisci un numero intero di giorni uguale o maggiore di zero.")
    try:
        return (today + timedelta(days=int(raw))).isoformat()
    except OverflowError as exc:
        raise ValueError("Il numero di giorni indicato è troppo elevato.") from exc


def create_quote_with_items(validated_quote_fields, validated_items):
    """
    Create a quote and its initial line items as one business operation.

    New quotes always start in ``INSERITO`` and their total is derived from their
    items. ``transaction.atomic`` protects transactional databases; the explicit
    cleanup also compensates for the production legacy tables when they use MyISAM
    and cannot roll back a partially completed operation.
    """
    quote_fields = dict(validated_quote_fields)
    quote_fields["stato"] = INITIAL_QUOTE_STATUS
    items = list(validated_items)
    quote = None

    try:
        with transaction.atomic():
            quote = Quote.objects.create(**quote_fields)
            for item_fields in items:
                create_quote_item(quote_id=quote.id, **item_fields)
            if not items:
                recompute_quote_total(quote.id)
        return quote
    except Exception:
        if quote is not None:
            QuoteItem.objects.filter(id_preventivo=quote.id).delete()
            Quote.objects.filter(pk=quote.id).delete()
        raise


def create_quote_item(*, quote_id, product_id, quantity, discount):
    """
    Create a line item under a quote, deriving its money columns from the catalog.

    `prezzo` is the chosen product's unit price and `importo` is `prezzo × quantità`
    reduced by `sconto` (see `line_amount`); neither is client-supplied. `sconto`
    is stored as given for reference. Raises `ServiceError` when the referenced
    product does not exist. The created instance is returned with its product
    attached, so the read serializer can render the description without a refetch.
    """
    product = Product.objects.filter(pk=product_id).first()
    if product is None:
        raise ServiceError("Prodotto inesistente o non più disponibile.")

    price = product.prezzo
    item = QuoteItem.objects.create(
        id_preventivo=quote_id,
        codice_nomenclatore=product_id,
        quantita=quantity,
        prezzo=price,
        importo=line_amount(price, quantity, discount),
        sconto=discount,
    )
    item.product = product
    recompute_quote_total(quote_id)
    return item


def update_quote_item(*, quote_item, quantity, discount):
    """
    Update a line's quantity and discount, recomputing `importo` from the line's
    own `prezzo` (see `line_amount`).

    The product and its price are fixed, so they are not touched. `sconto` is a
    1–100 discount percentage (validated at the serializer boundary) that reduces
    the amount; clearing it restores the full `prezzo × quantità`. Only the three
    derived/edited columns are persisted.
    """
    quote_item.quantita = quantity
    quote_item.sconto = discount
    quote_item.importo = line_amount(quote_item.prezzo, quantity, discount)
    quote_item.save(update_fields=["quantita", "sconto", "importo"])
    recompute_quote_total(quote_item.id_preventivo)
    return quote_item


def delete_quote_item(quote_item):
    """
    Delete a line and recompute its quote's `totale` from the remaining lines, so
    the total stays the sum of its items (see `recompute_quote_total`).
    """
    quote_id = quote_item.id_preventivo
    quote_item.delete()
    recompute_quote_total(quote_id)


def delete_quote_graph(quote_id):
    """
    Delete a quote and the complete legacy graph derived from it, by quote id.

    The database does not declare foreign keys for these unmanaged tables, so the
    dependent rows must be removed explicitly: quote items plus any work order
    created from this quote and that work order's items.
    """
    from apps.work_orders.models import WorkOrder, WorkOrderItem

    with transaction.atomic():
        work_order_ids = list(
            WorkOrder.objects.filter(id_preventivo=quote_id).values_list("id", flat=True)
        )
        if work_order_ids:
            WorkOrderItem.objects.filter(id_lavorazione__in=work_order_ids).delete()
            WorkOrder.objects.filter(id__in=work_order_ids).delete()
        QuoteItem.objects.filter(id_preventivo=quote_id).delete()
        Quote.objects.filter(pk=quote_id).delete()


def quote_status_transition_options(quote):
    """Allowed quote targets annotated with their authoritative side effects."""
    from apps.work_orders.services import WORK_ORDER_TRIGGER_STATES

    return [
        {
            "status": status,
            "createsWorkOrder": status in WORK_ORDER_TRIGGER_STATES,
        }
        for status in allowed_target_states(quote.STATUS_TABLE, quote.stato)
    ]


def change_quote_status(quote, target_status, *, note=None):
    """
    Move `quote` to `target_status`, enforcing the PREVENTIVI transition rules, and
    spawn its work order when the target is an "in lavorazione" state.

    The allowed transitions come entirely from the `stato_check` table (via
    `apps.statuses`); a move that no row permits raises `ConflictError` and changes
    nothing. For `WORK_ORDER_TRIGGER_STATES`, the work order is created from the
    quote's items first (see `apps.work_orders.services`); only once that succeeds is
    the new status (and `note_private`, when `note` is given) persisted. Ordering it
    this way keeps the transition all-or-nothing even though the legacy tables are
    MyISAM and cannot roll back: a failed creation cleans up after itself and leaves
    the quote untouched. The created (or already-existing) work order is attached as
    `quote.work_order`.
    """
    from apps.work_orders.services import (
        WORK_ORDER_TRIGGER_STATES,
        create_work_order_from_quote,
    )

    if target_status not in allowed_target_states(quote.STATUS_TABLE, quote.stato):
        raise ConflictError(
            f"Transizione di stato non consentita da «{quote.stato or '—'}» a «{target_status}»."
        )

    # Create the work order before touching the quote, so a creation failure (which
    # cleans up its own partial rows) leaves the quote's status unchanged.
    work_order = None
    if target_status in WORK_ORDER_TRIGGER_STATES:
        work_order = create_work_order_from_quote(quote)

    update_fields = ["stato"]
    quote.stato = target_status
    if note is not None:
        quote.note_private = note
        update_fields.append("note_private")
    quote.save(update_fields=update_fields)

    quote.work_order = work_order
    return quote
