from django.urls import path

from .views import (
    ClientDetailView,
    ClientListView,
    ClientOrthopedicView,
    ClientPrivacyFormView,
)

app_name = "clients"

urlpatterns = [
    path("", ClientListView.as_view(), name="list"),
    path("<int:pk>/", ClientDetailView.as_view(), name="detail"),
    path("<int:pk>/orthopedic/", ClientOrthopedicView.as_view(), name="orthopedic"),
    path("<int:pk>/privacy-form/", ClientPrivacyFormView.as_view(), name="privacy-form"),
]
