"""
Read-side queries for the quotes app.

The legacy schema stores relationships as integer columns rather than Django foreign
keys. These selectors resolve those relationships in batches and attach the transient
attributes consumed by the API serializers. They also assemble the ORM inputs for
quote-owned documents, keeping database knowledge out of views and renderers.
"""

from django.db.models import Count

from apps.clients.models import Client
from apps.common.exceptions import NotFoundError
from apps.doctors.models import Doctor
from apps.products.models import Product
from apps.quotes.document_rows import QuoteDocumentItem
from apps.quotes.models import Quote, QuoteItem
from apps.work_orders.models import WorkOrder


def quote_status_counts(statuses):
    """Count quotes for each requested status, preserving zero-count statuses."""
    counts = {status: 0 for status in statuses}
    rows = (
        Quote.objects.filter(stato__in=statuses)
        .values("stato")
        .annotate(total=Count("id"))
    )
    for row in rows:
        counts[row["stato"]] = row["total"]
    return counts


def quotes_with_people(quotes):
    """Materialize quotes with their referenced client and doctor attached."""
    quotes = list(quotes)
    client_ids = {quote.id_cliente for quote in quotes if quote.id_cliente}
    doctor_ids = {quote.id_medico for quote in quotes if quote.id_medico}
    clients = Client.objects.in_bulk(client_ids)
    doctors = Doctor.objects.in_bulk(doctor_ids)

    for quote in quotes:
        quote.client = clients.get(quote.id_cliente)
        quote.doctor = doctors.get(quote.id_medico)
    return quotes


def quotes_with_read_relations(quotes):
    """
    Materialize quotes with their client, doctor, and first work order attached.

    Client and doctor references are loaded in one query each. Work orders are
    ordered by id so duplicate legacy rows preserve the API's existing "first row"
    behavior.
    """
    quotes = quotes_with_people(quotes)
    quote_ids = [quote.id for quote in quotes]
    work_orders = WorkOrder.objects.filter(id_preventivo__in=quote_ids).order_by("id")
    first_work_order_by_quote = {}
    for work_order in work_orders:
        first_work_order_by_quote.setdefault(work_order.id_preventivo, work_order)
    for quote in quotes:
        quote.work_order = first_work_order_by_quote.get(quote.id)
    return quotes


def quote_items_with_products(quote_id):
    """
    A quote's line items with each catalogue product attached as ``item.product``.

    Missing products remain ``None`` and all products are loaded in one query.
    """
    items = list(QuoteItem.objects.filter(id_preventivo=quote_id).order_by("id"))
    product_ids = {item.codice_nomenclatore for item in items if item.codice_nomenclatore}
    products = Product.objects.in_bulk(product_ids)
    for item in items:
        item.product = products.get(item.codice_nomenclatore)
    return items


def delivery_form_inputs(quote_id):
    """The quote and optional client required by the delivery-form generator."""
    quote = Quote.objects.filter(pk=quote_id).first()
    if quote is None:
        raise NotFoundError("Preventivo inesistente.")
    client = Client.objects.filter(pk=quote.id_cliente).first()
    return quote, client


def ddt_document_inputs(quote_id):
    """The quote, required client, and product-enriched rows required by the DDT."""
    quote, client = _quote_and_required_client(quote_id)
    return quote, client, ddt_item_rows(quote.id)


def scheda_document_inputs(quote_id):
    """The quote, required client, and product-enriched rows for Scheda Progetto."""
    quote, client = _quote_and_required_client(quote_id)
    return quote, client, scheda_item_rows(quote.id)


def _quote_and_required_client(quote_id):
    quote = Quote.objects.filter(pk=quote_id).first()
    client = Client.objects.filter(pk=quote.id_cliente).first() if quote else None
    if quote is None or client is None:
        raise NotFoundError("Preventivo non trovato.")
    return quote, client


def ddt_item_rows(quote_id):
    """
    The quote's line items as DDT rows (`codice`, `descrizione`, `quantita`,
    `prezzo`, `importo`). A line whose product is gone keeps a null code/description
    — the LEFT JOIN of the original query — so it still prints with its quantity.
    """
    return [
        QuoteDocumentItem(
            codice=item.product.codice if item.product else None,
            descrizione=item.product.descrizione if item.product else None,
            quantita=item.quantita,
            prezzo=item.prezzo,
            importo=item.importo,
            sconto=item.sconto,
        )
        for item in quote_items_with_products(quote_id)
    ]


def scheda_item_rows(quote_id):
    """
    The quote's line items as Scheda Progetto rows (`codice`/`descrizione` from the
    product, the money columns from the line). A line whose product is missing is
    dropped — the INNER JOIN of the original query.
    """
    return [
        QuoteDocumentItem(
            codice=item.product.codice,
            descrizione=item.product.descrizione,
            prezzo=item.prezzo,
            quantita=item.quantita,
            importo=item.importo,
            sconto=item.sconto,
        )
        for item in quote_items_with_products(quote_id)
        if item.product is not None
    ]
