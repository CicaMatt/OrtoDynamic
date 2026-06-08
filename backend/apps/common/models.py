"""
Reusable abstract base models for domain apps.

The management system maps tables in an already-existing database, so domain
models will typically subclass `UnmanagedModel` — Django reads and writes the
rows but does not own the schema (no migrations are generated for them).
Use these bases to keep every domain app consistent.
"""
from django.db import models


class UnmanagedModel(models.Model):
    """
    Base for models that map an existing, externally-owned table.

    Subclasses must set `db_table` (and `managed = False` is inherited) in their
    own Meta. Example:

        class Client(UnmanagedModel):
            name = models.CharField(max_length=255, db_column="nome")

            class Meta(UnmanagedModel.Meta):
                db_table = "clienti"
    """

    class Meta:
        abstract = True
        managed = False


class TimestampedModel(models.Model):
    """Base for tables Django *does* own, adding created/updated bookkeeping."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
