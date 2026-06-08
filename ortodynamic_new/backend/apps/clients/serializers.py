"""
Read serializers for the Client resource.

Field names deliberately match the frontend's `Client` shape (camelCase) so the
React layer consumes the API directly with no transform step. Because the
underlying columns are nullable, `NullToEmptyMixin` renders SQL NULLs as empty
strings — the frontend treats every field as a plain string.
"""
from rest_framework import serializers

from .models import Client


class NullToEmptyMixin(serializers.Serializer):
    """Render NULL fields as empty strings and trim stray whitespace.

    The legacy data carries leading/trailing spaces on many text columns;
    cleaning them at the API boundary keeps every consumer from re-implementing
    the same trimming.
    """

    @staticmethod
    def _clean(value):
        if value is None:
            return ""
        if isinstance(value, str):
            return value.strip()
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {key: self._clean(value) for key, value in data.items()}


class ClientListSerializer(NullToEmptyMixin):
    """Columns shown in the Clienti table."""

    code = serializers.CharField(source="id")
    name = serializers.CharField(source="nome")
    surname = serializers.CharField(source="cognome")
    fiscalCode = serializers.CharField(source="codice_fiscale")
    birthDate = serializers.DateField(source="data_nascita")
    birthPlace = serializers.CharField(source="comune_nascita")
    address = serializers.CharField(source="indirizzo")
    city = serializers.CharField(source="citta")
    province = serializers.CharField(source="provincia")
    phone = serializers.CharField(source="telefono")


class ClientDetailSerializer(NullToEmptyMixin):
    """Full set of fields shown in the client detail view."""

    code = serializers.CharField(source="id")
    name = serializers.CharField(source="nome")
    surname = serializers.CharField(source="cognome")
    fiscalCode = serializers.CharField(source="codice_fiscale")
    phone = serializers.CharField(source="telefono")
    email = serializers.CharField()
    birthDate = serializers.DateField(source="data_nascita")
    gender = serializers.CharField(source="sesso")
    birthPlace = serializers.CharField(source="comune_nascita")
    address = serializers.CharField(source="indirizzo")
    city = serializers.CharField(source="citta")
    province = serializers.CharField(source="provincia")
    postalCode = serializers.CharField(source="cap")
    country = serializers.CharField(source="nazione")
    district = serializers.CharField(source="distretto_appartenenza")
