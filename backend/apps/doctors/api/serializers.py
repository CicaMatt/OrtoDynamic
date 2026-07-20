"""
Serializers for the Doctor resource backed by the legacy `medici` table.
"""

from rest_framework import serializers

from apps.common.api.serializers import (
    CreatableSerializerMixin,
    NullToEmptyMixin,
    UpdateFieldsSerializer,
    nullable_text,
    nullable_text_fields,
    optional_text_fields,
    read_fields,
)

from apps.doctors.models import Doctor


class DoctorListSerializer(NullToEmptyMixin):
    """Columns shown in the Medici table: every column except `note`."""

    locals().update(read_fields({
        "idDoctor": "id",
        "surname": "cognome",
        "name": "nome",
        "address": "indirizzo",
        "phone": "telefono",
        "email": "mail",
    }))


class DoctorDetailSerializer(DoctorListSerializer):
    """Full doctor detail, including notes."""

    note = serializers.CharField()


class DoctorUpdateSerializer(UpdateFieldsSerializer):
    """
    Writable serializer for doctor detail edits.

    The doctor id is intentionally not writable.
    """

    locals().update(optional_text_fields({
        "surname": "cognome",
        "name": "nome",
    }))
    locals().update(nullable_text_fields({
        "address": "indirizzo",
        "phone": "telefono",
        "email": "mail",
    }))
    note = nullable_text()


class DoctorCreateSerializer(CreatableSerializerMixin, DoctorUpdateSerializer):
    """Create a doctor, reusing the update serializer's writable fields."""

    create_model = Doctor
    read_serializer_class = DoctorDetailSerializer
