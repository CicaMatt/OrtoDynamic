"""
Serializers for the Doctor resource backed by the legacy `medici` table.
"""

from rest_framework import serializers

from apps.common.api.serializers import NullToEmptyMixin


class DoctorListSerializer(NullToEmptyMixin):
    """Columns shown in the Medici table: every column except `note`."""

    id = serializers.CharField()
    surname = serializers.CharField(source="cognome")
    name = serializers.CharField(source="nome")
    address = serializers.CharField(source="indirizzo")
    phone = serializers.CharField(source="telefono")
    email = serializers.CharField(source="mail")


class DoctorDetailSerializer(DoctorListSerializer):
    """Full doctor detail, including notes."""

    note = serializers.CharField()


def _nullable_text(source):
    """Optional, blank/null-tolerant text field bound to a nullable column."""
    return serializers.CharField(source=source, required=False, allow_blank=True, allow_null=True)


class DoctorUpdateSerializer(serializers.Serializer):
    """
    Writable serializer for doctor detail edits.

    The doctor id is intentionally not writable.
    """

    surname = serializers.CharField(source="cognome", required=False, allow_blank=True)
    name = serializers.CharField(source="nome", required=False, allow_blank=True)
    address = _nullable_text("indirizzo")
    phone = _nullable_text("telefono")
    email = _nullable_text("mail")
    note = _nullable_text("note")

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if validated_data:
            instance.save(update_fields=list(validated_data.keys()))
        return instance
