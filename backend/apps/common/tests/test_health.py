"""Public liveness and database-readiness endpoint contracts."""

from unittest.mock import MagicMock, patch


def test_liveness_check_is_public(client):
    response = client.get("/health/live/")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@patch("apps.common.health.connections")
def test_readiness_check_reports_database_availability(connections, client):
    cursor = MagicMock()
    connections.__getitem__.return_value.cursor.return_value.__enter__.return_value = cursor

    response = client.get("/health/ready/")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    cursor.execute.assert_called_once_with("SELECT 1")
    cursor.fetchone.assert_called_once_with()


@patch("apps.common.health.connections")
def test_readiness_check_returns_503_without_leaking_database_errors(connections, client):
    connections.__getitem__.return_value.cursor.side_effect = RuntimeError("secret details")

    response = client.get("/health/ready/")

    assert response.status_code == 503
    assert response.json() == {"status": "unavailable"}
    assert b"secret details" not in response.content
