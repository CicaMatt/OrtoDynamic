"""Thin endpoints for the Quote resource."""

from types import SimpleNamespace

from django.http import HttpResponse
from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.clients.models import Client
from apps.common.api.views import (
    ReadUpdateDetailAPIView,
    UnpaginatedListCreateAPIView,
    attach_related,
)
from apps.common.exceptions import NotFoundError, TemplateAssetMissing
from apps.doctors.models import Doctor
from apps.products.models import Product
from apps.quotes.ddt import ddt_filename, prepare_ddt, render_ddt
from apps.quotes.delivery_form import (
    delivery_form_filename,
    prepare_delivery_form_fields,
    render_delivery_form,
)
from apps.quotes.models import Quote, QuoteItem
from apps.quotes.scheda import prepare_scheda, render_scheda, scheda_filename
from apps.quotes.services import change_quote_status
from apps.statuses.services import allowed_target_states
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
    `apps.quotes.delivery_form`). The body is a raw PDF rather than the JSON
    envelope, so the view returns a Django `HttpResponse` directly; a missing
    template asset is reported through the standard error envelope.
    """

    def get(self, request, pk):
        quote = Quote.objects.filter(pk=pk).first()
        if quote is None:
            raise NotFoundError("Preventivo inesistente.")

        client = Client.objects.filter(pk=quote.id_cliente).first()
        today = timezone.localdate()
        fields = prepare_delivery_form_fields(quote, client, today=today)

        try:
            pdf = render_delivery_form(fields)
        except FileNotFoundError as exc:
            raise TemplateAssetMissing("Modello del modulo di consegna non disponibile.") from exc

        response = HttpResponse(pdf, content_type="application/pdf")
        filename = delivery_form_filename(quote, today)
        response["Content-Disposition"] = f'inline; filename="{filename}"'
        return response


def _ddt_item_rows(quote_id):
    """
    The quote's line items merged with their catalogue product, as plain rows
    carrying the fields the DDT prints (`codice`, `descrizione`, `quantita`, plus
    optional price columns). Products are loaded in one query; a line whose
    product is gone keeps null code/description (the LEFT JOIN in the original).
    """
    items = list(QuoteItem.objects.filter(id_preventivo=quote_id).order_by("id"))
    product_ids = {item.codice_nomenclatore for item in items if item.codice_nomenclatore}
    products = {product.id: product for product in Product.objects.filter(id__in=product_ids)}

    rows = []
    for item in items:
        product = products.get(item.codice_nomenclatore)
        rows.append(
            SimpleNamespace(
                codice=product.codice if product else None,
                descrizione=product.descrizione if product else None,
                quantita=item.quantita,
                prezzo=item.prezzo,
                importo=item.importo,
            )
        )
    return rows


class QuoteDdtView(APIView):
    """
    Stream a quote's DDT (delivery note) as an inline PDF.

    The recipient comes from the quote's client (the original query inner-joins
    `clienti`, so a quote with no client resolves to "not found"), and the table
    from its line items. See `apps.quotes.ddt`.
    """

    def get(self, request, pk):
        quote = Quote.objects.filter(pk=pk).first()
        client = Client.objects.filter(pk=quote.id_cliente).first() if quote else None
        if quote is None or client is None:
            raise NotFoundError("Preventivo non trovato.")

        today = timezone.localdate()
        show_prices = request.query_params.get("include_prices") == "true"
        document = prepare_ddt(
            quote,
            client,
            _ddt_item_rows(quote.id),
            today=today,
            show_prices=show_prices,
        )
        pdf = render_ddt(document)

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f'inline; filename="{ddt_filename(quote)}"'
        return response


def _scheda_item_rows(quote_id):
    """
    The quote's line items joined to their catalogue product, as plain rows for the
    Scheda Progetto table (`codice`/`descrizione` from the product, the money
    columns from the line). The original query inner-joins `nomenclatore`, so a
    line whose product is missing is dropped.
    """
    items = QuoteItem.objects.filter(id_preventivo=quote_id).order_by("id")
    product_ids = {item.codice_nomenclatore for item in items if item.codice_nomenclatore}
    products = {product.id: product for product in Product.objects.filter(id__in=product_ids)}

    rows = []
    for item in items:
        product = products.get(item.codice_nomenclatore)
        if product is None:
            continue
        rows.append(
            SimpleNamespace(
                codice=product.codice,
                descrizione=product.descrizione,
                prezzo=item.prezzo,
                quantita=item.quantita,
                importo=item.importo,
                sconto=item.sconto,
            )
        )
    return rows


class QuoteSchedaView(APIView):
    """
    Stream a quote's "Scheda Progetto" as an inline PDF.

    Header data comes from the quote and its client (the original query inner-joins
    `clienti`, so a quote with no client resolves to "not found"); the items table
    from its line items. The required background template is reported through the
    standard error envelope when absent. See `apps.quotes.scheda`.
    """

    def get(self, request, pk):
        quote = Quote.objects.filter(pk=pk).first()
        client = Client.objects.filter(pk=quote.id_cliente).first() if quote else None
        if quote is None or client is None:
            raise NotFoundError("Preventivo non trovato.")

        document = prepare_scheda(quote, client, _scheda_item_rows(quote.id))
        try:
            pdf = render_scheda(document)
        except FileNotFoundError as exc:
            raise TemplateAssetMissing("Modello della scheda progetto non disponibile.") from exc

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f'inline; filename="{scheda_filename(quote)}"'
        return response
