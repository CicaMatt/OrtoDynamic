"""Quote business operations that go beyond plain field updates."""
from django.db.models import Sum

from apps.common.exceptions import ConflictError, ServiceError
from apps.products.models import Product
from apps.quotes.models import Quote, QuoteItem
from apps.statuses.services import allowed_target_states
from apps.work_orders.services import (
    WORK_ORDER_TRIGGER_STATES,
    create_work_order_from_quote,
)


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
    amount = price * quantity
    if discount is not None:
        amount *= 1 - discount / 100
    return round(amount, 2)


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
    total = round(total, 2) if total is not None else 0.0
    Quote.objects.filter(pk=quote_id).update(totale=total)
    return total


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
