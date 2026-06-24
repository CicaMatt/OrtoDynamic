"""
Serializers for the HealthCompany resource backed by `aziende_sanitarie`.
"""

from rest_framework import serializers

from apps.common.api.serializers import (
    CreatableSerializerMixin,
    NullToEmptyMixin,
    UpdateFieldsSerializer,
    nullable_text,
)

from apps.health_companies.models import HealthCompany


class HealthCompanyListSerializer(NullToEmptyMixin):
    """Columns shown in the Aziende Sanitarie table."""

    idHealthCompany = serializers.CharField(source="id")
    municipalityCode = serializers.CharField(source="codice_comune")
    municipality = serializers.CharField(source="comune")
    regionCode = serializers.CharField(source="codice_regione")
    regionName = serializers.CharField(source="denominazione_regione")
    companyCode = serializers.CharField(source="codice_azienda")
    companyName = serializers.CharField(source="denominazione_azienda")
    year = serializers.CharField(source="anno")


class HealthCompanyDetailSerializer(HealthCompanyListSerializer):
    """Full set of fields shown in the health-company detail view."""

    males = serializers.CharField(source="maschi")
    females = serializers.CharField(source="femmine")
    total = serializers.CharField(source="totale")
    district = serializers.CharField(source="distretto")


class HealthCompanyUpdateSerializer(UpdateFieldsSerializer):
    """Writable serializer for health-company detail edits."""

    year = serializers.IntegerField(source="anno", required=False, allow_null=True)
    municipalityCode = nullable_text("codice_comune")
    municipality = nullable_text("comune")
    regionCode = nullable_text("codice_regione")
    regionName = nullable_text("denominazione_regione")
    companyCode = nullable_text("codice_azienda")
    companyName = nullable_text("denominazione_azienda")
    males = nullable_text("maschi")
    females = nullable_text("femmine")
    total = nullable_text("totale")
    district = nullable_text("distretto")


class HealthCompanyCreateSerializer(CreatableSerializerMixin, HealthCompanyUpdateSerializer):
    """Create a health company, reusing the update serializer's writable fields."""

    create_model = HealthCompany
    read_serializer_class = HealthCompanyDetailSerializer
