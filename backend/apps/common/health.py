"""Hosting health endpoints with no dependency on API authentication."""

import logging

from django.db import connections
from django.http import JsonResponse
from django.views.decorators.http import require_GET

logger = logging.getLogger(__name__)


@require_GET
def liveness_check(request):
    """Confirm that Django is running and able to serve an HTTP request."""
    return JsonResponse({"status": "ok"})


@require_GET
def readiness_check(request):
    """Confirm that the API can execute a query against its configured database."""
    try:
        with connections["default"].cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except Exception:  # The driver may raise backend-specific connection errors.
        logger.exception("Database readiness check failed")
        return JsonResponse({"status": "unavailable"}, status=503)

    return JsonResponse({"status": "ok"})
