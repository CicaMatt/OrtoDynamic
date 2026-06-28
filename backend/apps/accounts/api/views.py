"""
Authentication endpoints: login, logout, and current-user lookup.

Authentication is token based: a successful login returns a stateless, signed
token (see `apps.accounts.tokens`) that the frontend stores and sends back in the
`Authorization: Bearer` header. There is no server-side session and no cookie, so
logout is a client-side discard and the API needs no CSRF protection.
"""
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.accounts.tokens import issue_token
from apps.common.api.views import UnpaginatedListAPIView
from apps.common.exceptions import ServiceError

from .serializers import EmployeeSerializer, LoginSerializer, UserSerializer


class InvalidCredentialsError(ServiceError):
    """Wrong username/password. A 400 (not 401) keeps it distinct from the
    'session expired' 401 the frontend reacts to globally."""

    default_message = "Nome utente o password non validi."


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            request,
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )
        if user is None:
            raise InvalidCredentialsError()
        update_last_login(None, user)
        return Response({"token": issue_token(user), "user": UserSerializer(user).data})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Tokens are stateless, so there is nothing to revoke server-side; the
        # frontend discards its copy. The endpoint stays authenticated-only for a
        # consistent client contract and so it can grow real revocation later.
        return Response(status=status.HTTP_204_NO_CONTENT)


class SessionView(APIView):
    """Report the current user (or null) on app start-up.

    The frontend calls this with its stored token to restore the signed-in user;
    an absent token yields `null`, an invalid or expired one yields 401.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        return Response({"user": UserSerializer(user).data if user else None})


class EmployeeListView(UnpaginatedListAPIView):
    """Read-only list of employee accounts from `tb_users`, newest first.

    Uses `EmployeeSerializer`, which exposes the account id as `idEmployee` (the
    auth profile keeps its own `id` via `UserSerializer`).
    """

    serializer_class = EmployeeSerializer
    queryset = User.objects.all().order_by("-id")
