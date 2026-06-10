"""
Quote model — maps the existing `preventivi` table.

The table is owned by the legacy database, so this model is unmanaged
(`managed = False`, inherited from `UnmanagedModel`): Django reads and writes
rows but never generates migrations for it. The client and doctor links are kept
as plain integer columns (`id_cliente`, `id_medico`) to mirror the rest of the
mapped schema, which does not declare database-level foreign keys.
"""
from django.db import models

from apps.common.models import UnmanagedModel


class Quote(UnmanagedModel):
    id = models.BigAutoField(primary_key=True)

    # --- Links ---
    id_cliente = models.BigIntegerField()
    id_medico = models.BigIntegerField(null=True, blank=True)

    # --- Quote identity ---
    numero_preventivo = models.CharField(max_length=10, null=True, blank=True)
    tipologia_preventivo = models.CharField(max_length=20, null=True, blank=True)
    stato = models.CharField(max_length=50, default="INSERITO")
    data_creazione = models.DateField(null=True, blank=True)
    data_preventivo = models.DateField(null=True, blank=True)
    totale = models.FloatField(null=True, blank=True)
    entry_by = models.CharField(max_length=100, null=True, blank=True)

    # --- Clinical data ---
    diagnosi_circostanziata = models.CharField(max_length=2000, null=True, blank=True)
    programma_terapeutico = models.CharField(max_length=2000, null=True, blank=True)
    prescizione_dettagliata_protesi = models.CharField(max_length=2000, null=True, blank=True)

    # --- Authorization & deadlines ---
    numero_autorizzazione = models.CharField(max_length=20, null=True, blank=True)
    data_accettazione = models.DateField(null=True, blank=True)
    data_ricezione_autorizzazione = models.DateField(null=True, blank=True)
    giorni_scadenza = models.CharField(max_length=20, null=True, blank=True)
    massima_scadenza = models.CharField(max_length=50, null=True, blank=True)

    # --- Supply & invoicing ---
    misure_ok = models.CharField(max_length=50, null=True, blank=True)
    provvigioni_pagate = models.CharField(max_length=50, null=True, blank=True)
    numero_ordine = models.CharField(max_length=200, null=True, blank=True)
    modello = models.CharField(max_length=200, null=True, blank=True)
    misure = models.CharField(max_length=200, null=True, blank=True)
    numero_fattura = models.CharField(max_length=200, null=True, blank=True)

    # --- Free text ---
    # `db_column` maps the legacy capitalized column onto a PEP 8 attribute name.
    preventivo = models.CharField(max_length=2000, null=True, blank=True, db_column="Preventivo")
    note = models.CharField(max_length=2000, null=True, blank=True)
    note_private = models.TextField(null=True, blank=True)
    note_finali = models.CharField(max_length=2000, null=True, blank=True)

    class Meta(UnmanagedModel.Meta):
        db_table = "preventivi"

    def __str__(self) -> str:
        return self.numero_preventivo or str(self.pk)
