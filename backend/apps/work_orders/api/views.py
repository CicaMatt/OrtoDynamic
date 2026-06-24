"""Thin endpoints for the WorkOrder resource."""

from django.http import HttpResponse
from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.clients.models import Client
from apps.common.api.views import (
    ReadUpdateDetailAPIView,
    UnpaginatedListAPIView,
    attach_related,
)
from apps.common.exceptions import NotFoundError, TemplateAssetMissing
from apps.quotes.collaudi import collaudi_filename, prepare_collaudi, render_collaudi
from apps.quotes.models import Quote, QuoteItem
from apps.work_orders.models import PeriodicCheck, WorkOrder, WorkOrderItem
from .serializers import (
    WorkOrderItemSerializer,
    WorkOrderItemUpdateSerializer,
    WorkOrderSerializer,
    WorkOrderStatusUpdateSerializer,
    WorkOrderUpdateSerializer,
)


def attach_client(work_orders):
    """
    Attach each work order's referenced client as `work_order.client`, so
    `WorkOrderSerializer` can render the client's name without a per-row lookup.
    """
    return attach_related(work_orders, id_attr="id_cliente", attr="client", model=Client)


class WorkOrderListView(UnpaginatedListAPIView):
    serializer_class = WorkOrderSerializer
    queryset = WorkOrder.objects.order_by("-id")

    def get_queryset(self):
        return attach_client(super().get_queryset())


class WorkOrderDetailView(ReadUpdateDetailAPIView):
    serializer_class = WorkOrderSerializer
    write_serializer_class = WorkOrderUpdateSerializer
    queryset = WorkOrder.objects.all()

    def retrieve(self, request, *args, **kwargs):
        work_order = self.get_object()
        attach_client([work_order])
        serializer = self.get_serializer(work_order)
        return Response(serializer.data)


class WorkOrderItemListView(UnpaginatedListAPIView):
    """
    The work order's lines (`item_lavorazioni`), each joined to its quote line
    (`item_preventivi`) for the product/amount columns.

    `lavorazioni.id` → `item_lavorazioni.id_lavorazione` gives the lines; each
    line's `id_item_preventivi` → `item_preventivi.id` supplies the joined data,
    attached as `quote_item` to avoid per-row queries.
    """

    serializer_class = WorkOrderItemSerializer

    def get_queryset(self):
        items = list(
            WorkOrderItem.objects.filter(id_lavorazione=self.kwargs["pk"]).order_by("id")
        )
        quote_ids = {item.id_item_preventivi for item in items if item.id_item_preventivi}
        quote_map = {quote.id: quote for quote in QuoteItem.objects.filter(id__in=quote_ids)}
        for item in items:
            item.quote_item = quote_map.get(item.id_item_preventivi)
        return items


class WorkOrderStatusUpdateView(generics.UpdateAPIView):
    """Set a work order's status — a free choice among the fixed states."""

    queryset = WorkOrder.objects.all()
    serializer_class = WorkOrderStatusUpdateSerializer

    def perform_update(self, serializer):
        # Attach the client to the saved instance so the response (rendered by
        # WorkOrderSerializer) carries the client's name like every other read.
        work_order = serializer.save()
        attach_client([work_order])


class WorkOrderItemUpdateView(generics.UpdateAPIView):
    """Edit a single work order line (its status / production)."""

    serializer_class = WorkOrderItemUpdateSerializer
    lookup_url_kwarg = "item_id"

    def get_queryset(self):
        # Scope to the parent work order so an id from another can't be edited.
        return WorkOrderItem.objects.filter(id_lavorazione=self.kwargs["pk"])


class WorkOrderCollaudiView(APIView):
    """
    Stream a work order's "Scheda valutazione rischi e collaudi" as an inline PDF.

    The header comes from the work order and its client/quote, the tables from its
    line items (`item_lavorazioni`) and periodic checks (`controlli_periodici`).
    See `apps.quotes.collaudi`. The body is a raw PDF, so the view returns a Django
    `HttpResponse`; a missing template asset uses the standard error envelope.
    """

    def get(self, request, pk):
        work_order = WorkOrder.objects.filter(pk=pk).first()
        if work_order is None:
            raise NotFoundError("Lavorazione inesistente.")

        client = Client.objects.filter(pk=work_order.id_cliente).first()
        quote = Quote.objects.filter(pk=work_order.id_preventivo).first()
        items = WorkOrderItem.objects.filter(id_lavorazione=work_order.id).order_by("id")
        checks = PeriodicCheck.objects.filter(id_lavorazione=work_order.id).order_by("id")

        document = prepare_collaudi(
            work_order, client, quote, list(items), list(checks), today=timezone.localdate()
        )
        try:
            pdf = render_collaudi(document)
        except FileNotFoundError as exc:
            raise TemplateAssetMissing("Modello della scheda collaudi non disponibile.") from exc

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f'inline; filename="{collaudi_filename(work_order)}"'
        return response
