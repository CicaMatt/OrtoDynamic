"""Serializer helpers shared across domain apps."""

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


def optional_text(source=None, *, allow_null=False):
    field_kwargs = {"required": False, "allow_blank": True}
    if allow_null:
        field_kwargs["allow_null"] = True
    if source:
        field_kwargs["source"] = source
    return serializers.CharField(**field_kwargs)


def nullable_text(source=None):
    return optional_text(source, allow_null=True)


class UpdateFieldsSerializer(serializers.Serializer):
    """Serializer base that persists only the PATCH fields that changed."""

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if validated_data:
            instance.save(update_fields=list(validated_data.keys()))
        return instance
