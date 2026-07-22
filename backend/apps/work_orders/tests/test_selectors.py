"""Fixed-query read contracts for work-order selectors."""

from types import SimpleNamespace
from unittest.mock import MagicMock, patch

from apps.work_orders import selectors


def test_work_order_items_batch_quote_items_and_products():
    items = [
        SimpleNamespace(id=900, id_item_preventivi=41),
        SimpleNamespace(id=901, id_item_preventivi=42),
    ]
    quote_item = SimpleNamespace(id=41, codice_nomenclatore=7)
    product = SimpleNamespace(id=7)
    item_query = MagicMock()
    item_query.order_by.return_value = items

    with (
        patch.object(
            selectors.WorkOrderItem.objects, "filter", return_value=item_query
        ) as item_filter,
        patch.object(
            selectors.QuoteItem.objects, "in_bulk", return_value={41: quote_item}
        ) as quote_item_query,
        patch.object(
            selectors.Product.objects, "in_bulk", return_value={7: product}
        ) as product_query,
    ):
        assert selectors.work_order_items_with_quote_items_and_products(500) == items

    item_filter.assert_called_once_with(id_lavorazione=500)
    item_query.order_by.assert_called_once_with("id")
    quote_item_query.assert_called_once_with({41, 42})
    product_query.assert_called_once_with({7})
    assert quote_item.product is product
    assert items[0].quote_item is quote_item
    assert items[1].quote_item is None


def test_work_orders_with_read_relations_uses_one_query_per_relation():
    work_orders = [
        SimpleNamespace(id=900, id_cliente=21, id_preventivo=500),
        SimpleNamespace(id=901, id_cliente=22, id_preventivo=501),
    ]
    client = SimpleNamespace(id=21)
    quote = SimpleNamespace(id=500)

    with (
        patch.object(
            selectors.Client.objects, "in_bulk", return_value={21: client}
        ) as client_query,
        patch.object(
            selectors.Quote.objects, "in_bulk", return_value={500: quote}
        ) as quote_query,
    ):
        assert selectors.work_orders_with_read_relations(work_orders) == work_orders

    client_query.assert_called_once_with({21, 22})
    quote_query.assert_called_once_with({500, 501})
    assert work_orders[0].client is client
    assert work_orders[0].quote is quote
    assert work_orders[1].client is None
    assert work_orders[1].quote is None


def test_collaudi_inputs_return_the_complete_document_bundle():
    work_order = SimpleNamespace(id=900, id_cliente=21, id_preventivo=500)
    client = SimpleNamespace(id=21)
    quote = SimpleNamespace(id=500)
    items = [SimpleNamespace(id=1)]
    checks = [SimpleNamespace(id=2)]

    def query_with_first(value):
        query = MagicMock()
        query.first.return_value = value
        return query

    def query_with_rows(rows):
        query = MagicMock()
        query.order_by.return_value = rows
        return query

    work_order_query = query_with_first(work_order)
    client_query = query_with_first(client)
    quote_query = query_with_first(quote)
    item_query = query_with_rows(items)
    check_query = query_with_rows(checks)

    with (
        patch.object(
            selectors.WorkOrder.objects, "filter", return_value=work_order_query
        ) as work_order_filter,
        patch.object(
            selectors.Client.objects, "filter", return_value=client_query
        ) as client_filter,
        patch.object(
            selectors.Quote.objects, "filter", return_value=quote_query
        ) as quote_filter,
        patch.object(
            selectors.WorkOrderItem.objects, "filter", return_value=item_query
        ) as item_filter,
        patch.object(
            selectors.PeriodicCheck.objects, "filter", return_value=check_query
        ) as check_filter,
    ):
        assert selectors.collaudi_document_inputs(900) == (
            work_order,
            client,
            quote,
            items,
            checks,
        )

    work_order_filter.assert_called_once_with(pk=900)
    client_filter.assert_called_once_with(pk=21)
    quote_filter.assert_called_once_with(pk=500)
    item_filter.assert_called_once_with(id_lavorazione=900)
    check_filter.assert_called_once_with(id_lavorazione=900)
    item_query.order_by.assert_called_once_with("id")
    check_query.order_by.assert_called_once_with("id")
