"""API contract for dashboard quote metrics."""

from types import SimpleNamespace
from unittest.mock import patch

from rest_framework.test import APIRequestFactory, force_authenticate

from apps.quotes.api.views import (
    DASHBOARD_QUOTE_STATUSES,
    QuoteDashboardMetricsView,
)


factory = APIRequestFactory()
user = SimpleNamespace(is_authenticated=True)


def test_dashboard_metrics_returns_all_configured_status_counts():
    metrics = {"INSERITO": 7, "INVIATO": 3, "IN LAVORAZIONE": 2}
    request = factory.get("/api/v1/quotes/dashboard-metrics/")
    force_authenticate(request, user=user)

    with patch(
        "apps.quotes.api.views.quote_status_counts", return_value=metrics
    ) as status_counts:
        response = QuoteDashboardMetricsView.as_view()(request)

    assert response.status_code == 200
    assert response.data == metrics
    status_counts.assert_called_once_with(DASHBOARD_QUOTE_STATUSES)
