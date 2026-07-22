"""Characterization tests for quote creation, items, status, and cascade scope."""

from contextlib import nullcontext
from types import SimpleNamespace
from unittest.mock import MagicMock, call, patch

import pytest

from apps.common.exceptions import ConflictError, ServiceError
from apps.quotes.api.serializers import QuoteCreateSerializer, QuoteUpdateSerializer
from apps.quotes.api.views import QuoteStatusTransitionsView
from apps.quotes.models import Quote
from apps.quotes import services


def test_quote_create_requires_only_its_persistence_owner_at_the_api_boundary():
    missing_client = QuoteCreateSerializer(data={})
    incomplete_draft = QuoteCreateSerializer(data={"clientId": 21})
    client_query = MagicMock()
    client_query.exists.return_value = True

    assert not missing_client.is_valid()
    assert set(missing_client.errors) == {"clientId"}
    # Quote type and clinical fields remain create-screen UX policy for now.
    with patch(
        "apps.quotes.api.serializers.Client.objects.filter", return_value=client_query
    ) as client_filter:
        assert incomplete_draft.is_valid(), incomplete_draft.errors
    client_filter.assert_called_once_with(pk=21)


def test_quote_create_rejects_a_missing_legacy_client_reference():
    serializer = QuoteCreateSerializer(data={"clientId": 404})
    client_query = MagicMock()
    client_query.exists.return_value = False

    with patch("apps.quotes.api.serializers.Client.objects.filter", return_value=client_query):
        assert not serializer.is_valid()

    assert set(serializer.errors) == {"clientId"}


@pytest.mark.parametrize(
    ("payload", "model_name", "error_field"),
    [
        ({"clientId": 404}, "Client", "clientId"),
        ({"doctorId": 404}, "Doctor", "doctorId"),
    ],
)
def test_quote_update_rejects_missing_person_references(payload, model_name, error_field):
    serializer = QuoteUpdateSerializer(data=payload, partial=True)
    person_query = MagicMock()
    person_query.exists.return_value = False

    with patch(
        f"apps.quotes.api.serializers.{model_name}.objects.filter",
        return_value=person_query,
    ):
        assert not serializer.is_valid()

    assert set(serializer.errors) == {error_field}


def test_quote_update_accepts_existing_people_and_a_cleared_doctor():
    existing_person = MagicMock()
    existing_person.exists.return_value = True
    serializer = QuoteUpdateSerializer(data={"clientId": 21, "doctorId": 31}, partial=True)

    with (
        patch(
            "apps.quotes.api.serializers.Client.objects.filter",
            return_value=existing_person,
        ) as client_filter,
        patch(
            "apps.quotes.api.serializers.Doctor.objects.filter",
            return_value=existing_person,
        ) as doctor_filter,
    ):
        assert serializer.is_valid(), serializer.errors

    client_filter.assert_called_once_with(pk=21)
    doctor_filter.assert_called_once_with(pk=31)

    cleared_doctor = QuoteUpdateSerializer(data={"doctorId": None}, partial=True)
    with patch("apps.quotes.api.serializers.Doctor.objects.filter") as doctor_filter:
        assert cleared_doctor.is_valid(), cleared_doctor.errors
    doctor_filter.assert_not_called()


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
    serializer = QuoteCreateSerializer(
        data={"clientId": 21, "quoteNumber": "PR-500", "items": items}
    )
    client_query = MagicMock()
    client_query.exists.return_value = True
    with patch("apps.quotes.api.serializers.Client.objects.filter", return_value=client_query):
        assert serializer.is_valid(), serializer.errors
    quote = Quote(id=500, id_cliente=21, numero_preventivo="PR-500", stato="INSERITO")

    with (
        patch.object(services.transaction, "atomic", return_value=nullcontext()),
        patch.object(Quote.objects, "create", return_value=quote) as create,
        patch.object(services, "create_quote_item") as create_item,
        patch.object(services, "recompute_quote_total") as recompute,
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


def test_quote_creation_compensates_when_an_item_fails():
    quote = Quote(id=500, id_cliente=21, stato="INSERITO")
    quote_items = MagicMock()
    quote_row = MagicMock()
    failure = RuntimeError("item insert failed")

    with (
        patch.object(services.transaction, "atomic", return_value=nullcontext()),
        patch.object(services.Quote.objects, "create", return_value=quote),
        patch.object(services, "create_quote_item", side_effect=failure),
        patch.object(
            services.QuoteItem.objects, "filter", return_value=quote_items
        ) as items_filter,
        patch.object(services.Quote.objects, "filter", return_value=quote_row) as quote_filter,
        pytest.raises(RuntimeError, match="item insert failed"),
    ):
        services.create_quote_with_items(
            {"id_cliente": 21},
            [{"product_id": 7, "quantity": 1, "discount": None}],
        )

    items_filter.assert_called_once_with(id_preventivo=500)
    quote_filter.assert_called_once_with(pk=500)
    quote_items.delete.assert_called_once_with()
    quote_row.delete.assert_called_once_with()


def test_quote_creation_does_not_compensate_when_the_quote_insert_itself_fails():
    failure = RuntimeError("quote insert failed")

    with (
        patch.object(services.transaction, "atomic", return_value=nullcontext()),
        patch.object(services.Quote.objects, "create", side_effect=failure),
        patch.object(services.QuoteItem.objects, "filter") as items_filter,
        patch.object(services.Quote.objects, "filter") as quote_filter,
        pytest.raises(RuntimeError, match="quote insert failed"),
    ):
        services.create_quote_with_items(
            {"id_cliente": 21},
            [{"product_id": 7, "quantity": 1, "discount": None}],
        )

    items_filter.assert_not_called()
    quote_filter.assert_not_called()


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
        result = services.create_quote_item(quote_id=500, product_id=7, quantity=2, discount=25)

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


def test_create_quote_item_rejects_a_product_that_no_longer_exists():
    product_query = MagicMock()
    product_query.first.return_value = None

    with (
        patch.object(services.Product.objects, "filter", return_value=product_query),
        patch.object(services.QuoteItem.objects, "create") as create,
        patch.object(services, "recompute_quote_total") as recompute,
        pytest.raises(ServiceError, match="Prodotto inesistente"),
    ):
        services.create_quote_item(
            quote_id=500,
            product_id=404,
            quantity=1,
            discount=None,
        )

    create.assert_not_called()
    recompute.assert_not_called()


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
        patch(
            "apps.work_orders.services.create_work_order_from_quote",
            return_value=work_order,
        ) as create,
    ):
        assert (
            services.change_quote_status(quote, "IN LAVORAZIONE", note="Autorizzazione ricevuta")
            is quote
        )

    create.assert_called_once_with(quote)
    assert quote.stato == "IN LAVORAZIONE"
    assert quote.note_private == "Autorizzazione ricevuta"
    assert quote.work_order is work_order
    quote.save.assert_called_once_with(update_fields=["stato", "note_private"])


