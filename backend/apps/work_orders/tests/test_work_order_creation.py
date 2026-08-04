"""Work-order creation decisions and compensation against mocked legacy managers."""

from types import SimpleNamespace
from unittest.mock import MagicMock, call, patch

import pytest

from apps.work_orders import services
from apps.work_orders.services import WORK_ORDER_TRIGGER_STATES, _code_to_int


def test_both_in_lavorazione_states_trigger_creation():
    assert "IN LAVORAZIONE" in WORK_ORDER_TRIGGER_STATES
    assert "IN LAVORAZIONE SENZA AUTORIZZAZIONE" in WORK_ORDER_TRIGGER_STATES


def test_other_states_do_not_trigger_creation():
    for state in ("ACCETTATO", "SOSPESO", "CONSEGNATO", "AUTORIZZATO", ""):
        assert state not in WORK_ORDER_TRIGGER_STATES


def test_code_to_int_strips_leading_zeros_like_the_legacy_insert():
    assert _code_to_int("01012105") == 1012105
    assert _code_to_int("122403109") == 122403109


def test_code_to_int_passes_through_an_integer():
    assert _code_to_int(122403109) == 122403109


def test_code_to_int_returns_none_for_missing_or_non_numeric():
    assert _code_to_int(None) is None
    assert _code_to_int("") is None
    assert _code_to_int("ABC-1") is None


def test_work_order_for_quote_returns_the_first_matching_row():
    work_order = SimpleNamespace(id=900)
    query = MagicMock()
    query.first.return_value = work_order

    with patch.object(
        services.WorkOrder.objects, "filter", return_value=query
    ) as work_order_filter:
        assert services.work_order_for_quote(500) is work_order

    work_order_filter.assert_called_once_with(id_preventivo=500)


def test_creation_reuses_an_existing_work_order_without_writing_rows():
    quote = SimpleNamespace(id=500, id_cliente=21)
    existing = SimpleNamespace(id=900)

    with (
        patch.object(services, "work_order_for_quote", return_value=existing),
        patch.object(services.WorkOrder.objects, "create") as create_order,
        patch.object(services.WorkOrderItem.objects, "create") as create_item,
    ):
        assert services.create_work_order_from_quote(quote) is existing

    create_order.assert_not_called()
    create_item.assert_not_called()


def test_creation_copies_the_quote_doctor_name_to_the_signature_field():
    quote = SimpleNamespace(id=500, id_cliente=21, id_medico=31)
    doctor = SimpleNamespace(nome="Luca", cognome="Bianchi")
    doctor_query = MagicMock()
    doctor_query.first.return_value = doctor
    work_order = SimpleNamespace(id=900)
    item_query = MagicMock()
    item_query.order_by.return_value = []

    with (
        patch.object(services, "work_order_for_quote", return_value=None),
        patch.object(services.timezone, "localdate", return_value="2026-07-22"),
        patch.object(services.Doctor.objects, "filter", return_value=doctor_query) as doctor_filter,
        patch.object(services.WorkOrder.objects, "create", return_value=work_order) as create_order,
        patch.object(services.QuoteItem.objects, "filter", return_value=item_query),
        patch.object(services.Product.objects, "filter", return_value=[]),
    ):
        assert services.create_work_order_from_quote(quote) is work_order

    doctor_filter.assert_called_once_with(pk=31)
    create_order.assert_called_once_with(
        id_preventivo=500,
        id_cliente=21,
        stato="IN LAVORAZIONE",
        data_creazione_lavorazione="2026-07-22",
        firma_medico="Luca Bianchi",
    )


def test_creation_builds_lines_with_and_without_catalogue_products():
    quote = SimpleNamespace(id=500, id_cliente=21)
    work_order = SimpleNamespace(id=900)
    items = [
        SimpleNamespace(
            id=41,
            codice_nomenclatore=7,
            importo=60,
            quantita=2,
        ),
        SimpleNamespace(
            id=42,
            codice_nomenclatore=8,
            importo=20,
            quantita=1,
        ),
    ]
    product = SimpleNamespace(id=7, codice="0007", descrizione="Tutore")
    item_query = MagicMock()
    item_query.order_by.return_value = items

    with (
        patch.object(services, "work_order_for_quote", return_value=None),
        patch.object(services.timezone, "localdate", return_value="2026-07-22"),
        patch.object(services.WorkOrder.objects, "create", return_value=work_order) as create_order,
        patch.object(services.QuoteItem.objects, "filter", return_value=item_query) as item_filter,
        patch.object(services.Product.objects, "filter", return_value=[product]) as product_filter,
        patch.object(services.WorkOrderItem.objects, "create") as create_item,
    ):
        assert services.create_work_order_from_quote(quote) is work_order

    create_order.assert_called_once_with(
        id_preventivo=500,
        id_cliente=21,
        stato="IN LAVORAZIONE",
        data_creazione_lavorazione="2026-07-22",
        firma_medico=None,
    )
    item_filter.assert_called_once_with(id_preventivo=500)
    item_query.order_by.assert_called_once_with("id")
    product_filter.assert_called_once_with(id__in={7, 8})
    assert create_item.call_args_list == [
        call(
            id_item_preventivi=41,
            id_lavorazione=900,
            codice_nomenclatore=7,
            descrizione_nomenclatore="Tutore",
            importo=60,
            quantita=2,
            stato="IN LAVORAZIONE",
            data_creazione_lavorazione="2026-07-22",
        ),
        call(
            id_item_preventivi=42,
            id_lavorazione=900,
            codice_nomenclatore=None,
            descrizione_nomenclatore=None,
            importo=20,
            quantita=1,
            stato="IN LAVORAZIONE",
            data_creazione_lavorazione="2026-07-22",
        ),
    ]


def test_creation_removes_partial_rows_when_line_creation_fails():
    quote = SimpleNamespace(id=500, id_cliente=21)
    work_order = SimpleNamespace(id=900, delete=MagicMock())
    item = SimpleNamespace(
        id=41,
        codice_nomenclatore=7,
        importo=60,
        quantita=2,
    )
    product = SimpleNamespace(id=7, codice="7", descrizione="Tutore")
    item_query = MagicMock()
    item_query.order_by.return_value = [item]
    partial_items = MagicMock()

    with (
        patch.object(services, "work_order_for_quote", return_value=None),
        patch.object(services.WorkOrder.objects, "create", return_value=work_order),
        patch.object(services.QuoteItem.objects, "filter", return_value=item_query),
        patch.object(services.Product.objects, "filter", return_value=[product]),
        patch.object(
            services.WorkOrderItem.objects,
            "create",
            side_effect=RuntimeError("line insert failed"),
        ),
        patch.object(
            services.WorkOrderItem.objects,
            "filter",
            return_value=partial_items,
        ) as item_filter,
        pytest.raises(RuntimeError, match="line insert failed"),
    ):
        services.create_work_order_from_quote(quote)

    item_filter.assert_called_once_with(id_lavorazione=900)
    partial_items.delete.assert_called_once_with()
    work_order.delete.assert_called_once_with()
