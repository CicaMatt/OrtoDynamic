"""Thin endpoints for the WorkOrder resource."""

from rest_framework import generics

from apps.common.api.views import ReadUpdateDetailAPIView, UnpaginatedListAPIView
from apps.quotes.models import QuoteItem
from apps.work_orders.models import WorkOrder, WorkOrderItem
from .serializers import (
    WorkOrderItemSerializer,
    WorkOrderItemUpdateSerializer,
    WorkOrderSerializer,
    WorkOrderStatusUpdateSerializer,
    WorkOrderUpdateSerializer,
)


class WorkOrderListView(UnpaginatedListAPIView):
    serializer_class = WorkOrderSerializer
    queryset = WorkOrder.objects.order_by("-data_creazione_lavorazione", "-id")


class WorkOrderDetailView(ReadUpdateDetailAPIView):
    serializer_class = WorkOrderSerializer
    write_serializer_class = WorkOrderUpdateSerializer
    queryset = WorkOrder.objects.all()


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


class WorkOrderItemUpdateView(generics.UpdateAPIView):
    """Edit a single work order line (its status / production)."""

    serializer_class = WorkOrderItemUpdateSerializer
    lookup_url_kwarg = "item_id"

    def get_queryset(self):
        # Scope to the parent work order so an id from another can't be edited.
        return WorkOrderItem.objects.filter(id_lavorazione=self.kwargs["pk"])
