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
    # The states a work order may hold. Freely selectable, with no transition
    # rules between them (unlike quotes, which are DB-driven via apps.statuses).
    STATUSES = (
        "IN LAVORAZIONE",
        "IN FINITURA",
        "LAVORATO",
        "LAVORATO PARZIALE",
        "ANNULLATO",
        "DA CONSEGNARE",
        "PRONTO PRIMA PROVA",
        "PRONTO SECONDA PROVA",
        "PRONTO TERZA PROVA",
        "IN REVISIONE DOPO CONSEGNA",
        "INVIATE A LACO PER MODIFICA",
    )

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
    A work order line — maps the existing `item_lavorazioni` table.

    Links are plain integer columns, mirroring the rest of the mapped schema:
    `id_lavorazione` references `lavorazioni.id` (the parent work order) and
    `id_item_preventivi` references `item_preventivi.id` (the quote line whose
    product/amount data is shown alongside this line). The remaining mapped
    columns are this line's own lifecycle state and dates.
    """

    # Item-level states, freely selectable (independent of the work order's set).
    STATUSES = ("IN LAVORAZIONE", "ORDINATO", "PRONTO", "CONSEGNATO", "ANNULLATO")
    PRODUCTIONS = ("ESTERNA", "INTERNA")

    id = models.BigAutoField(primary_key=True)

    # --- Links ---
    id_lavorazione = models.BigIntegerField()
    id_item_preventivi = models.BigIntegerField(null=True, blank=True)

    # --- Lifecycle ---
    stato = models.CharField(max_length=100, null=True, blank=True)
    produzione = models.CharField(max_length=200, null=True, blank=True)
    data_annullamento = models.DateField(null=True, blank=True)
    data_ordine = models.DateField(null=True, blank=True)
    data_consegna_parziale = models.DateField(null=True, blank=True)
    data_consegna = models.DateField(null=True, blank=True)

    # --- Traceability (rendered on the risk-assessment / testing sheet) ---
    # `db_column` maps the legacy uppercase `DDT` column onto a PEP 8 attribute.
    materiale = models.TextField(null=True, blank=True)
    fornitore = models.TextField(null=True, blank=True)
    ddt = models.TextField(null=True, blank=True, db_column="DDT")
    lotto = models.TextField(null=True, blank=True)

    # --- Line data copied from the quote line when the work order is created ---
    # `codice_nomenclatore` here holds the catalogue *code* (a numeric tariff code),
    # not the `nomenclatore.id` reference that the quote line stores.
    codice_nomenclatore = models.BigIntegerField(null=True, blank=True)
    descrizione_nomenclatore = models.CharField(max_length=500, null=True, blank=True)
    importo = models.FloatField(null=True, blank=True)
    quantita = models.FloatField(null=True, blank=True)
    data_creazione_lavorazione = models.DateField(null=True, blank=True)

    class Meta(UnmanagedModel.Meta):
        db_table = "item_lavorazioni"

    def __str__(self) -> str:
        return str(self.pk)


class PeriodicCheck(UnmanagedModel):
    """
    Periodic maintenance/check record — maps the existing `controlli_periodici` table.

    Linked to its work order by the plain integer column `id_lavorazione`
    (references `lavorazioni.id`), mirroring the rest of the mapped schema. Only the
    columns rendered on the risk-assessment / testing sheet are mapped.
    """

    id = models.BigAutoField(primary_key=True)

    id_lavorazione = models.BigIntegerField()
    data_intervento = models.DateField(null=True, blank=True)
    intervento = models.TextField(null=True, blank=True)
    firma_tecnico = models.CharField(max_length=200, null=True, blank=True)

    class Meta(UnmanagedModel.Meta):
        db_table = "controlli_periodici"

    def __str__(self) -> str:
        return f"Controllo {self.pk}"
