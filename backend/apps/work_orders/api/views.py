"""Thin endpoints for the WorkOrder resource."""

from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.api.views import (
    ReadUpdateDetailAPIView,
    UnpaginatedListAPIView,
    inline_pdf_response,
)
from apps.common.exceptions import TemplateAssetMissing
from apps.quotes.services import delete_quote_graph
from apps.work_orders.documents import (
    collaudi_filename,
    prepare_collaudi,
    render_collaudi,
)
from apps.work_orders.models import WorkOrder, WorkOrderItem
from apps.work_orders.selectors import (
    collaudi_document_inputs,
    work_order_items_with_quote_items_and_products,
    work_orders_with_read_relations,
)
from .serializers import (
    WorkOrderItemSerializer,
    WorkOrderItemUpdateSerializer,
    WorkOrderSerializer,
    WorkOrderStatusUpdateSerializer,
    WorkOrderUpdateSerializer,
)


class WorkOrderListView(UnpaginatedListAPIView):
    serializer_class = WorkOrderSerializer
    queryset = WorkOrder.objects.order_by("-id")

    def get_queryset(self):
        return work_orders_with_read_relations(super().get_queryset())


class WorkOrderDetailView(ReadUpdateDetailAPIView):
    serializer_class = WorkOrderSerializer
    write_serializer_class = WorkOrderUpdateSerializer
    queryset = WorkOrder.objects.all()

    def retrieve(self, request, *args, **kwargs):
        work_order = self.get_object()
        work_orders_with_read_relations([work_order])
        serializer = self.get_serializer(work_order)
        return Response(serializer.data)

    def perform_destroy(self, instance):
        delete_quote_graph(instance.id_preventivo)


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
        return work_order_items_with_quote_items_and_products(self.kwargs["pk"])


class WorkOrderStatusUpdateView(generics.UpdateAPIView):
    """Set a work order's status — a free choice among the fixed states."""

    queryset = WorkOrder.objects.all()
    serializer_class = WorkOrderStatusUpdateSerializer

    def perform_update(self, serializer):
        # Attach the client to the saved instance so the response (rendered by
        # WorkOrderSerializer) carries related display fields like every other read.
        work_order = serializer.save()
        work_orders_with_read_relations([work_order])


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
    See `apps.work_orders.documents.collaudi`. The body is a raw PDF, so the view
    returns a Django `HttpResponse`; a missing template asset uses the standard
    error envelope.
    """

    def get(self, request, pk):
        work_order, client, quote, items, checks = collaudi_document_inputs(pk)

        document = prepare_collaudi(
            work_order, client, quote, items, checks, today=timezone.localdate()
        )
        try:
            pdf = render_collaudi(document)
        except FileNotFoundError as exc:
            raise TemplateAssetMissing("Modello della scheda collaudi non disponibile.") from exc

        return inline_pdf_response(pdf, collaudi_filename(work_order))
