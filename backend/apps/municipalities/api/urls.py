from django.urls import path

from .views import MunicipalityListView

app_name = "municipalities"

urlpatterns = [
    path("", MunicipalityListView.as_view(), name="list"),
]
