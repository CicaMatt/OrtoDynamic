from django.urls import path

from .views import HealthCompanyDetailView, HealthCompanyListView

app_name = "health_companies"

urlpatterns = [
    path("", HealthCompanyListView.as_view(), name="list"),
    path("<int:pk>/", HealthCompanyDetailView.as_view(), name="detail"),
]
