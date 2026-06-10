"""Thin endpoints for the Quote resource."""

from apps.common.api.views import ReadUpdateDetailAPIView, UnpaginatedListAPIView
from apps.quotes.models import Quote
from .serializers import QuoteSerializer, QuoteUpdateSerializer


class QuoteListView(UnpaginatedListAPIView):
    serializer_class = QuoteSerializer
    queryset = Quote.objects.order_by("-data_preventivo", "-id")


class QuoteDetailView(ReadUpdateDetailAPIView):
    serializer_class = QuoteSerializer
    write_serializer_class = QuoteUpdateSerializer
    queryset = Quote.objects.all()
