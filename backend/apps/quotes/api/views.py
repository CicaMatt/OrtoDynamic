"""Thin endpoints for the Quote resource."""

from rest_framework import generics
from rest_framework.response import Response

from apps.common.api.views import (
    ReadUpdateDetailAPIView,
    UnpaginatedListAPIView,
    UnpaginatedListCreateAPIView,
)
from apps.quotes.models import Quote, QuoteItem
from apps.quotes.services import change_quote_status
from apps.statuses.services import allowed_target_states
from .serializers import (
    QuoteCreateSerializer,
    QuoteItemSerializer,
    QuoteSerializer,
    QuoteStatusRequestSerializer,
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


class QuoteStatusTransitionsView(generics.RetrieveAPIView):
    """The states a quote may move to next, per the PREVENTIVI transition rules."""

    queryset = Quote.objects.all()

    def retrieve(self, request, *args, **kwargs):
        quote = self.get_object()
        return Response(
            {
                "current": quote.stato or "",
                "available": allowed_target_states(quote.STATUS_TABLE, quote.stato),
            }
        )


class QuoteStatusUpdateView(generics.GenericAPIView):
    """Apply a guarded status transition and return the updated quote."""

    queryset = Quote.objects.all()
    serializer_class = QuoteStatusRequestSerializer

    def patch(self, request, *args, **kwargs):
        quote = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        change_quote_status(quote, serializer.validated_data["status"])
        return Response(QuoteSerializer(quote).data)
