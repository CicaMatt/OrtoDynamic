"""
Work order model — maps the existing `lavorazioni` table.

The table is owned by the legacy database, so this model is unmanaged
(`managed = False`, inherited from `UnmanagedModel`): Django reads and writes
rows but never generates migrations for it. The quote and client links are kept
as plain integer columns (`id_preventivo`, `id_cliente`), mirroring the rest of
the mapped schema, which does not declare database-level foreign keys.
"""
from django.db import models

from apps.common.models import UnmanagedModel


class WorkOrder(UnmanagedModel):
    id = models.BigAutoField(primary_key=True)

    # --- Links ---
    id_preventivo = models.BigIntegerField()
    id_cliente = models.BigIntegerField(null=True, blank=True)

    # --- Work order lifecycle ---
    stato = models.CharField(max_length=100, null=True, blank=True)
    data_creazione_lavorazione = models.DateField(null=True, blank=True)
    data_fine_lavorazione = models.DateField(null=True, blank=True)
    data_consegna = models.DateField(null=True, blank=True)
    data_annullamento = models.DateField(null=True, blank=True)
    massima_scadenza = models.CharField(max_length=30, null=True, blank=True)

    # --- Client trial & check ---
    prova_cliente = models.CharField(max_length=200, null=True, blank=True)
    pos_ril = models.CharField(max_length=200, null=True, blank=True)
    data_prova_cliente = models.DateField(null=True, blank=True)
    # `db_column` maps the legacy capitalized column onto a PEP 8 attribute name.
    verifica_cliente = models.CharField(
        max_length=200, null=True, blank=True, db_column="Verifica_cliente"
    )
    verifica_pos_ril = models.CharField(max_length=200, null=True, blank=True)
    data_verifica_cliente = models.DateField(null=True, blank=True)
    firma_medico = models.CharField(max_length=200, null=True, blank=True)

    # --- Technical service / after-sales ---
    assistenza_tecnica = models.CharField(max_length=200, null=True, blank=True)
    stato_lavorazione_assistenza = models.CharField(max_length=200, null=True, blank=True)
    ragione_reclamo = models.CharField(max_length=200, null=True, blank=True)
    presidio = models.CharField(max_length=200, null=True, blank=True)
    garanzia = models.CharField(max_length=200, null=True, blank=True)
    data_consegna_assistenza = models.DateField(null=True, blank=True)
    esito_collaudo_assistenza_tecnica = models.CharField(max_length=200, null=True, blank=True)
    data_esito_collaudo_assistenza = models.DateField(null=True, blank=True)
    firma_medico_assistenza = models.CharField(max_length=200, null=True, blank=True)
    firma_tecnico = models.CharField(max_length=200, null=True, blank=True)

    # --- Free text ---
    descrizione_intervento = models.TextField(null=True, blank=True)
    annotazioni_tecniche_assistenza = models.TextField(null=True, blank=True)

    class Meta(UnmanagedModel.Meta):
        db_table = "lavorazioni"

    def __str__(self) -> str:
        return f"Lavorazione {self.pk}"


class WorkOrderItem(UnmanagedModel):
    """
    Bridge row linking a work order to a quote line item — maps the existing
    `item_lavorazioni` table.

    Only the columns needed to resolve that link are mapped: `id_lavorazione`
    references `lavorazioni.id` (the parent work order) and `id_item_preventivi`
    references `item_preventivi.id` (the quote line item rendered in the detail
    view). Both are plain integer columns, mirroring the rest of the mapped
    schema, which declares no database-level foreign keys.
    """

    id = models.BigAutoField(primary_key=True)
    id_lavorazione = models.BigIntegerField()
    id_item_preventivi = models.BigIntegerField(null=True, blank=True)

    class Meta(UnmanagedModel.Meta):
        db_table = "item_lavorazioni"

    def __str__(self) -> str:
        return str(self.pk)
