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


def person_display_name(person):
    """
    Display name "Nome Cognome" for a person-like row (client/doctor), or "" when
    the reference is absent. Single source of the convention used wherever the API
    surfaces a linked person by name rather than id.
    """
    if person is None:
        return ""
    return f"{person.nome or ''} {person.cognome or ''}".strip()


class UpdateFieldsSerializer(serializers.Serializer):
    """Serializer base that persists only the PATCH fields that changed."""

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if validated_data:
            instance.save(update_fields=list(validated_data.keys()))
        return instance


class CreatableSerializerMixin:
    """
    Adds creation to a writable serializer (typically an `UpdateFieldsSerializer`
    subclass), so the same field definitions drive both update and create.

    Subclasses set `create_model` (the Django model to insert) and
    `read_serializer_class` (used to render the created instance back to the
    client). Validated field names already map to model attributes via `source`.
    """

    create_model = None
    read_serializer_class = None

    def create(self, validated_data):
        return self.create_model.objects.create(**validated_data)

    def to_representation(self, instance):
        return self.read_serializer_class(instance).data
