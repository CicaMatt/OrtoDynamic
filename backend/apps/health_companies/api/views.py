"""Thin endpoints for the HealthCompany resource."""

from apps.common.api.views import ReadUpdateDetailAPIView, UnpaginatedListCreateAPIView
from apps.health_companies.models import HealthCompany
from .serializers import (
    HealthCompanyCreateSerializer,
    HealthCompanyDetailSerializer,
    HealthCompanyListSerializer,
    HealthCompanyUpdateSerializer,
)


class HealthCompanyListView(UnpaginatedListCreateAPIView):
    serializer_class = HealthCompanyListSerializer
    create_serializer_class = HealthCompanyCreateSerializer
    queryset = HealthCompany.objects.order_by("-id")


class HealthCompanyDetailView(ReadUpdateDetailAPIView):
    serializer_class = HealthCompanyDetailSerializer
    write_serializer_class = HealthCompanyUpdateSerializer
    queryset = HealthCompany.objects.all()
