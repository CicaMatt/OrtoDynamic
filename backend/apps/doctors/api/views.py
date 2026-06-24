"""Thin endpoints for the Doctor resource."""

from apps.common.api.views import ReadUpdateDetailAPIView, UnpaginatedListCreateAPIView
from apps.doctors.models import Doctor
from .serializers import (
    DoctorCreateSerializer,
    DoctorDetailSerializer,
    DoctorListSerializer,
    DoctorUpdateSerializer,
)


class DoctorListView(UnpaginatedListCreateAPIView):
    serializer_class = DoctorListSerializer
    create_serializer_class = DoctorCreateSerializer
    queryset = Doctor.objects.order_by("-id")


class DoctorDetailView(ReadUpdateDetailAPIView):
    serializer_class = DoctorDetailSerializer
    write_serializer_class = DoctorUpdateSerializer
    queryset = Doctor.objects.all()
