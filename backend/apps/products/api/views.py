"""Thin endpoints for the Product resource."""

from apps.common.api.views import ReadUpdateDetailAPIView, UnpaginatedListAPIView
from apps.products.models import Product
from .serializers import ProductSerializer, ProductUpdateSerializer


class ProductListView(UnpaginatedListAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.order_by("codice", "id")


class ProductDetailView(ReadUpdateDetailAPIView):
    serializer_class = ProductSerializer
    write_serializer_class = ProductUpdateSerializer
    queryset = Product.objects.all()
