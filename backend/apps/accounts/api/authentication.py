"""
Bearer-token authentication.

The frontend is served from a different origin than the API, so authentication is
carried in an ``Authorization: Bearer <token>`` header rather than a cookie — this
sidesteps third-party-cookie blocking and removes the need for CSRF protection on
the API. The token is the stateless, signed value minted by ``apps.accounts.tokens``.

Returning a value from ``authenticate_header`` makes DRF answer an unauthenticated
request with 401 (not 403), giving the frontend a clean "session expired, show the
login screen" signal.
"""
from django.conf import settings
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, get_authorization_header

from apps.accounts.models import User
from apps.accounts.tokens import read_token

_KEYWORD = b"bearer"


class BearerTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        header = get_authorization_header(request).split()
        if not header or header[0].lower() != _KEYWORD:
            # No bearer credentials offered; let the permission layer decide.
            return None
        if len(header) != 2:
            raise exceptions.AuthenticationFailed("Invalid Authorization header.")

        user_id = read_token(header[1].decode(), max_age=settings.AUTH_TOKEN_TTL_SECONDS)
        if user_id is None:
            raise exceptions.AuthenticationFailed("Invalid or expired token.")

        # Mirror the session backend's user lookup: a deactivated account is
        # treated as logged out, exactly as `LegacyUserBackend.get_user` does.
        user = User.objects.filter(pk=user_id).first()
        if user is None or not user.is_active:
            raise exceptions.AuthenticationFailed("Invalid or expired token.")

        return (user, header[1].decode())

    def authenticate_header(self, request):
        return "Bearer"
