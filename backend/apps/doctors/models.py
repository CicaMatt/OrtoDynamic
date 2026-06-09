"""
Doctor model — maps the existing `medici` table.
"""

from django.db import models

from apps.common.models import UnmanagedModel


class Doctor(UnmanagedModel):
    id = models.BigAutoField(primary_key=True)
    cognome = models.CharField(max_length=255)
    nome = models.CharField(max_length=255)
    indirizzo = models.CharField(max_length=1000, null=True, blank=True)
    telefono = models.CharField(max_length=50, null=True, blank=True)
    mail = models.CharField(max_length=100, null=True, blank=True)
    note = models.CharField(max_length=1000, null=True, blank=True)

    class Meta(UnmanagedModel.Meta):
        db_table = "medici"

    def __str__(self) -> str:
        return f"{self.cognome} {self.nome}".strip() or str(self.pk)
