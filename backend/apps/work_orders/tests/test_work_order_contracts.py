"""Work-order orchestration, validation, and relation response contracts."""

from contextlib import nullcontext
from datetime import date
from types import SimpleNamespace
from unittest.mock import MagicMock, call, patch

import pytest

from apps.clients.models import Client
from apps.doctors.models import Doctor
from apps.quotes.api.serializers import QuoteSerializer
from apps.quotes.models import Quote, QuoteItem
from apps.work_orders.api.serializers import (
    WorkOrderItemSerializer,
    WorkOrderItemUpdateSerializer,
    WorkOrderSerializer,
)
from apps.work_orders.models import WorkOrder, WorkOrderItem
from apps.work_orders import services


def test_work_order_creation_is_idempotent_for_a_quote():
    quote = SimpleNamespace(id=500)
    existing = SimpleNamespace(id=900)

    with (
        patch.object(services, "work_order_for_quote", return_value=existing),
        patch.object(services.WorkOrder.objects, "create") as create,
    ):
        assert services.create_work_order_from_quote(quote) is existing

    create.assert_not_called()


def test_delete_work_order_removes_its_quote_and_all_same_quote_siblings():
    work_order = SimpleNamespace(id=900, id_preventivo=500)
    lookup = MagicMock()
    lookup.values_list.return_value = [901]
    work_order_delete = MagicMock()
    item_delete = MagicMock()
    quote_item_delete = MagicMock()
    quote_delete = MagicMock()

    with (
        patch.object(services.transaction, "atomic", return_value=nullcontext()),
        patch.object(
            services.WorkOrder.objects,
            "filter",
            side_effect=[lookup, work_order_delete],
        ) as work_order_filter,
        patch.object(
            services.WorkOrderItem.objects, "filter", return_value=item_delete
        ) as item_filter,
        patch.object(
            services.QuoteItem.objects, "filter", return_value=quote_item_delete
        ) as quote_item_filter,
        patch.object(
            services.Quote.objects, "filter", return_value=quote_delete
        ) as quote_filter,
    ):
        services.delete_work_order_with_related(work_order)

    assert work_order_filter.call_args_list == [
        call(id_preventivo=500),
        call(id__in=[901, 900]),
    ]
    item_filter.assert_called_once_with(id_lavorazione__in=[901, 900])
    quote_item_filter.assert_called_once_with(id_preventivo=500)
    quote_filter.assert_called_once_with(pk=500)
    item_delete.delete.assert_called_once_with()
    work_order_delete.delete.assert_called_once_with()
    quote_item_delete.delete.assert_called_once_with()
    quote_delete.delete.assert_called_once_with()


@pytest.mark.parametrize(
    ("payload", "error_field"),
    [
        ({"status": "ANNULLATO"}, "cancellationDate"),
        ({"status": "CONSEGNATO"}, "deliveryDate"),
        ({"status": "PRONTO", "cancellationDate": "2026-07-21"}, "cancellationDate"),
        ({"status": "PRONTO", "deliveryDate": "2026-07-21"}, "deliveryDate"),
    ],
)
def test_work_order_item_conditional_dates_reject_invalid_results(payload, error_field):
    instance = SimpleNamespace(
        stato="IN LAVORAZIONE",
        data_annullamento=None,
        data_consegna=None,
    )
    serializer = WorkOrderItemUpdateSerializer(instance, data=payload, partial=True)

    assert not serializer.is_valid()
    assert error_field in serializer.errors


@pytest.mark.parametrize(
    "payload",
    [
        {"status": "ANNULLATO", "cancellationDate": "2026-07-21"},
        {"status": "CONSEGNATO", "deliveryDate": "2026-07-21"},
        {"production": "ESTERNA"},
    ],
)
def test_work_order_item_conditional_dates_accept_valid_results(payload):
    instance = SimpleNamespace(
        stato="IN LAVORAZIONE",
        data_annullamento=None,
        data_consegna=None,
    )
    serializer = WorkOrderItemUpdateSerializer(instance, data=payload, partial=True)

    assert serializer.is_valid(), serializer.errors


def test_quote_read_contract_contains_attached_relation_names_and_work_order_id():
    quote = Quote(
        id=500,
        id_cliente=21,
        id_medico=31,
        numero_preventivo="PR-500",
        stato="ACCETTATO",
    )
    quote.client = Client(id=21, nome="Ada", cognome="Rossi", citta="Roma")
    quote.doctor = Doctor(id=31, nome="Luca", cognome="Bianchi")
    quote.work_order = WorkOrder(id=900, id_preventivo=500)

    data = QuoteSerializer(quote).data

    assert {
        "clientId": data["clientId"],
        "clientName": data["clientName"],
        "clientCity": data["clientCity"],
        "doctorId": data["doctorId"],
        "doctorName": data["doctorName"],
        "workOrderId": data["workOrderId"],
    } == {
        "clientId": "21",
        "clientName": "Ada Rossi",
        "clientCity": "Roma",
        "doctorId": "31",
        "doctorName": "Luca Bianchi",
        "workOrderId": "900",
    }


def test_work_order_and_item_read_contracts_contain_attached_relations():
    work_order = WorkOrder(
        id=900,
        id_preventivo=500,
        id_cliente=21,
        stato="IN LAVORAZIONE",
        data_creazione_lavorazione=date(2026, 7, 1),
    )
    work_order.client = Client(id=21, nome="Ada", cognome="Rossi")
    work_order.quote = Quote(id=500, id_cliente=21, stato="ACCETTATO")

    work_order_data = WorkOrderSerializer(work_order).data
    assert {
        "idWorkOrder": work_order_data["idWorkOrder"],
        "quoteId": work_order_data["quoteId"],
        "clientId": work_order_data["clientId"],
        "clientName": work_order_data["clientName"],
        "quoteStatus": work_order_data["quoteStatus"],
        "creationDate": work_order_data["creationDate"],
    } == {
        "idWorkOrder": "900",
        "quoteId": "500",
        "clientId": "21",
        "clientName": "Ada Rossi",
        "quoteStatus": "ACCETTATO",
        "creationDate": "2026-07-01",
    }

    item = WorkOrderItem(id=901, id_lavorazione=900, stato="IN LAVORAZIONE")
    item.quote_item = QuoteItem(
        id=41,
        id_preventivo=500,
        codice_nomenclatore=7,
        quantita=2,
        prezzo=40,
        importo=80,
        sconto=None,
    )
    item.quote_item.product = SimpleNamespace(codice="T-7", descrizione="Tutore")

    assert WorkOrderItemSerializer(item).data == {
        "id": "901",
        "productId": "7",
        "productCode": "T-7",
        "productDescription": "Tutore",
        "quantity": "2",
        "price": "40",
        "amount": "80",
        "discount": "",
        "status": "IN LAVORAZIONE",
        "production": "",
        "cancellationDate": "",
        "orderDate": "",
        "partialDeliveryDate": "",
        "deliveryDate": "",
    }
