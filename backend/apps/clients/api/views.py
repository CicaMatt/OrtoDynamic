"""Thin endpoints for the Client resource."""

from apps.clients.models import Client
from apps.common.api.views import (
    ReadDetailAPIView,
    ReadUpdateDetailAPIView,
    UnpaginatedListCreateAPIView,
)
from .serializers import (
    ClientCreateSerializer,
    ClientDetailSerializer,
    ClientListSerializer,
    ClientOrthopedicSerializer,
    ClientUpdateSerializer,
)


class ClientListView(UnpaginatedListCreateAPIView):
    serializer_class = ClientListSerializer
    create_serializer_class = ClientCreateSerializer
    queryset = Client.objects.order_by("cognome", "nome", "id")


class ClientDetailView(ReadUpdateDetailAPIView):
    serializer_class = ClientDetailSerializer
    write_serializer_class = ClientUpdateSerializer
    queryset = Client.objects.all()


class ClientOrthopedicView(ReadDetailAPIView):
    serializer_class = ClientOrthopedicSerializer
    queryset = Client.objects.all()
