from django.urls import path

from .views import (
    QuoteDetailView,
    QuoteItemDetailView,
    QuoteItemListView,
    QuoteListView,
    QuoteStatusTransitionsView,
    QuoteStatusUpdateView,
)

app_name = "quotes"

urlpatterns = [
    path("", QuoteListView.as_view(), name="list"),
    path("<int:pk>/", QuoteDetailView.as_view(), name="detail"),
    path("<int:pk>/items/", QuoteItemListView.as_view(), name="item-list"),
    path("<int:pk>/items/<int:item_id>/", QuoteItemDetailView.as_view(), name="item-detail"),
    path("<int:pk>/status/", QuoteStatusUpdateView.as_view(), name="status"),
    path(
        "<int:pk>/status-transitions/",
        QuoteStatusTransitionsView.as_view(),
        name="status-transitions",
    ),
]
