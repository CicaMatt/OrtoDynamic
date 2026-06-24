"""Serializers for the Product resource backed by `nomenclatore`."""

from rest_framework import serializers

from apps.common.api.serializers import (
    CreatableSerializerMixin,
    NullToEmptyMixin,
    UpdateFieldsSerializer,
    nullable_text,
    optional_text,
)

from apps.products.models import Product


class ProductSerializer(NullToEmptyMixin):
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


class ProductCreateSerializer(CreatableSerializerMixin, ProductUpdateSerializer):
    """Create a product, reusing the update serializer's writable fields."""

    create_model = Product
    read_serializer_class = ProductSerializer
