"""Serializers for the authentication endpoints."""

from rest_framework import serializers

from apps.common.api.serializers import NullToEmptyMixin


class LoginSerializer(serializers.Serializer):
    """Validates the credentials submitted to the login endpoint."""

    username = serializers.CharField(max_length=100, trim_whitespace=True)
    # Passwords are checked verbatim, so surrounding whitespace must be preserved.
    password = serializers.CharField(max_length=128, trim_whitespace=False)


class UserSerializer(NullToEmptyMixin):
    """The authenticated user's public profile, as the frontend consumes it."""

    id = serializers.CharField()
    username = serializers.CharField()
    email = serializers.CharField()
    firstName = serializers.CharField(source="first_name")
    lastName = serializers.CharField(source="last_name")
