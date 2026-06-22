"""Work order business operations that go beyond plain field updates."""
from django.db import transaction
from django.utils import timezone

from apps.products.models import Product
from apps.quotes.models import QuoteItem
from apps.work_orders.models import WorkOrder, WorkOrderItem

# Quote target states that spawn a work order. Both variants create the work order
# in the literal "IN LAVORAZIONE" state — the "senza autorizzazione" distinction is
# recorded only on the quote, never on the work order.
WORK_ORDER_TRIGGER_STATES = frozenset(
    {"IN LAVORAZIONE", "IN LAVORAZIONE SENZA AUTORIZZAZIONE"}
)
_WORK_ORDER_STATE = "IN LAVORAZIONE"


def work_order_for_quote(quote_id):
    """The work order already created from this quote, or ``None``."""
    return WorkOrder.objects.filter(id_preventivo=quote_id).first()


def create_work_order_from_quote(quote):
    """
    Create the work order (`lavorazioni`) and its lines (`item_lavorazioni`) from a
    quote's items, in one transaction.

    Each work-order line copies its quote line's amount/quantity and the product's
    code/description. Idempotent: if a work order already exists for the quote it is
    returned unchanged, so re-triggering the transition never creates a duplicate.
    The single home for "a quote becomes a work order"; see
    `apps.quotes.services.change_quote_status`, which calls it on the transition.
    """
    today = timezone.localdate()
    with transaction.atomic():
        existing = work_order_for_quote(quote.id)
        if existing is not None:
            return existing

        work_order = WorkOrder.objects.create(
            id_preventivo=quote.id,
            id_cliente=quote.id_cliente,
            stato=_WORK_ORDER_STATE,
            data_creazione_lavorazione=today,
        )

        items = list(QuoteItem.objects.filter(id_preventivo=quote.id).order_by("id"))
        product_ids = {item.codice_nomenclatore for item in items if item.codice_nomenclatore}
        products = {product.id: product for product in Product.objects.filter(id__in=product_ids)}
        for item in items:
            product = products.get(item.codice_nomenclatore)
            WorkOrderItem.objects.create(
                id_item_preventivi=item.id,
                id_lavorazione=work_order.id,
                codice_nomenclatore=_code_to_int(product.codice if product else None),
                descrizione_nomenclatore=product.descrizione if product else None,
                importo=item.importo,
                quantita=item.quantita,
                stato=_WORK_ORDER_STATE,
                data_creazione_lavorazione=today,
            )

    return work_order


def _code_to_int(code):
    """
    The catalogue code as stored into `item_lavorazioni.codice_nomenclatore` (a
    bigint), matching the legacy insert — leading zeros are lost. A missing or
    non-numeric code stores nothing rather than raising.
    """
    try:
        return int(code)
    except (TypeError, ValueError):
        return None
