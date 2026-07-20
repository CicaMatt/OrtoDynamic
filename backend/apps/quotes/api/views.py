"""Thin endpoints for the Quote resource."""

from django.utils.dateparse import parse_date
from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.clients.models import Client
from apps.common.api.views import (
    ReadUpdateDetailAPIView,
    UnpaginatedListCreateAPIView,
    attach_many,
    inline_pdf_response,
)
from apps.common.exceptions import ServiceError, NotFoundError
from apps.doctors.models import Doctor
from apps.products.models import Product
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
from apps.quotes.selectors import ddt_item_rows, scheda_item_rows
from apps.quotes.services import change_quote_status, delete_quote_item, delete_quote_with_related
from apps.statuses.services import allowed_target_states
from apps.work_orders.models import WorkOrder
from .serializers import (
    QuoteCreateSerializer,
    QuoteItemCreateSerializer,
    QuoteItemSerializer,
    QuoteItemUpdateSerializer,
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
    return attach_many(
        quotes,
        {"id_attr": "id_cliente", "attr": "client", "model": Client},
        {"id_attr": "id_medico", "attr": "doctor", "model": Doctor},
    )


def attach_work_orders(quotes):
    """
    Attach the work order created from each quote as `quote.work_order`, if any.
    The relationship is stored as a plain integer column on `lavorazioni`, so it
    is resolved explicitly instead of through a Django FK.
    """
    quotes = list(quotes)
    quote_ids = [quote.id for quote in quotes]
    work_orders = WorkOrder.objects.filter(id_preventivo__in=quote_ids).order_by("id")
    by_quote = {}
    for work_order in work_orders:
        by_quote.setdefault(work_order.id_preventivo, work_order)
    for quote in quotes:
        quote.work_order = by_quote.get(quote.id)
    return quotes


def get_quote_or_404(pk):
    quote = Quote.objects.filter(pk=pk).first()
    if quote is None:
        raise NotFoundError("Preventivo inesistente.")
    return quote


def get_quote_and_client_or_404(pk):
    quote = Quote.objects.filter(pk=pk).first()
    client = Client.objects.filter(pk=quote.id_cliente).first() if quote else None
    if quote is None or client is None:
        raise NotFoundError("Preventivo non trovato.")
    return quote, client


class QuoteListView(UnpaginatedListCreateAPIView):
    serializer_class = QuoteSerializer
    create_serializer_class = QuoteCreateSerializer
    queryset = Quote.objects.order_by("-id")

    def get_queryset(self):
        return attach_work_orders(attach_people(super().get_queryset()))


class QuoteDetailView(ReadUpdateDetailAPIView):
    serializer_class = QuoteSerializer
    write_serializer_class = QuoteUpdateSerializer
    queryset = Quote.objects.all()

    def retrieve(self, request, *args, **kwargs):
        quote = self.get_object()
        attach_people([quote])
        attach_work_orders([quote])
        serializer = self.get_serializer(quote)
        return Response(serializer.data)

    def perform_destroy(self, instance):
        delete_quote_with_related(instance)


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
        change_quote_status(
            quote,
            serializer.validated_data["status"],
            note=serializer.validated_data.get("note"),
        )
        attach_people([quote])
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
        quote = get_quote_or_404(pk)
        client = Client.objects.filter(pk=quote.id_cliente).first()
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
        quote, client = get_quote_and_client_or_404(pk)
        today = timezone.localdate()
        show_prices = request.query_params.get("include_prices") == "true"
        document = prepare_ddt(
            quote,
            client,
            ddt_item_rows(quote.id),
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
        quote, client = get_quote_and_client_or_404(pk)
        document = prepare_scheda(quote, client, scheda_item_rows(quote.id))
        pdf = render_scheda(document)

        return inline_pdf_response(pdf, scheda_filename(quote))
