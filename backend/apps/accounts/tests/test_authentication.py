"""Decision-level tests for legacy credentials and bearer-token authentication."""

from types import SimpleNamespace
from unittest.mock import MagicMock, call, patch

import pytest
from rest_framework import exceptions
from rest_framework.test import APIRequestFactory

from apps.accounts.api.authentication import BearerTokenAuthentication
from apps.accounts.backends import LegacyUserBackend


def _query_returning(value):
    query = MagicMock()
    query.first.return_value = value
    return query


@pytest.mark.parametrize(
    ("username", "password"),
    [(None, "secret"), ("matteo", None), ("", "secret"), ("matteo", "")],
)
def test_legacy_backend_ignores_incomplete_credentials(username, password):
    backend = LegacyUserBackend()

    with patch("apps.accounts.backends.User.objects.filter") as user_filter:
        assert backend.authenticate(None, username=username, password=password) is None

    user_filter.assert_not_called()


def test_legacy_backend_accepts_username_without_an_email_lookup():
    user = SimpleNamespace(is_active=True, check_password=MagicMock(return_value=True))

    with patch(
        "apps.accounts.backends.User.objects.filter",
        return_value=_query_returning(user),
    ) as user_filter:
        assert LegacyUserBackend().authenticate(None, username="matteo", password="secret") is user

    user_filter.assert_called_once_with(username="matteo")
    user.check_password.assert_called_once_with("secret")


def test_legacy_backend_falls_back_to_email():
    user = SimpleNamespace(is_active=True, check_password=MagicMock(return_value=True))
    missing = _query_returning(None)
    by_email = _query_returning(user)

    with patch(
        "apps.accounts.backends.User.objects.filter",
        side_effect=[missing, by_email],
    ) as user_filter:
        assert (
            LegacyUserBackend().authenticate(
                None,
                username="matteo@example.test",
                password="secret",
            )
            is user
        )

    assert user_filter.call_args_list == [
        call(username="matteo@example.test"),
        call(email="matteo@example.test"),
    ]


def test_legacy_backend_equalizes_timing_for_an_unknown_user():
    missing = _query_returning(None)

    with (
        patch("apps.accounts.backends.User.objects.filter", return_value=missing),
        patch("apps.accounts.backends.verify_legacy_password") as verify,
    ):
        assert LegacyUserBackend().authenticate(None, username="missing", password="secret") is None

    verify.assert_called_once()
    assert verify.call_args.args[0] == "secret"


@pytest.mark.parametrize(
    ("password_matches", "active"),
    [(False, True), (True, False)],
)
def test_legacy_backend_rejects_wrong_passwords_and_inactive_users(password_matches, active):
    user = SimpleNamespace(
        is_active=active,
        check_password=MagicMock(return_value=password_matches),
    )

    with patch(
        "apps.accounts.backends.User.objects.filter",
        return_value=_query_returning(user),
    ):
        assert LegacyUserBackend().authenticate(None, username="matteo", password="secret") is None


@pytest.mark.parametrize(
    ("user", "expected"),
    [
        (None, None),
        (SimpleNamespace(is_active=False), None),
    ],
)
def test_legacy_backend_get_user_rejects_missing_and_inactive_accounts(user, expected):
    with patch(
        "apps.accounts.backends.User.objects.filter",
        return_value=_query_returning(user),
    ) as user_filter:
        assert LegacyUserBackend().get_user(7) is expected

    user_filter.assert_called_once_with(pk=7)


def test_legacy_backend_get_user_returns_an_active_account():
    user = SimpleNamespace(is_active=True)

    with patch(
        "apps.accounts.backends.User.objects.filter",
        return_value=_query_returning(user),
    ):
        assert LegacyUserBackend().get_user(7) is user


factory = APIRequestFactory()


@pytest.mark.parametrize("header", [None, "Basic abc123"])
def test_bearer_authentication_ignores_requests_without_bearer_credentials(header):
    kwargs = {"HTTP_AUTHORIZATION": header} if header else {}
    request = factory.get("/api/v1/auth/session/", **kwargs)

    assert BearerTokenAuthentication().authenticate(request) is None


@pytest.mark.parametrize("header", ["Bearer", "Bearer one two"])
def test_bearer_authentication_rejects_malformed_headers(header):
    request = factory.get("/api/v1/auth/session/", HTTP_AUTHORIZATION=header)

    with pytest.raises(exceptions.AuthenticationFailed, match="Invalid Authorization header"):
        BearerTokenAuthentication().authenticate(request)


def test_bearer_authentication_rejects_invalid_or_expired_tokens():
    request = factory.get(
        "/api/v1/auth/session/",
        HTTP_AUTHORIZATION="Bearer expired-token",
    )

    with (
        patch("apps.accounts.api.authentication.read_token", return_value=None) as read_token,
        pytest.raises(exceptions.AuthenticationFailed, match="Invalid or expired token"),
    ):
        BearerTokenAuthentication().authenticate(request)

    read_token.assert_called_once()


@pytest.mark.parametrize("user", [None, SimpleNamespace(is_active=False)])
def test_bearer_authentication_rejects_missing_and_inactive_accounts(user):
    request = factory.get(
        "/api/v1/auth/session/",
        HTTP_AUTHORIZATION="Bearer signed-token",
    )

    with (
        patch("apps.accounts.api.authentication.read_token", return_value=7),
        patch(
            "apps.accounts.api.authentication.User.objects.filter",
            return_value=_query_returning(user),
        ) as user_filter,
        pytest.raises(exceptions.AuthenticationFailed, match="Invalid or expired token"),
    ):
        BearerTokenAuthentication().authenticate(request)

    user_filter.assert_called_once_with(pk=7)


def test_bearer_authentication_returns_the_active_user_and_original_token():
    user = SimpleNamespace(is_active=True)
    request = factory.get(
        "/api/v1/auth/session/",
        HTTP_AUTHORIZATION="Bearer signed-token",
    )

    with (
        patch("apps.accounts.api.authentication.read_token", return_value=7),
        patch(
            "apps.accounts.api.authentication.User.objects.filter",
            return_value=_query_returning(user),
        ),
    ):
        assert BearerTokenAuthentication().authenticate(request) == (user, "signed-token")


def test_bearer_authentication_advertises_its_challenge_scheme():
    assert BearerTokenAuthentication().authenticate_header(MagicMock()) == "Bearer"
