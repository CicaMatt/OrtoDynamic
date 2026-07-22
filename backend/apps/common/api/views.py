"""Small DRF view bases and helpers shared by domain apps."""

from contextlib import contextmanager

from django.db import connection
from django.http import HttpResponse
from rest_framework import generics

from apps.common.database import database_update_lock


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


class DatabaseLockedUpdateMixin:
    """Run one record update at a time across browser sessions and app workers."""

    _locking_update = False

    def get_queryset(self):
        queryset = super().get_queryset()
        if self._locking_update and connection.features.has_select_for_update:
            return queryset.select_for_update()
        return queryset

    @contextmanager
    def locked_update(self):
        queryset = self.get_queryset()
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        record_id = self.kwargs[lookup_url_kwarg]
        with database_update_lock(queryset.model._meta.db_table, record_id):
            self._locking_update = True
            try:
                yield
            finally:
                self._locking_update = False

    def update(self, request, *args, **kwargs):
        with self.locked_update():
            return super().update(request, *args, **kwargs)


class ReadUpdateDetailAPIView(DatabaseLockedUpdateMixin, generics.RetrieveUpdateDestroyAPIView):
    write_serializer_class = None

    def get_serializer_class(self):
        if self.request.method in {"PATCH", "PUT"}:
            return self.write_serializer_class
        return self.serializer_class
