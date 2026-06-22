"""Quote business operations that go beyond plain field updates."""
from django.db import transaction

from apps.common.exceptions import ConflictError, ServiceError
from apps.products.models import Product
from apps.quotes.models import QuoteItem
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
    return quote_item


def change_quote_status(quote, target_status, *, note=None):
    """
    Move `quote` to `target_status`, enforcing the PREVENTIVI transition rules, and
    spawn its work order when the target is an "in lavorazione" state.

    The allowed transitions come entirely from the `stato_check` table (via
    `apps.statuses`); a move that no row permits raises `ConflictError` and changes
    nothing. On success the status (and `note_private`, when `note` is given) is
    persisted, and — for `WORK_ORDER_TRIGGER_STATES` — a `lavorazioni` work order is
    created from the quote's items (see `apps.work_orders.services`). The status
    update and the creation share one transaction, so a failure rolls back both. The
    created (or already-existing) work order is attached as `quote.work_order`.
    """
    if target_status not in allowed_target_states(quote.STATUS_TABLE, quote.stato):
        raise ConflictError(
            f"Transizione di stato non consentita da «{quote.stato or '—'}» a «{target_status}»."
        )

    update_fields = ["stato"]
    quote.stato = target_status
    if note is not None:
        quote.note_private = note
        update_fields.append("note_private")

    work_order = None
    with transaction.atomic():
        quote.save(update_fields=update_fields)
        if target_status in WORK_ORDER_TRIGGER_STATES:
            work_order = create_work_order_from_quote(quote)

    quote.work_order = work_order
    return quote
