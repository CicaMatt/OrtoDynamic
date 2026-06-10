from django.urls import path

from .views import QuoteDetailView, QuoteListView

app_name = "quotes"

urlpatterns = [
    path("", QuoteListView.as_view(), name="list"),
    path("<int:pk>/", QuoteDetailView.as_view(), name="detail"),
]
