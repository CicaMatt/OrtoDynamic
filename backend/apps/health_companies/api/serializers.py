"""
Serializers for the HealthCompany resource backed by `aziende_sanitarie`.
"""

from rest_framework import serializers

from apps.common.api.serializers import (
    CreatableSerializerMixin,
    NullToEmptyMixin,
    UpdateFieldsSerializer,
    nullable_text_fields,
    read_fields,
)

from apps.health_companies.models import HealthCompany


class HealthCompanyListSerializer(NullToEmptyMixin):
    """Columns shown in the Aziende Sanitarie table."""

    locals().update(read_fields({
        "idHealthCompany": "id",
        "municipalityCode": "codice_comune",
        "municipality": "comune",
        "regionCode": "codice_regione",
        "regionName": "denominazione_regione",
        "companyCode": "codice_azienda",
        "companyName": "denominazione_azienda",
        "year": "anno",
    }))


class HealthCompanyDetailSerializer(HealthCompanyListSerializer):
    """Full set of fields shown in the health-company detail view."""

    locals().update(read_fields({
        "males": "maschi",
        "females": "femmine",
        "total": "totale",
        "district": "distretto",
    }))


class HealthCompanyUpdateSerializer(UpdateFieldsSerializer):
    """Writable serializer for health-company detail edits."""

    year = serializers.IntegerField(source="anno", required=False, allow_null=True)
    locals().update(nullable_text_fields({
        "municipalityCode": "codice_comune",
        "municipality": "comune",
        "regionCode": "codice_regione",
        "regionName": "denominazione_regione",
        "companyCode": "codice_azienda",
        "companyName": "denominazione_azienda",
        "males": "maschi",
        "females": "femmine",
        "total": "totale",
        "district": "distretto",
    }))


class HealthCompanyCreateSerializer(CreatableSerializerMixin, HealthCompanyUpdateSerializer):
    """Create a health company, reusing the update serializer's writable fields."""

    create_model = HealthCompany
    read_serializer_class = HealthCompanyDetailSerializer
