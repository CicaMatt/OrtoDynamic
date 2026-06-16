"""Quote business operations that go beyond plain field updates."""
from apps.common.exceptions import ConflictError, ServiceError
from apps.products.models import Product
from apps.quotes.models import QuoteItem
from apps.statuses.services import allowed_target_states


def create_quote_item(*, quote_id, product_id, quantity, discount):
    """
    Create a line item under a quote, deriving its money columns from the catalog.

    `prezzo` is the chosen product's unit price and `importo` is `prezzo × quantità`
    (rounded to cents); neither is client-supplied. `sconto` is stored as given and
    does not affect the other amounts. Raises `ServiceError` when the referenced
    product does not exist. The created instance is returned with its product
    attached, so the read serializer can render the description without a refetch.
    """
    product = Product.objects.filter(pk=product_id).first()
    if product is None:
        raise ServiceError("Prodotto inesistente o non più disponibile.")

    price = product.prezzo
    amount = round(price * quantity, 2) if quantity is not None else None
    item = QuoteItem.objects.create(
        id_preventivo=quote_id,
        codice_nomenclatore=product_id,
        quantita=quantity,
        prezzo=price,
        importo=amount,
        sconto=discount,
    )
    item.product = product
    return item


def change_quote_status(quote, target_status):
    """
    Move `quote` to `target_status`, enforcing the PREVENTIVI transition rules.

    The allowed transitions come entirely from the `stato_check` table (via
    `apps.statuses`). Raises `ConflictError` when the move is not permitted from
    the quote's current state; on success persists only the status column.
    """
    if target_status not in allowed_target_states(quote.STATUS_TABLE, quote.stato):
        raise ConflictError(
            f"Transizione di stato non consentita da «{quote.stato or '—'}» a «{target_status}»."
        )
    quote.stato = target_status
    quote.save(update_fields=["stato"])
    return quote
