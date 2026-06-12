"""Thin endpoints for the WorkOrder resource."""

from apps.common.api.views import ReadUpdateDetailAPIView, UnpaginatedListAPIView
from apps.quotes.api.serializers import QuoteItemSerializer
from apps.quotes.models import QuoteItem
from apps.work_orders.models import WorkOrder, WorkOrderItem
from .serializers import WorkOrderSerializer, WorkOrderUpdateSerializer


class WorkOrderListView(UnpaginatedListAPIView):
    serializer_class = WorkOrderSerializer
    queryset = WorkOrder.objects.order_by("-data_creazione_lavorazione", "-id")


class WorkOrderDetailView(ReadUpdateDetailAPIView):
    serializer_class = WorkOrderSerializer
    write_serializer_class = WorkOrderUpdateSerializer
    queryset = WorkOrder.objects.all()


class WorkOrderItemListView(UnpaginatedListAPIView):
    """
    Quote line items linked to a work order through `item_lavorazioni`.

    Resolves the two-hop relationship: `lavorazioni.id` →
    `item_lavorazioni.id_lavorazione`, then each bridge row's
    `id_item_preventivi` → `item_preventivi.id`. The resolved `item_preventivi`
    rows are rendered with the shared `QuoteItemSerializer`, so the work order's
    items box matches the quote's.
    """

    serializer_class = QuoteItemSerializer

    def get_queryset(self):
        item_ids = WorkOrderItem.objects.filter(
            id_lavorazione=self.kwargs["pk"], id_item_preventivi__isnull=False
        ).values_list("id_item_preventivi", flat=True)
        return QuoteItem.objects.filter(id__in=item_ids).order_by("id")
