"""
Thin endpoints for the Doctor resource.
"""

from rest_framework import generics

from apps.doctors.selectors import doctors_queryset, list_doctors
from .serializers import DoctorDetailSerializer, DoctorListSerializer, DoctorUpdateSerializer


class DoctorListView(generics.ListAPIView):
    serializer_class = DoctorListSerializer
    pagination_class = None

    def get_queryset(self):
        return list_doctors()


class DoctorDetailView(generics.RetrieveUpdateAPIView):
    """GET returns full doctor detail; PATCH updates editable fields."""

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return DoctorUpdateSerializer
        return DoctorDetailSerializer

    def get_queryset(self):
        return doctors_queryset()
