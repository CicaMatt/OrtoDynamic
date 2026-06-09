"""Thin endpoints for the Doctor resource."""

from apps.common.api.views import ReadUpdateDetailAPIView, UnpaginatedListAPIView
from apps.doctors.models import Doctor
from .serializers import DoctorDetailSerializer, DoctorListSerializer, DoctorUpdateSerializer


class DoctorListView(UnpaginatedListAPIView):
    serializer_class = DoctorListSerializer
    queryset = Doctor.objects.order_by("cognome", "nome", "id")


class DoctorDetailView(ReadUpdateDetailAPIView):
    serializer_class = DoctorDetailSerializer
    write_serializer_class = DoctorUpdateSerializer
    queryset = Doctor.objects.all()
