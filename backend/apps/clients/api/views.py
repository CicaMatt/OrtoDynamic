"""Thin endpoints for the Client resource."""

from django.http import HttpResponse
from django.utils import timezone
from rest_framework.views import APIView

from apps.clients.models import Client
from apps.common.api.views import (
    ReadDetailAPIView,
    ReadUpdateDetailAPIView,
    UnpaginatedListCreateAPIView,
)
from apps.common.exceptions import NotFoundError, TemplateAssetMissing
from apps.quotes.privacy_form import (
    prepare_privacy_form_fields,
    privacy_form_filename,
    render_privacy_form,
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


class ClientPrivacyFormView(APIView):
    """
    Stream a client's "Modulo di privacy" consent form as an inline PDF.

    The first name, surname and today's date are stamped onto a pre-printed
    template (see `apps.quotes.privacy_form`). The body is a raw PDF rather than
    the JSON envelope, so the view returns a Django `HttpResponse` directly; a
    missing template asset is reported through the standard error envelope.
    """

    def get(self, request, pk):
        client = Client.objects.filter(pk=pk).first()
        if client is None:
            raise NotFoundError("Cliente inesistente.")

        fields = prepare_privacy_form_fields(client, today=timezone.localdate())
        try:
            pdf = render_privacy_form(fields)
        except FileNotFoundError as exc:
            raise TemplateAssetMissing("Modello del modulo di privacy non disponibile.") from exc

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f'inline; filename="{privacy_form_filename(client)}"'
        return response
