"""
Thin endpoints for the HealthCompany resource.
"""

from rest_framework import generics

from apps.health_companies.selectors import health_companies_queryset, list_health_companies
from .serializers import (
    HealthCompanyDetailSerializer,
    HealthCompanyListSerializer,
    HealthCompanyUpdateSerializer,
)


class HealthCompanyListView(generics.ListAPIView):
    serializer_class = HealthCompanyListSerializer
    pagination_class = None

    def get_queryset(self):
        return list_health_companies()


class HealthCompanyDetailView(generics.RetrieveUpdateAPIView):
    """GET returns full detail; PATCH updates editable fields."""

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return HealthCompanyUpdateSerializer
        return HealthCompanyDetailSerializer

    def get_queryset(self):
        return health_companies_queryset()
