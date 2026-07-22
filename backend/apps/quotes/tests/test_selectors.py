"""Fixed-query read contracts for quote selectors."""

from types import SimpleNamespace
from unittest.mock import MagicMock, patch

from apps.quotes import selectors


def test_quotes_with_read_relations_batches_people_and_first_work_order():
    quotes = [
        SimpleNamespace(id=500, id_cliente=21, id_medico=31),
        SimpleNamespace(id=501, id_cliente=22, id_medico=None),
    ]
    clients = {21: SimpleNamespace(id=21), 22: SimpleNamespace(id=22)}
    doctors = {31: SimpleNamespace(id=31)}
    first = SimpleNamespace(id=900, id_preventivo=500)
    duplicate = SimpleNamespace(id=901, id_preventivo=500)
    work_order_query = MagicMock()
    work_order_query.order_by.return_value = [first, duplicate]

    with (
        patch.object(selectors.Client.objects, "in_bulk", return_value=clients) as client_query,
        patch.object(selectors.Doctor.objects, "in_bulk", return_value=doctors) as doctor_query,
        patch.object(
            selectors.WorkOrder.objects, "filter", return_value=work_order_query
        ) as work_order_filter,
    ):
        assert selectors.quotes_with_read_relations(quotes) == quotes

    client_query.assert_called_once_with({21, 22})
    doctor_query.assert_called_once_with({31})
    work_order_filter.assert_called_once_with(id_preventivo__in=[500, 501])
    work_order_query.order_by.assert_called_once_with("id")
    assert quotes[0].client is clients[21]
    assert quotes[0].doctor is doctors[31]
    assert quotes[0].work_order is first
    assert quotes[1].work_order is None


def test_quote_items_with_products_uses_two_queries_and_keeps_missing_products():
    items = [
        SimpleNamespace(id=1, codice_nomenclatore=7),
        SimpleNamespace(id=2, codice_nomenclatore=8),
    ]
    product = SimpleNamespace(id=7)
    item_query = MagicMock()
    item_query.order_by.return_value = items

    with (
        patch.object(selectors.QuoteItem.objects, "filter", return_value=item_query) as item_filter,
        patch.object(
            selectors.Product.objects, "in_bulk", return_value={7: product}
        ) as product_query,
    ):
        assert selectors.quote_items_with_products(500) == items

    item_filter.assert_called_once_with(id_preventivo=500)
    item_query.order_by.assert_called_once_with("id")
    product_query.assert_called_once_with({7, 8})
    assert items[0].product is product
    assert items[1].product is None


def test_ddt_inputs_bundle_the_required_client_and_prepared_rows():
    quote = SimpleNamespace(id=500, id_cliente=21)
    client = SimpleNamespace(id=21)
    rows = [SimpleNamespace(codice="T-7")]
    quote_query = MagicMock()
    quote_query.first.return_value = quote
    client_query = MagicMock()
    client_query.first.return_value = client

    with (
        patch.object(selectors.Quote.objects, "filter", return_value=quote_query) as quote_filter,
        patch.object(selectors.Client.objects, "filter", return_value=client_query) as client_filter,
        patch.object(selectors, "ddt_item_rows", return_value=rows) as item_rows,
    ):
        assert selectors.ddt_document_inputs(500) == (quote, client, rows)

    quote_filter.assert_called_once_with(pk=500)
    client_filter.assert_called_once_with(pk=21)
    item_rows.assert_called_once_with(500)
