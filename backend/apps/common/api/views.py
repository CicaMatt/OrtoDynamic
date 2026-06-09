"""Small DRF view bases shared by domain apps."""

from rest_framework import generics


class UnpaginatedListAPIView(generics.ListAPIView):
    pagination_class = None


class ReadDetailAPIView(generics.RetrieveAPIView):
    pass


class ReadUpdateDetailAPIView(generics.RetrieveUpdateAPIView):
    write_serializer_class = None

    def get_serializer_class(self):
        if self.request.method in {"PATCH", "PUT"}:
            return self.write_serializer_class
        return self.serializer_class
