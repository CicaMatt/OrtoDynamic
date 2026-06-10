from django.urls import path

from .views import WorkOrderDetailView, WorkOrderListView

app_name = "work_orders"

urlpatterns = [
    path("", WorkOrderListView.as_view(), name="list"),
    path("<int:pk>/", WorkOrderDetailView.as_view(), name="detail"),
]
