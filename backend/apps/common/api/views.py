"""Small DRF view bases and helpers shared by domain apps."""

from rest_framework import generics


def attach_related(rows, *, id_attr, attr, model):
    """
    Bulk-load the `model` instances referenced by each row's `id_attr` and attach
    the match as `attr` (None when the id is unset or the row no longer exists),
    so a serializer can render related fields without a per-row query. The lookup
    is a single `IN` query; `rows` is materialized and returned for chaining.
    """
    rows = list(rows)
    ids = {getattr(row, id_attr) for row in rows if getattr(row, id_attr)}
    related = model.objects.in_bulk(ids)
    for row in rows:
        setattr(row, attr, related.get(getattr(row, id_attr)))
    return rows


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


class ReadDetailAPIView(generics.RetrieveAPIView):
    pass


class ReadUpdateDetailAPIView(generics.RetrieveUpdateAPIView):
    write_serializer_class = None

    def get_serializer_class(self):
        if self.request.method in {"PATCH", "PUT"}:
            return self.write_serializer_class
        return self.serializer_class
