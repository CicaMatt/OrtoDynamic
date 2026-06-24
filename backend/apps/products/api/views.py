"""Thin endpoints for the Product resource."""

from django.db.models import CharField, Q
from django.db.models.functions import Cast

from apps.common.api.views import (
    ReadUpdateDetailAPIView,
    UnpaginatedListAPIView,
    UnpaginatedListCreateAPIView,
)
from apps.products.models import Product
from .serializers import ProductCreateSerializer, ProductSerializer, ProductUpdateSerializer

# Cap the type-ahead result set: enough to scan, small enough to stay snappy.
PRODUCT_SEARCH_LIMIT = 25


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

    `item_preventivi.codice_nomenclatore` stores a `nomenclatore.id`, so the id
    (cast to text) is matched by prefix — what the user types as a number — while
    `codice` and `descrizione` are matched as substrings so the same endpoint
    serves a search by product name. An empty `q` returns nothing; results are
    capped at `PRODUCT_SEARCH_LIMIT`.
    """

    serializer_class = ProductSerializer

    def get_queryset(self):
        query = self.request.query_params.get("q", "").strip()
        if not query:
            return Product.objects.none()
        return (
            Product.objects.annotate(id_text=Cast("id", output_field=CharField()))
            .filter(
                Q(id_text__startswith=query)
                | Q(codice__icontains=query)
                | Q(descrizione__icontains=query)
            )
            .order_by("id")[:PRODUCT_SEARCH_LIMIT]
        )
