"""
Read queries for the Doctor resource.
"""

from django.db.models import QuerySet

from .models import Doctor


def list_doctors() -> QuerySet[Doctor]:
    """All doctors, ordered for a stable, human-friendly listing."""
    return Doctor.objects.all().order_by("cognome", "nome", "id")


def doctors_queryset() -> QuerySet[Doctor]:
    """Base queryset for single-doctor lookups."""
    return Doctor.objects.all()
