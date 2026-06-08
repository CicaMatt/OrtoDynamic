"""
Read queries for the Client resource.

Keeping query logic here (rather than in views) keeps the views thin and the
data-access rules in one place, ready to grow into server-side search/filtering
when the list outgrows client-side filtering.
"""
from django.db.models import QuerySet

from .models import Client


def list_clients() -> QuerySet[Client]:
    """All clients, ordered for a stable, human-friendly listing."""
    return Client.objects.all().order_by("cognome", "nome", "id")


def clients_queryset() -> QuerySet[Client]:
    """Base queryset for single-client lookups (404 handling done by the view)."""
    return Client.objects.all()
