"""Thin endpoints for the HealthCompany resource."""

from apps.common.api.views import ReadUpdateDetailAPIView, UnpaginatedListAPIView
from apps.health_companies.models import HealthCompany
from .serializers import (
    HealthCompanyDetailSerializer,
    HealthCompanyListSerializer,
    HealthCompanyUpdateSerializer,
)


class HealthCompanyListView(UnpaginatedListAPIView):
    serializer_class = HealthCompanyListSerializer
    queryset = HealthCompany.objects.order_by(
        "denominazione_regione",
        "denominazione_azienda",
        "comune",
        "id",
    )


class HealthCompanyDetailView(ReadUpdateDetailAPIView):
    serializer_class = HealthCompanyDetailSerializer
    write_serializer_class = HealthCompanyUpdateSerializer
    queryset = HealthCompany.objects.all()
