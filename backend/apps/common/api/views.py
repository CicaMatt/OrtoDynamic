"""Small DRF view bases and helpers shared by domain apps."""

from django.http import HttpResponse
from rest_framework import generics


def inline_pdf_response(pdf: bytes, filename: str) -> HttpResponse:
    response = HttpResponse(pdf, content_type="application/pdf")
    response["Content-Disposition"] = f'inline; filename="{filename}"'
    return response


class UnpaginatedListAPIView(generics.ListAPIView):
    pagination_class = None


class UnpaginatedListCreateAPIView(generics.ListCreateAPIView):
    """List (GET) with the read serializer and create (POST) with a separate one."""

    pagination_class = None
    create_serializer_class = None

    def get_serializer_class(self):
        if self.request.method == "POST":
            return self.create_serializer_class
        return self.serializer_class


class ReadUpdateDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    write_serializer_class = None

    def get_serializer_class(self):
        if self.request.method in {"PATCH", "PUT"}:
            return self.write_serializer_class
        return self.serializer_class
