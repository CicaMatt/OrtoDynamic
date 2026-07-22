"""
Serializers for the Doctor resource backed by the legacy `medici` table.
"""

from rest_framework import serializers

from apps.common.api.serializers import (
    NullToEmptySerializer,
    UpdateFieldsSerializer,
    nullable_text,
    optional_text,
)

from apps.doctors.models import Doctor


class DoctorListSerializer(NullToEmptySerializer):
    """Columns shown in the Medici table: every column except `note`."""

    idDoctor = serializers.CharField(source="id")
    surname = serializers.CharField(source="cognome")
    name = serializers.CharField(source="nome")
    address = serializers.CharField(source="indirizzo")
    phone = serializers.CharField(source="telefono")
    email = serializers.CharField(source="mail")


class DoctorDetailSerializer(DoctorListSerializer):
    """Full doctor detail, including notes."""

    note = serializers.CharField()


class DoctorUpdateSerializer(UpdateFieldsSerializer):
    """
    Writable serializer for doctor detail edits.

    The doctor id is intentionally not writable.
    """

    surname = optional_text("cognome")
    name = optional_text("nome")
    address = nullable_text("indirizzo")
    phone = nullable_text("telefono")
    email = nullable_text("mail")
    note = nullable_text()


class DoctorCreateSerializer(DoctorUpdateSerializer):
    """Create a doctor; identity fields are true persistence requirements."""

    surname = serializers.CharField(source="cognome", max_length=255)
    name = serializers.CharField(source="nome", max_length=255)

    def create(self, validated_data):
        return Doctor.objects.create(**validated_data)

    def to_representation(self, instance):
        return DoctorDetailSerializer(instance).data
