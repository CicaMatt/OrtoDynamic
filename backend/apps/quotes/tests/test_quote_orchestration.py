"""Characterization tests for quote creation, items, status, and cascade scope."""

from contextlib import nullcontext
from types import SimpleNamespace
from unittest.mock import MagicMock, call, patch

import pytest

from apps.common.exceptions import ConflictError
from apps.quotes.api.serializers import QuoteCreateSerializer
from apps.quotes.models import Quote
from apps.quotes import services


@pytest.mark.parametrize(
    ("items", "expected_item_calls", "initializes_empty_total"),
    [
        ([], [], True),
        (
            [{"productId": 7, "quantity": 2, "discount": 10}],
            [call(quote_id=500, product_id=7, quantity=2.0, discount=10.0)],
            False,
        ),
        (
            [
                {"productId": 7, "quantity": 2, "discount": None},
                {"productId": 8, "quantity": 1, "discount": 25},
            ],
            [
                call(quote_id=500, product_id=7, quantity=2.0, discount=None),
                call(quote_id=500, product_id=8, quantity=1.0, discount=25.0),
            ],
            False,
        ),
    ],
)
def test_quote_creation_with_initial_items(items, expected_item_calls, initializes_empty_total):
    serializer = QuoteCreateSerializer(data={"clientId": 21, "quoteNumber": "PR-500", "items": items})
    assert serializer.is_valid(), serializer.errors
    quote = Quote(id=500, id_cliente=21, numero_preventivo="PR-500", stato="INSERITO")

    with (
        patch("apps.quotes.api.serializers.transaction.atomic", return_value=nullcontext()),
        patch.object(Quote.objects, "create", return_value=quote) as create,
        patch("apps.quotes.api.serializers.create_quote_item") as create_item,
        patch("apps.quotes.api.serializers.recompute_quote_total") as recompute,
    ):
        assert serializer.save() is quote

    create.assert_called_once_with(
        id_cliente=21,
        numero_preventivo="PR-500",
        stato="INSERITO",
    )
    assert create_item.call_args_list == expected_item_calls
    if initializes_empty_total:
        recompute.assert_called_once_with(500)
    else:
        recompute.assert_not_called()


def test_create_quote_item_derives_money_and_recomputes_total():
    product = SimpleNamespace(id=7, prezzo=40.0)
    product_query = MagicMock()
    product_query.first.return_value = product
    item = SimpleNamespace(id=3)

    with (
        patch.object(services.Product.objects, "filter", return_value=product_query),
        patch.object(services.QuoteItem.objects, "create", return_value=item) as create,
        patch.object(services, "recompute_quote_total") as recompute,
    ):
        result = services.create_quote_item(
            quote_id=500, product_id=7, quantity=2, discount=25
        )

    assert result is item
    assert item.product is product
    create.assert_called_once_with(
        id_preventivo=500,
        codice_nomenclatore=7,
        quantita=2,
        prezzo=40.0,
        importo=60.0,
        sconto=25,
    )
    recompute.assert_called_once_with(500)


def test_update_and_delete_quote_items_recompute_the_parent_total():
    item = SimpleNamespace(
        id_preventivo=500,
        prezzo=30.0,
        quantita=1,
        sconto=None,
        importo=30.0,
        save=MagicMock(),
        delete=MagicMock(),
    )

    with patch.object(services, "recompute_quote_total") as recompute:
        assert services.update_quote_item(quote_item=item, quantity=3, discount=10) is item
        services.delete_quote_item(item)

    assert (item.quantita, item.sconto, item.importo) == (3, 10, 81.0)
    item.save.assert_called_once_with(update_fields=["quantita", "sconto", "importo"])
    item.delete.assert_called_once_with()
    assert recompute.call_args_list == [call(500), call(500)]


def test_recompute_quote_total_uses_item_sum_and_persists_zero_for_no_items():
    item_query = MagicMock()
    item_query.aggregate.return_value = {"total": None}
    quote_query = MagicMock()

    with (
        patch.object(services.QuoteItem.objects, "filter", return_value=item_query),
        patch.object(services.Quote.objects, "filter", return_value=quote_query),
    ):
        assert services.recompute_quote_total(500) == 0.0

    quote_query.update.assert_called_once_with(totale=0.0)


def test_allowed_status_transition_saves_note_and_attaches_work_order():
    quote = SimpleNamespace(
        id=500,
        STATUS_TABLE="PREVENTIVI",
        stato="ACCETTATO",
        note_private=None,
        save=MagicMock(),
    )
    work_order = SimpleNamespace(id=900)

    with (
        patch.object(services, "allowed_target_states", return_value=["IN LAVORAZIONE"]),
        patch.object(services, "create_work_order_from_quote", return_value=work_order) as create,
    ):
        assert services.change_quote_status(
            quote, "IN LAVORAZIONE", note="Autorizzazione ricevuta"
        ) is quote

    create.assert_called_once_with(quote)
    assert quote.stato == "IN LAVORAZIONE"
    assert quote.note_private == "Autorizzazione ricevuta"
    assert quote.work_order is work_order
    quote.save.assert_called_once_with(update_fields=["stato", "note_private"])


def test_rejected_status_transition_has_no_side_effects():
    quote = SimpleNamespace(
        id=500,
        STATUS_TABLE="PREVENTIVI",
        stato="INSERITO",
        save=MagicMock(),
    )

    with (
        patch.object(services, "allowed_target_states", return_value=["SOSPESO"]),
        patch.object(services, "create_work_order_from_quote") as create,
        pytest.raises(ConflictError, match="Transizione di stato non consentita"),
    ):
        services.change_quote_status(quote, "IN LAVORAZIONE")

    create.assert_not_called()
    quote.save.assert_not_called()
    assert quote.stato == "INSERITO"


def test_delete_quote_removes_only_its_work_orders_and_lines():
    quote = SimpleNamespace(id=500, delete=MagicMock())
    work_order_lookup = MagicMock()
    work_order_lookup.values_list.return_value = [900, 901]
    work_order_delete = MagicMock()
    work_order_item_delete = MagicMock()
    quote_item_delete = MagicMock()

    with (
        patch("apps.quotes.services.transaction.atomic", return_value=nullcontext()),
        patch(
            "apps.work_orders.models.WorkOrder.objects.filter",
            side_effect=[work_order_lookup, work_order_delete],
        ) as work_order_filter,
        patch(
            "apps.work_orders.models.WorkOrderItem.objects.filter",
            return_value=work_order_item_delete,
        ) as work_order_item_filter,
        patch.object(
            services.QuoteItem.objects, "filter", return_value=quote_item_delete
        ) as quote_item_filter,
    ):
        services.delete_quote_with_related(quote)

    assert work_order_filter.call_args_list == [
        call(id_preventivo=500),
        call(id__in=[900, 901]),
    ]
    work_order_item_filter.assert_called_once_with(id_lavorazione__in=[900, 901])
    quote_item_filter.assert_called_once_with(id_preventivo=500)
    work_order_item_delete.delete.assert_called_once_with()
    work_order_delete.delete.assert_called_once_with()
    quote_item_delete.delete.assert_called_once_with()
    quote.delete.assert_called_once_with()
