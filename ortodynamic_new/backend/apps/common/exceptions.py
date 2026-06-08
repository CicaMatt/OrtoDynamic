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


def api_exception_handler(exc, context):
    """DRF exception handler that normalises errors into `{"error": {...}}`."""
    if isinstance(exc, ServiceError):
        return Response(
            {"error": {"message": exc.message}},
            status=exc.status_code,
        )

    response = drf_exception_handler(exc, context)
    if response is not None:
        response.data = {"error": response.data}
    return response
