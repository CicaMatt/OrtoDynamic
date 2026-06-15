"""
Authentication endpoints: login, logout, and current-session lookup.

Authentication is session based: a successful login establishes a Django session
(stored in a signed cookie) and rotates the CSRF token. The session cookie is
HttpOnly; the CSRF token is exposed to JavaScript so the frontend can echo it back
on unsafe requests.
"""
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.exceptions import ServiceError

from .serializers import LoginSerializer, UserSerializer


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
        login(request, user)
        return Response(UserSerializer(user).data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(ensure_csrf_cookie, name="dispatch")
class SessionView(APIView):
    """Report the current user (or null) and seed the CSRF cookie.

    Called on app start-up: it restores an existing session and gives the
    frontend the CSRF token it needs for subsequent unsafe requests.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        return Response({"user": UserSerializer(user).data if user else None})
