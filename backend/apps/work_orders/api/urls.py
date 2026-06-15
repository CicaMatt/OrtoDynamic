from django.urls import path

from .views import (
    WorkOrderDetailView,
    WorkOrderItemListView,
    WorkOrderItemUpdateView,
    WorkOrderListView,
    WorkOrderStatusUpdateView,
)

app_name = "work_orders"

urlpatterns = [
    path("", WorkOrderListView.as_view(), name="list"),
    path("<int:pk>/", WorkOrderDetailView.as_view(), name="detail"),
    path("<int:pk>/items/", WorkOrderItemListView.as_view(), name="item-list"),
    path("<int:pk>/items/<int:item_id>/", WorkOrderItemUpdateView.as_view(), name="item-detail"),
    path("<int:pk>/status/", WorkOrderStatusUpdateView.as_view(), name="status"),
]
