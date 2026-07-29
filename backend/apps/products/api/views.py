"""Thin endpoints for the Product resource."""

from apps.common.api.views import (
    ReadUpdateDetailAPIView,
    UnpaginatedListAPIView,
    UnpaginatedListCreateAPIView,
)
from apps.products.models import Product
from apps.products.selectors import quote_product_search
from .serializers import ProductCreateSerializer, ProductSerializer, ProductUpdateSerializer


class ProductListView(UnpaginatedListCreateAPIView):
    serializer_class = ProductSerializer
    create_serializer_class = ProductCreateSerializer
    queryset = Product.objects.order_by("-id")


class ProductDetailView(ReadUpdateDetailAPIView):
    serializer_class = ProductSerializer
    write_serializer_class = ProductUpdateSerializer
    queryset = Product.objects.all()


class ProductSearchView(UnpaginatedListAPIView):
    """
    Type-ahead lookup for picking a `nomenclatore` row, used by both the code and
    the description fields of a quote line.

    This endpoint is for new quote lines, so it returns exact active-year rows
    only. Existing-line historical selection uses the quote-scoped endpoint,
    which derives the one additional allowed id from the saved line server-side.
    """

    serializer_class = ProductSerializer

    def get_queryset(self):
        return quote_product_search(self.request.query_params.get("q", ""))
