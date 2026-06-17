"""Thin endpoints for the Quote resource."""

from rest_framework import generics
from rest_framework.response import Response

from apps.clients.models import Client
from apps.common.api.views import (
    ReadUpdateDetailAPIView,
    UnpaginatedListCreateAPIView,
    attach_related,
)
from apps.doctors.models import Doctor
from apps.products.models import Product
from apps.quotes.models import Quote, QuoteItem
from apps.quotes.services import change_quote_status
from apps.statuses.services import allowed_target_states
from .serializers import (
    QuoteCreateSerializer,
    QuoteItemCreateSerializer,
    QuoteItemSerializer,
    QuoteSerializer,
    QuoteStatusRequestSerializer,
    QuoteUpdateSerializer,
)


def attach_people(quotes):
    """
    Attach each quote's referenced client and doctor as `quote.client` /
    `quote.doctor`, so `QuoteSerializer` can render their names without a per-row
    lookup. Two batched queries, one per relation.
    """
    quotes = list(quotes)
    attach_related(quotes, id_attr="id_cliente", attr="client", model=Client)
    attach_related(quotes, id_attr="id_medico", attr="doctor", model=Doctor)
    return quotes


class QuoteListView(UnpaginatedListCreateAPIView):
    serializer_class = QuoteSerializer
    create_serializer_class = QuoteCreateSerializer
    queryset = Quote.objects.order_by("-data_preventivo", "-id")

    def get_queryset(self):
        return attach_people(super().get_queryset())


class QuoteDetailView(ReadUpdateDetailAPIView):
    serializer_class = QuoteSerializer
    write_serializer_class = QuoteUpdateSerializer
    queryset = Quote.objects.all()

    def retrieve(self, request, *args, **kwargs):
        quote = self.get_object()
        attach_people([quote])
        serializer = self.get_serializer(quote)
        return Response(serializer.data)


class QuoteItemListView(UnpaginatedListCreateAPIView):
    """
    Line items belonging to one quote, keyed by `item_preventivi.id_preventivo`.

    GET lists the quote's lines; POST creates one. The parent link is taken from
    the URL, so a created line is always attached to the quote in the route.
    """

    serializer_class = QuoteItemSerializer
    create_serializer_class = QuoteItemCreateSerializer

    def get_queryset(self):
        items = list(
            QuoteItem.objects.filter(id_preventivo=self.kwargs["pk"]).order_by("id")
        )
        # Attach each line's product in one query so the serializer can render the
        # description without a per-row lookup (a missing product stays None).
        product_ids = {item.codice_nomenclatore for item in items if item.codice_nomenclatore}
        products = {product.id: product for product in Product.objects.filter(id__in=product_ids)}
        for item in items:
            item.product = products.get(item.codice_nomenclatore)
        return items

    def perform_create(self, serializer):
        serializer.save(quote_id=self.kwargs["pk"])


class QuoteItemDeleteView(generics.DestroyAPIView):
    """Delete a single line, scoped to its quote so a foreign id can't be removed."""

    lookup_url_kwarg = "item_id"

    def get_queryset(self):
        return QuoteItem.objects.filter(id_preventivo=self.kwargs["pk"])


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
        attach_people([quote])
        return Response(QuoteSerializer(quote).data)
