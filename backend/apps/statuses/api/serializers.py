"""Serializers for the read-only workflow `stato` / `stato_check` resources."""

from rest_framework import serializers

from apps.common.api.serializers import NullToEmptyMixin


class StatusSerializer(NullToEmptyMixin):
    """A workflow state — the displayable `nome` of a `stato` row, plus its id."""

    id = serializers.IntegerField()
    name = serializers.CharField(source="nome")


class StatusTransitionSerializer(NullToEmptyMixin):
    """A permitted state change — the from/to states of a `stato_check` row."""

    id = serializers.IntegerField()
    fromStatus = serializers.CharField(source="stato_partenza")
    toStatus = serializers.CharField(source="stato_arrivo")
