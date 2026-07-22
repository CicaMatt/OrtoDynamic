"""JSON error-envelope contracts for document endpoints."""

from types import SimpleNamespace
from unittest.mock import MagicMock, patch

from rest_framework.test import APIRequestFactory, force_authenticate

from apps.clients.api.views import ClientPrivacyFormView
from apps.common.exceptions import NotFoundError
from apps.quotes.api.views import QuoteDdtView, QuoteDeliveryFormView
from apps.work_orders.api.views import WorkOrderCollaudiView


factory = APIRequestFactory()
user = SimpleNamespace(is_authenticated=True)


def authenticated_get(path):
    request = factory.get(path)
    force_authenticate(request, user=user)
    return request


def test_delivery_form_invalid_date_uses_the_service_error_envelope():
    quote = SimpleNamespace(id=500, id_cliente=21)
    client = SimpleNamespace(id=21)

    with patch(
        "apps.quotes.api.views.delivery_form_inputs", return_value=(quote, client)
    ):
        response = QuoteDeliveryFormView.as_view()(
            authenticated_get("/quotes/500/delivery-form/?delivery_date=21-07-2026"),
            pk=500,
        )

    assert response.status_code == 400
    assert response.data == {
        "error": {"message": "Data modulo di consegna non valida."}
    }


def test_client_privacy_form_not_found_uses_the_error_envelope():
    query = MagicMock()
    query.first.return_value = None

    with patch("apps.clients.api.views.Client.objects.filter", return_value=query):
        response = ClientPrivacyFormView.as_view()(
            authenticated_get("/clients/404/privacy-form/"), pk=404
        )

    assert response.status_code == 404
    assert response.data == {"error": {"message": "Cliente inesistente."}}


def test_quote_document_not_found_uses_the_error_envelope():
    with patch(
        "apps.quotes.api.views.ddt_document_inputs",
        side_effect=NotFoundError("Preventivo non trovato."),
    ):
        response = QuoteDdtView.as_view()(
            authenticated_get("/quotes/404/ddt/"), pk=404
        )

    assert response.status_code == 404
    assert response.data == {"error": {"message": "Preventivo non trovato."}}


def test_work_order_document_not_found_uses_the_error_envelope():
    with patch(
        "apps.work_orders.api.views.collaudi_document_inputs",
        side_effect=NotFoundError("Lavorazione inesistente."),
    ):
        response = WorkOrderCollaudiView.as_view()(
            authenticated_get("/work-orders/404/collaudi/"), pk=404
        )

    assert response.status_code == 404
    assert response.data == {"error": {"message": "Lavorazione inesistente."}}
