"""
Workflow status tables, shared across domains.

Both tables are owned by the legacy database, so the models are unmanaged. They
are generic: each row is scoped to a domain table by name (`stato.tabella`,
`stato_check.tabella_check`), e.g. "PREVENTIVI", so one rules engine serves every
domain that opts in. Querying lives in `services.py`.
"""
from django.db import models

from apps.common.models import UnmanagedModel


class Status(UnmanagedModel):
    """A state a domain row may hold — maps the existing `stato` table."""

    id = models.BigAutoField(primary_key=True)
    nome = models.CharField(max_length=100, null=True, blank=True)
    tabella = models.CharField(max_length=100, null=True, blank=True)

    class Meta(UnmanagedModel.Meta):
        db_table = "stato"

    def __str__(self) -> str:
        return self.nome or str(self.pk)


class StatusTransition(UnmanagedModel):
    """A permitted state change — maps the existing `stato_check` table."""

    id = models.BigAutoField(primary_key=True)
    stato_partenza = models.CharField(max_length=100, null=True, blank=True)
    stato_arrivo = models.CharField(max_length=100, null=True, blank=True)
    tabella_check = models.CharField(max_length=100, null=True, blank=True)

    class Meta(UnmanagedModel.Meta):
        db_table = "stato_check"

    def __str__(self) -> str:
        return f"{self.stato_partenza} → {self.stato_arrivo}"
