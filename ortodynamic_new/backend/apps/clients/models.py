"""
Client model — maps the existing `clienti` table.

The table is owned by the legacy database, so this model is unmanaged
(`managed = False`, inherited from `UnmanagedModel`): Django reads and writes
rows but never generates migrations for it. Only the columns the application
currently uses are mapped; the `clienti` table has further measurement columns
that can be added here as features need them.
"""
from django.db import models

from apps.common.models import UnmanagedModel


class Client(UnmanagedModel):
    id = models.BigIntegerField(primary_key=True)

    cognome = models.CharField(max_length=255, null=True, blank=True)
    nome = models.CharField(max_length=255, null=True, blank=True)
    codice_fiscale = models.CharField(max_length=20, null=True, blank=True)
    data_nascita = models.DateField(null=True, blank=True)
    sesso = models.CharField(max_length=1, null=True, blank=True)

    telefono = models.CharField(max_length=50, null=True, blank=True)
    email = models.CharField(max_length=100, null=True, blank=True)

    comune_nascita = models.CharField(max_length=100, null=True, blank=True)
    indirizzo = models.CharField(max_length=255, null=True, blank=True)
    citta = models.CharField(max_length=100, null=True, blank=True)
    cap = models.CharField(max_length=10, null=True, blank=True)
    nazione = models.CharField(max_length=100, null=True, blank=True)
    distretto_appartenenza = models.CharField(max_length=255, null=True, blank=True)

    class Meta(UnmanagedModel.Meta):
        db_table = "clienti"

    def __str__(self) -> str:
        return f"{self.cognome} {self.nome}".strip() or str(self.pk)
