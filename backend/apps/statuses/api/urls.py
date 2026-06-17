from django.urls import path

from .views import StatusListView, StatusTransitionListView

app_name = "statuses"

urlpatterns = [
    path("", StatusListView.as_view(), name="list"),
    path("transitions/", StatusTransitionListView.as_view(), name="transitions"),
]
