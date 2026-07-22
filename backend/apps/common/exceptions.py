"""
Centralised API error handling.

Domain/service code raises `ServiceError` (or a subclass) to signal an expected,
client-facing failure. `api_exception_handler` turns both these and standard DRF
exceptions into a single, consistent JSON error envelope so the React frontend
can handle every error the same way.
"""
from __future__ import annotations

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler


class ServiceError(Exception):
    """Base class for expected, client-facing errors raised by the service layer."""

    status_code = status.HTTP_400_BAD_REQUEST
    default_message = "The request could not be processed."

    def __init__(self, message: str | None = None):
        self.message = message or self.default_message
        super().__init__(self.message)


class NotFoundError(ServiceError):
    status_code = status.HTTP_404_NOT_FOUND
    default_message = "The requested resource was not found."


class ConflictError(ServiceError):
    """Invalid state transition or a constraint that the request would violate."""

    status_code = status.HTTP_409_CONFLICT
    default_message = "The request conflicts with the current state of the resource."


class TemplateAssetMissing(ServiceError):
    """A required pre-printed PDF template asset is not installed — a server-side error.

    Raised by the template-backed document generators (privacy form, collaudi sheet)
    when their background template is absent, so the client sees a clear message
    instead of an unhandled 500.
    """

    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_message = "Modello del documento non disponibile."


def api_exception_handler(exc, context):
    """DRF exception handler that normalises errors into `{"error": {...}}`."""
    if isinstance(exc, ServiceError):
        return Response(
            {"error": {"message": exc.message}},
            status=exc.status_code,
        )

    response = drf_exception_handler(exc, context)
    if response is not None:
        fields = _field_messages(response.data)
        error = {"message": _primary_message(response.data, fields)}
        if fields:
            error["fields"] = fields
        response.data = {"error": error}
    return response


def _field_messages(detail):
    if not isinstance(detail, dict):
        return {}
    fields = {}
    for field, value in detail.items():
        if field in {"detail", "non_field_errors"}:
            continue
        messages = _messages(value)
        if messages:
            fields[str(field)] = messages
    return fields


def _primary_message(detail, fields):
    if isinstance(detail, dict):
        for key in ("detail", "non_field_errors"):
            messages = _messages(detail.get(key))
            if messages:
                return messages[0]
    elif messages := _messages(detail):
        return messages[0]
    if fields:
        return "Controlla i campi evidenziati."
    return "Richiesta non valida."


def _messages(value):
    if value is None:
        return []
    if isinstance(value, dict):
        return [message for nested in value.values() for message in _messages(nested)]
    if isinstance(value, (list, tuple)):
        return [message for nested in value for message in _messages(nested)]
    return [str(value)]
