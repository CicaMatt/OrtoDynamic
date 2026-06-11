"""
Municipality model — maps the existing `comuni` lookup table.

The table has no surrogate key, so `Comune` (the municipality name) acts as the
model's primary key. It is read-only reference data (used to populate the city
pickers), and the few legacy same-name rows differ by province, so they are kept
as distinct rows; the resource is never fetched by primary key.
"""
from django.db import models

from apps.common.models import UnmanagedModel


class Municipality(UnmanagedModel):
    name = models.CharField(max_length=255, primary_key=True, db_column="Comune")
    province = models.CharField(max_length=2, null=True, blank=True, db_column="Provincia")
    cap = models.CharField(max_length=255, null=True, blank=True, db_column="CAP")

    class Meta(UnmanagedModel.Meta):
        db_table = "comuni"

    def __str__(self) -> str:
        return self.name
