"""Serializers for the Product resource backed by `nomenclatore`."""

from rest_framework import serializers

from apps.common.api.serializers import (
    NullToEmptyMixin,
    UpdateFieldsSerializer,
    nullable_text,
    optional_text,
)


class ProductSerializer(NullToEmptyMixin):
    id = serializers.CharField()
    code = serializers.CharField(source="codice")
    description = serializers.CharField(source="descrizione")
    price = serializers.CharField(source="prezzo")
    year = serializers.CharField(source="anno")


class ProductUpdateSerializer(UpdateFieldsSerializer):
    code = optional_text("codice")
    description = optional_text("descrizione")
    price = serializers.FloatField(source="prezzo", required=False)
    year = nullable_text("anno")
