"""Serializers for the Product resource backed by `nomenclatore`."""

from rest_framework import serializers

from apps.common.api.serializers import (
    CreatableSerializerMixin,
    NullToEmptyMixin,
    UpdateFieldsSerializer,
    nullable_text,
    optional_text_fields,
    read_fields,
)

from apps.products.models import Product


class ProductSerializer(NullToEmptyMixin):
    locals().update(read_fields({
        "idProduct": "id",
        "code": "codice",
        "description": "descrizione",
        "price": "prezzo",
        "year": "anno",
    }))


class ProductUpdateSerializer(UpdateFieldsSerializer):
    locals().update(optional_text_fields({
        "code": "codice",
        "description": "descrizione",
    }))
    price = serializers.FloatField(source="prezzo", required=False)
    year = nullable_text("anno")


class ProductCreateSerializer(CreatableSerializerMixin, ProductUpdateSerializer):
    """Create a product, reusing the update serializer's writable fields."""

    create_model = Product
    read_serializer_class = ProductSerializer
