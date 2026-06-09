"""
Read queries for the HealthCompany resource.
"""

from django.db.models import QuerySet

from .models import HealthCompany


def list_health_companies() -> QuerySet[HealthCompany]:
    """All health companies, ordered for a stable, human-friendly listing."""
    return HealthCompany.objects.all().order_by(
        "denominazione_regione",
        "denominazione_azienda",
        "comune",
        "id",
    )


def health_companies_queryset() -> QuerySet[HealthCompany]:
    """Base queryset for single health-company lookups."""
    return HealthCompany.objects.all()
