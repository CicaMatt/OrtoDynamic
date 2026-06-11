"""Thin endpoints for the Product resource."""

from apps.common.api.views import ReadUpdateDetailAPIView, UnpaginatedListCreateAPIView
from apps.products.models import Product
from .serializers import ProductCreateSerializer, ProductSerializer, ProductUpdateSerializer


class ProductListView(UnpaginatedListCreateAPIView):
    serializer_class = ProductSerializer
    create_serializer_class = ProductCreateSerializer
    queryset = Product.objects.order_by("codice", "id")


class ProductDetailView(ReadUpdateDetailAPIView):
    serializer_class = ProductSerializer
    write_serializer_class = ProductUpdateSerializer
    queryset = Product.objects.all()
