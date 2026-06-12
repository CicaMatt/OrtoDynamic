"""Thin endpoints for the Quote resource."""

from apps.common.api.views import (
    ReadUpdateDetailAPIView,
    UnpaginatedListAPIView,
    UnpaginatedListCreateAPIView,
)
from apps.quotes.models import Quote, QuoteItem
from .serializers import (
    QuoteCreateSerializer,
    QuoteItemSerializer,
    QuoteSerializer,
    QuoteUpdateSerializer,
)


class QuoteListView(UnpaginatedListCreateAPIView):
    serializer_class = QuoteSerializer
    create_serializer_class = QuoteCreateSerializer
    queryset = Quote.objects.order_by("-data_preventivo", "-id")


class QuoteDetailView(ReadUpdateDetailAPIView):
    serializer_class = QuoteSerializer
    write_serializer_class = QuoteUpdateSerializer
    queryset = Quote.objects.all()


class QuoteItemListView(UnpaginatedListAPIView):
    """Line items belonging to one quote, keyed by `item_preventivi.id_preventivo`."""

    serializer_class = QuoteItemSerializer

    def get_queryset(self):
        return QuoteItem.objects.filter(id_preventivo=self.kwargs["pk"]).order_by("id")
