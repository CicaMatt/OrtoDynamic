"""Public contracts for login, logout, and session restoration endpoints."""

from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate

from apps.accounts.api.views import LoginView, LogoutView, SessionView
from apps.accounts.models import User


factory = APIRequestFactory()


def _user():
    return User(
        id=7,
        username="matteo",
        email="matteo@example.test",
        first_name="Matteo",
        last_name="Cicalese",
        is_active=True,
    )


def test_login_rejects_invalid_credentials_with_the_shared_error_envelope():
    request = factory.post(
        "/api/v1/auth/login/",
        {"username": "matteo", "password": "wrong"},
        format="json",
    )

    with patch("apps.accounts.api.views.authenticate", return_value=None):
        response = LoginView.as_view()(request)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data == {"error": {"message": "Nome utente o password non validi."}}


def test_login_returns_a_token_and_public_user_profile():
    user = _user()
    request = factory.post(
        "/api/v1/auth/login/",
        {"username": "  matteo  ", "password": " secret with spaces "},
        format="json",
    )

    with (
        patch("apps.accounts.api.views.authenticate", return_value=user) as authenticate,
        patch("apps.accounts.api.views.update_last_login") as update_last_login,
        patch("apps.accounts.api.views.issue_token", return_value="signed-token"),
    ):
        response = LoginView.as_view()(request)

    assert response.status_code == status.HTTP_200_OK
    assert response.data == {
        "token": "signed-token",
        "user": {
            "id": "7",
            "username": "matteo",
            "email": "matteo@example.test",
            "firstName": "Matteo",
            "lastName": "Cicalese",
        },
    }
    authenticate.assert_called_once()
    authenticated_request = authenticate.call_args.args[0]
    assert authenticated_request._request is request
    assert authenticate.call_args.kwargs == {
        "username": "matteo",
        "password": " secret with spaces ",
    }
    update_last_login.assert_called_once_with(None, user)


def test_session_returns_null_for_an_anonymous_request():
    response = SessionView.as_view()(factory.get("/api/v1/auth/session/"))

    assert response.status_code == status.HTTP_200_OK
    assert response.data == {"user": None}


def test_session_returns_the_authenticated_user_profile():
    user = _user()
    request = factory.get("/api/v1/auth/session/")
    force_authenticate(request, user=user)

    response = SessionView.as_view()(request)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["user"] == {
        "id": "7",
        "username": "matteo",
        "email": "matteo@example.test",
        "firstName": "Matteo",
        "lastName": "Cicalese",
    }


def test_logout_returns_no_content_for_an_authenticated_request():
    request = factory.post("/api/v1/auth/logout/", format="json")
    force_authenticate(request, user=_user())

    response = LogoutView.as_view()(request)

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert response.data is None
