"""Thin endpoints for the Quote resource."""

from django.utils.dateparse import parse_date
from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.api.views import (
    ReadUpdateDetailAPIView,
    UnpaginatedListCreateAPIView,
    inline_pdf_response,
)
from apps.common.exceptions import ServiceError
from apps.quotes.documents import (
    ddt_filename,
    delivery_form_filename,
    prepare_ddt,
    prepare_delivery_form_fields,
    prepare_scheda,
    render_ddt,
    render_delivery_form,
    render_scheda,
    scheda_filename,
)
from apps.quotes.models import Quote, QuoteItem
from apps.quotes.selectors import (
    ddt_document_inputs,
    delivery_form_inputs,
    quote_items_with_products,
    quotes_with_people,
    quotes_with_read_relations,
    scheda_document_inputs,
)
from apps.quotes.services import (
    change_quote_status,
    delete_quote_graph,
    delete_quote_item,
    quote_status_transition_options,
)
from .serializers import (
    QuoteCreateSerializer,
    QuoteItemCreateSerializer,
    QuoteItemSerializer,
    QuoteItemUpdateSerializer,
    QuoteSerializer,
    QuoteStatusRequestSerializer,
    QuoteUpdateSerializer,
)


class QuoteListView(UnpaginatedListCreateAPIView):
    serializer_class = QuoteSerializer
    create_serializer_class = QuoteCreateSerializer
    queryset = Quote.objects.order_by("-id")

    def get_queryset(self):
        return quotes_with_read_relations(super().get_queryset())


class QuoteDetailView(ReadUpdateDetailAPIView):
    serializer_class = QuoteSerializer
    write_serializer_class = QuoteUpdateSerializer
    queryset = Quote.objects.all()

    def retrieve(self, request, *args, **kwargs):
        quote = self.get_object()
        quotes_with_read_relations([quote])
        serializer = self.get_serializer(quote)
        return Response(serializer.data)

    def perform_destroy(self, instance):
        delete_quote_graph(instance.id)


class QuoteItemListView(UnpaginatedListCreateAPIView):
    """
    Line items belonging to one quote, keyed by `item_preventivi.id_preventivo`.

    GET lists the quote's lines; POST creates one. The parent link is taken from
    the URL, so a created line is always attached to the quote in the route.
    """

    serializer_class = QuoteItemSerializer
    create_serializer_class = QuoteItemCreateSerializer

    def get_queryset(self):
        return quote_items_with_products(self.kwargs["pk"])

    def perform_create(self, serializer):
        serializer.save(quote_id=self.kwargs["pk"])


class QuoteItemDetailView(generics.UpdateAPIView, generics.DestroyAPIView):
    """
    Edit or delete a single line, scoped to its quote so a foreign id can't be
    touched. PATCH updates the line's quantity/discount (recomputing its amount);
    DELETE removes its `item_preventivi` row.
    """

    serializer_class = QuoteItemUpdateSerializer
    lookup_url_kwarg = "item_id"

    def get_queryset(self):
        return QuoteItem.objects.filter(id_preventivo=self.kwargs["pk"])

    def perform_destroy(self, instance):
        # Remove the line and re-derive the quote's total from those that remain.
        delete_quote_item(instance)


class QuoteStatusTransitionsView(generics.RetrieveAPIView):
    """The states a quote may move to next, per the PREVENTIVI transition rules."""

    queryset = Quote.objects.all()

    def retrieve(self, request, *args, **kwargs):
        quote = self.get_object()
        options = quote_status_transition_options(quote)
        return Response(
            {
                "current": quote.stato or "",
                # Retained for API compatibility while clients migrate to metadata.
                "available": [option["status"] for option in options],
                "options": options,
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
        change_quote_status(
            quote,
            serializer.validated_data["status"],
            note=serializer.validated_data.get("note"),
        )
        quotes_with_people([quote])
        data = QuoteSerializer(quote).data
        # When the transition spawned (or matched an existing) work order, surface its
        # id so the caller can jump straight to the new Lavorazione.
        if getattr(quote, "work_order", None) is not None:
            data["workOrderId"] = str(quote.work_order.id)
        return Response(data)


class QuoteDeliveryFormView(APIView):
    """
    Stream a quote's "Modulo di consegna" as an inline PDF.

    The five stamped values come from the quote and its client (see
    `apps.quotes.documents.delivery_form`). The body is a raw PDF rather than the JSON
    envelope, so the view returns a Django `HttpResponse` directly; a missing
    template asset is reported through the standard error envelope.
    """

    def get(self, request, pk):
        quote, client = delivery_form_inputs(pk)
        today = timezone.localdate()
        delivery_date = _delivery_form_date(request.query_params.get("delivery_date"), today)
        fields = prepare_delivery_form_fields(quote, client, today=delivery_date)
        pdf = render_delivery_form(fields)

        filename = delivery_form_filename(quote, today)
        return inline_pdf_response(pdf, filename)


def _delivery_form_date(raw: str | None, fallback):
    if not raw:
        return fallback
    parsed = parse_date(raw)
    if parsed is None:
        raise ServiceError("Data modulo di consegna non valida.")
    return parsed


class QuoteDdtView(APIView):
    """
    Stream a quote's DDT (delivery note) as an inline PDF.

    The recipient comes from the quote's client (the original query inner-joins
    `clienti`, so a quote with no client resolves to "not found"), and the table
    from its line items. See `apps.quotes.documents.ddt`.
    """

    def get(self, request, pk):
        quote, client, items = ddt_document_inputs(pk)
        today = timezone.localdate()
        show_prices = request.query_params.get("include_prices") == "true"
        document = prepare_ddt(
            quote,
            client,
            items,
            today=today,
            show_prices=show_prices,
        )
        pdf = render_ddt(document)

        return inline_pdf_response(pdf, ddt_filename(quote))


class QuoteSchedaView(APIView):
    """
    Stream a quote's "Scheda Progetto" as an inline PDF.

    Header data comes from the quote and its client (the original query inner-joins
    `clienti`, so a quote with no client resolves to "not found"); the items table
    from its line items. The page is drawn entirely in code. See `apps.quotes.documents.scheda`.
    """

    def get(self, request, pk):
        quote, client, items = scheda_document_inputs(pk)
        document = prepare_scheda(quote, client, items)
        pdf = render_scheda(document)

        return inline_pdf_response(pdf, scheda_filename(quote))
