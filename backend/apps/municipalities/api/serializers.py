"""Serializer for the Municipality lookup resource backed by `comuni`."""

from rest_framework import serializers

from apps.common.api.serializers import NullToEmptyMixin


class MunicipalitySerializer(NullToEmptyMixin):
    """Name plus the province/CAP used to auto-fill the client address."""

    name = serializers.CharField()
    province = serializers.CharField()
    cap = serializers.CharField()
