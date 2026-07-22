"""Authoritative quote-expiry derivation and serializer integration."""

from datetime import date
from unittest.mock import MagicMock, patch

import pytest

from apps.quotes.api.serializers import QuoteCreateSerializer, QuoteUpdateSerializer
from apps.quotes.services import max_expiry_from_days


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        (None, ""),
        ("", ""),
        ("  ", ""),
        ("0", "2026-07-22"),
        ("10", "2026-08-01"),
    ],
)
def test_max_expiry_from_days(raw, expected):
    assert max_expiry_from_days(raw, today=date(2026, 7, 22)) == expected


@pytest.mark.parametrize("raw", ["-1", "1.5", "abc"])
def test_max_expiry_rejects_invalid_nonblank_days(raw):
    with pytest.raises(ValueError):
        max_expiry_from_days(raw, today=date(2026, 7, 22))


def test_quote_create_derives_expiry_and_ignores_client_control_of_stored_date():
    serializer = QuoteCreateSerializer(
        data={"clientId": 21, "expiryDays": "10", "maxExpiry": "2099-01-01"}
    )
    client_query = MagicMock()
    client_query.exists.return_value = True

    with (
        patch(
            "apps.quotes.api.serializers.timezone.localdate",
            return_value=date(2026, 7, 22),
        ),
        patch(
            "apps.quotes.api.serializers.Client.objects.filter",
            return_value=client_query,
        ),
    ):
        assert serializer.is_valid(), serializer.errors

    assert serializer.validated_data["giorni_scadenza"] == "10"
    assert serializer.validated_data["massima_scadenza"] == "2026-08-01"


def test_quote_update_rejects_invalid_days_as_an_api_field_error():
    serializer = QuoteUpdateSerializer(data={"expiryDays": "-1"}, partial=True)

    assert not serializer.is_valid()
    assert set(serializer.errors) == {"expiryDays"}
