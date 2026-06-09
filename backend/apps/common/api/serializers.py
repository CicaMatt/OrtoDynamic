"""
Serializer helpers shared across domain apps.
"""

from rest_framework import serializers


class NullToEmptyMixin(serializers.Serializer):
    """Render NULL fields as empty strings and trim stray whitespace."""

    @staticmethod
    def _clean(value):
        if value is None:
            return ""
        if isinstance(value, str):
            return value.strip()
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {key: self._clean(value) for key, value in data.items()}
