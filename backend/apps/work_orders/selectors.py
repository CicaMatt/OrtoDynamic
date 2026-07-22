"""
Read-side queries for work orders and their document inputs.

The legacy work-order relationships are plain integer columns. These selectors
resolve them in batches and attach the transient objects expected by serializers,
while document selectors return the complete ORM bundle needed by a renderer.
"""

from apps.clients.models import Client
from apps.common.exceptions import NotFoundError
from apps.products.models import Product
from apps.quotes.models import Quote, QuoteItem
from apps.work_orders.models import PeriodicCheck, WorkOrder, WorkOrderItem


def work_orders_with_read_relations(work_orders):
    """Materialize work orders with their client and source quote attached."""
    work_orders = list(work_orders)
    client_ids = {work_order.id_cliente for work_order in work_orders if work_order.id_cliente}
    quote_ids = {
        work_order.id_preventivo for work_order in work_orders if work_order.id_preventivo
    }
    clients = Client.objects.in_bulk(client_ids)
    quotes = Quote.objects.in_bulk(quote_ids)

    for work_order in work_orders:
        work_order.client = clients.get(work_order.id_cliente)
        work_order.quote = quotes.get(work_order.id_preventivo)
    return work_orders


def work_order_items_with_quote_items_and_products(work_order_id):
    """
    A work order's items with source quote items and catalogue products attached.

    The two relationship levels are resolved in one query each, avoiding per-row
    lookups while preserving missing legacy references as ``None``.
    """
    items = list(
        WorkOrderItem.objects.filter(id_lavorazione=work_order_id).order_by("id")
    )
    quote_item_ids = {item.id_item_preventivi for item in items if item.id_item_preventivi}
    quote_items = QuoteItem.objects.in_bulk(quote_item_ids)
    product_ids = {
        quote_item.codice_nomenclatore
        for quote_item in quote_items.values()
        if quote_item.codice_nomenclatore
    }
    products = Product.objects.in_bulk(product_ids)
    for quote_item in quote_items.values():
        quote_item.product = products.get(quote_item.codice_nomenclatore)
    for item in items:
        item.quote_item = quote_items.get(item.id_item_preventivi)
    return items


def collaudi_document_inputs(work_order_id):
    """The complete work-order graph consumed by the Collaudi document generator."""
    work_order = WorkOrder.objects.filter(pk=work_order_id).first()
    if work_order is None:
        raise NotFoundError("Lavorazione inesistente.")

    client = Client.objects.filter(pk=work_order.id_cliente).first()
    quote = Quote.objects.filter(pk=work_order.id_preventivo).first()
    items = list(
        WorkOrderItem.objects.filter(id_lavorazione=work_order.id).order_by("id")
    )
    checks = list(
        PeriodicCheck.objects.filter(id_lavorazione=work_order.id).order_by("id")
    )
    return work_order, client, quote, items, checks