def test_allowed_status_transition_without_side_effects_updates_only_the_status():
    quote = SimpleNamespace(
        id=500,
        STATUS_TABLE="PREVENTIVI",
        stato="ACCETTATO",
        save=MagicMock(),
    )

    with (
        patch.object(services, "allowed_target_states", return_value=["SOSPESO"]),
        patch("apps.work_orders.services.create_work_order_from_quote") as create,
    ):
        assert services.change_quote_status(quote, "SOSPESO") is quote

    create.assert_not_called()
    assert quote.stato == "SOSPESO"
    assert quote.work_order is None
    quote.save.assert_called_once_with(update_fields=["stato"])


def test_rejected_status_transition_has_no_side_effects():
    quote = SimpleNamespace(
        id=500,
        STATUS_TABLE="PREVENTIVI",
        stato="INSERITO",
        save=MagicMock(),
    )

    with (
        patch.object(services, "allowed_target_states", return_value=["SOSPESO"]),
        patch("apps.work_orders.services.create_work_order_from_quote") as create,
        pytest.raises(ConflictError, match="Transizione di stato non consentita"),
    ):
        services.change_quote_status(quote, "IN LAVORAZIONE")

    create.assert_not_called()
    quote.save.assert_not_called()
    assert quote.stato == "INSERITO"


def test_status_transition_metadata_marks_work_order_side_effects():
    quote = SimpleNamespace(STATUS_TABLE="PREVENTIVI", stato="ACCETTATO")

    with patch.object(
        services,
        "allowed_target_states",
        return_value=["IN LAVORAZIONE", "SOSPESO"],
    ):
        assert services.quote_status_transition_options(quote) == [
            {"status": "IN LAVORAZIONE", "createsWorkOrder": True},
            {"status": "SOSPESO", "createsWorkOrder": False},
        ]


def test_status_transition_response_retains_strings_alongside_metadata():
    quote = SimpleNamespace(stato="ACCETTATO")
    options = [
        {"status": "IN LAVORAZIONE", "createsWorkOrder": True},
        {"status": "SOSPESO", "createsWorkOrder": False},
    ]
    view = QuoteStatusTransitionsView()

    with (
        patch.object(view, "get_object", return_value=quote),
        patch("apps.quotes.api.views.quote_status_transition_options", return_value=options),
    ):
        response = view.retrieve(MagicMock())

    assert response.data == {
        "current": "ACCETTATO",
        "available": ["IN LAVORAZIONE", "SOSPESO"],
        "options": options,
    }


def test_delete_quote_removes_only_its_work_orders_and_lines():
    work_order_lookup = MagicMock()
    work_order_lookup.values_list.return_value = [900, 901]
    work_order_delete = MagicMock()
    work_order_item_delete = MagicMock()
    quote_item_delete = MagicMock()
    quote_delete = MagicMock()

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
        patch.object(services.Quote.objects, "filter", return_value=quote_delete) as quote_filter,
    ):
        services.delete_quote_graph(500)

    assert work_order_filter.call_args_list == [
        call(id_preventivo=500),
        call(id__in=[900, 901]),
    ]
    work_order_item_filter.assert_called_once_with(id_lavorazione__in=[900, 901])
    quote_item_filter.assert_called_once_with(id_preventivo=500)
    quote_filter.assert_called_once_with(pk=500)
    work_order_item_delete.delete.assert_called_once_with()
    work_order_delete.delete.assert_called_once_with()
    quote_item_delete.delete.assert_called_once_with()
    quote_delete.delete.assert_called_once_with()


def test_delete_quote_without_a_work_order_skips_work_order_deletes():
    work_order_lookup = MagicMock()
    work_order_lookup.values_list.return_value = []
    quote_item_delete = MagicMock()
    quote_delete = MagicMock()

    with (
        patch("apps.quotes.services.transaction.atomic", return_value=nullcontext()),
        patch(
            "apps.work_orders.models.WorkOrder.objects.filter",
            return_value=work_order_lookup,
        ) as work_order_filter,
        patch("apps.work_orders.models.WorkOrderItem.objects.filter") as work_order_item_filter,
        patch.object(
            services.QuoteItem.objects,
            "filter",
            return_value=quote_item_delete,
        ),
        patch.object(
            services.Quote.objects,
            "filter",
            return_value=quote_delete,
        ),
    ):
        services.delete_quote_graph(500)

    work_order_filter.assert_called_once_with(id_preventivo=500)
    work_order_item_filter.assert_not_called()
    quote_item_delete.delete.assert_called_once_with()
    quote_delete.delete.assert_called_once_with()
