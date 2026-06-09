"""Thin endpoints for the Client resource."""

from apps.clients.models import Client
from apps.common.api.views import (
    ReadDetailAPIView,
    ReadUpdateDetailAPIView,
    UnpaginatedListAPIView,
)
from .serializers import (
    ClientDetailSerializer,
    ClientListSerializer,
    ClientOrthopedicSerializer,
    ClientUpdateSerializer,
)


class ClientListView(UnpaginatedListAPIView):
    serializer_class = ClientListSerializer
    queryset = Client.objects.order_by("cognome", "nome", "id")


class ClientDetailView(ReadUpdateDetailAPIView):
    serializer_class = ClientDetailSerializer
    write_serializer_class = ClientUpdateSerializer
    queryset = Client.objects.all()


class ClientOrthopedicView(ReadDetailAPIView):
    serializer_class = ClientOrthopedicSerializer
    queryset = Client.objects.all()
