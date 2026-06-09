"""
Thin read endpoints for the Client resource.

Views only wire HTTP to serializers and selectors — no query or business logic
lives here. Writes (create/update/state changes) will be added as the frontend
needs them.
"""
from rest_framework import generics

from apps.clients.selectors import clients_queryset, list_clients
from .serializers import (
    ClientDetailSerializer,
    ClientListSerializer,
    ClientOrthopedicSerializer,
    ClientUpdateSerializer,
)


class ClientListView(generics.ListAPIView):
    serializer_class = ClientListSerializer
    # The Clienti view filters and searches client-side over the full list, so
    # this endpoint returns every client rather than a paginated page. Revisit
    # with server-side search/pagination if the dataset grows substantially.
    pagination_class = None

    def get_queryset(self):
        return list_clients()


class ClientDetailView(generics.RetrieveUpdateAPIView):
    """GET returns the full client detail; PATCH updates editable fields."""

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return ClientUpdateSerializer
        return ClientDetailSerializer

    def get_queryset(self):
        return clients_queryset()


class ClientOrthopedicView(generics.RetrieveAPIView):
    serializer_class = ClientOrthopedicSerializer

    def get_queryset(self):
        return clients_queryset()
