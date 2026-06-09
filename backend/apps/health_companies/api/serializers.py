"""
Serializers for the HealthCompany resource backed by `aziende_sanitarie`.
"""

from rest_framework import serializers

from apps.common.api.serializers import NullToEmptyMixin


class HealthCompanyListSerializer(NullToEmptyMixin):
    """Columns shown in the Aziende Sanitarie table."""

    id = serializers.CharField()
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


def _nullable_text(source):
    """Optional, blank/null-tolerant text field bound to a nullable column."""
    return serializers.CharField(source=source, required=False, allow_blank=True, allow_null=True)


class HealthCompanyUpdateSerializer(serializers.Serializer):
    """Writable serializer for health-company detail edits."""

    year = serializers.IntegerField(source="anno", required=False, allow_null=True)
    municipalityCode = _nullable_text("codice_comune")
    municipality = _nullable_text("comune")
    regionCode = _nullable_text("codice_regione")
    regionName = _nullable_text("denominazione_regione")
    companyCode = _nullable_text("codice_azienda")
    companyName = _nullable_text("denominazione_azienda")
    males = _nullable_text("maschi")
    females = _nullable_text("femmine")
    total = _nullable_text("totale")
    district = _nullable_text("distretto")

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if validated_data:
            instance.save(update_fields=list(validated_data.keys()))
        return instance
