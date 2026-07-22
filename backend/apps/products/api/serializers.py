"""Serializers for the Product resource backed by `nomenclatore`."""

from rest_framework import serializers

from apps.common.api.serializers import (
    NullToEmptySerializer,
    UpdateFieldsSerializer,
    nullable_text,
    optional_text,
)

from apps.products.models import Product


class ProductSerializer(NullToEmptySerializer):
    idProduct = serializers.CharField(source="id")
    code = serializers.CharField(source="codice")
    description = serializers.CharField(source="descrizione")
    price = serializers.CharField(source="prezzo")
    year = serializers.CharField(source="anno")


class ProductUpdateSerializer(UpdateFieldsSerializer):
    code = optional_text("codice")
    description = optional_text("descrizione")
    price = serializers.FloatField(source="prezzo", required=False)
    year = nullable_text("anno")


class ProductCreateSerializer(ProductUpdateSerializer):
    """Create a product; catalogue identity and price are required."""

    code = serializers.CharField(source="codice", max_length=255)
    description = serializers.CharField(source="descrizione", max_length=4000)
    price = serializers.FloatField(source="prezzo")

    def create(self, validated_data):
        return Product.objects.create(**validated_data)

    def to_representation(self, instance):
        return ProductSerializer(instance).data
