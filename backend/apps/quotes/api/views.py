"""Thin endpoints for the Quote resource."""

from apps.common.api.views import ReadUpdateDetailAPIView, UnpaginatedListAPIView
from apps.quotes.models import Quote, QuoteItem
from .serializers import QuoteItemSerializer, QuoteSerializer, QuoteUpdateSerializer


class QuoteListView(UnpaginatedListAPIView):
    serializer_class = QuoteSerializer
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
