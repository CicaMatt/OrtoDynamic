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
    comune_nascita = models.CharField(max_length=100, null=True, blank=True)
    sesso = models.CharField(max_length=1, null=True, blank=True)

    telefono = models.CharField(max_length=50, null=True, blank=True)
    cellulare = models.CharField(max_length=50, null=True, blank=True)
    email = models.CharField(max_length=100, null=True, blank=True)
    id_medico = models.BigIntegerField(null=True, blank=True)

    indirizzo = models.CharField(max_length=255, null=True, blank=True)
    citta = models.CharField(max_length=100, null=True, blank=True)
    provincia = models.CharField(max_length=100, null=True, blank=True)
    cap = models.CharField(max_length=10, null=True, blank=True)
    nazione = models.CharField(max_length=100, null=True, blank=True)
    distretto_appartenenza = models.CharField(max_length=255, null=True, blank=True)

    # --- Orthopedic data (footwear / insole) ---
    misura_scarpa = models.CharField(max_length=100, null=True, blank=True)
    modello_scarpa = models.CharField(max_length=255, null=True, blank=True)
    pianta = models.CharField(max_length=100, null=True, blank=True)
    collo = models.CharField(max_length=100, null=True, blank=True)
    caviglia = models.CharField(max_length=50, null=True, blank=True)
    speronatura = models.CharField(max_length=100, null=True, blank=True)
    rialzo = models.CharField(max_length=100, null=True, blank=True)
    piano_incl_tot = models.CharField(max_length=100, null=True, blank=True)
    tipo_plantare = models.CharField(max_length=100, null=True, blank=True)
    passaggio_collo = models.CharField(max_length=50, null=True, blank=True)
    passaggio_caviglie = models.CharField(max_length=50, null=True, blank=True)

    # --- Orthopedic data (brace / frame) ---
    tipo_tutore = models.CharField(max_length=100, null=True, blank=True)
    spallacci = models.CharField(max_length=255, null=True, blank=True)
    fino_ascella = models.CharField(max_length=10, null=True, blank=True)
    alt_stoffa_ant = models.CharField(max_length=10, null=True, blank=True)
    alt_tot_armatura = models.CharField(max_length=255, null=True, blank=True)
    dist_ascellare = models.CharField(max_length=10, null=True, blank=True)

    # --- Orthopedic data (body measurements) ---
    misura_vita = models.CharField(max_length=10, null=True, blank=True)
    misura_bacino = models.CharField(max_length=10, null=True, blank=True)
    misura_2_4 = models.CharField(max_length=10, null=True, blank=True)
    mis_collo = models.CharField(max_length=10, null=True, blank=True)
    mis_omero = models.CharField(max_length=10, null=True, blank=True)
    mis_braccio = models.CharField(max_length=10, null=True, blank=True)
    mis_polso = models.CharField(max_length=10, null=True, blank=True)
    mis_bacino = models.CharField(max_length=10, null=True, blank=True)
    mis_coscia = models.CharField(max_length=10, null=True, blank=True)
    mis_gamba = models.CharField(max_length=10, null=True, blank=True)

    # --- Orthopedic notes ---
    note = models.CharField(max_length=1000, null=True, blank=True)
    altro = models.CharField(max_length=1000, null=True, blank=True)
    note_cliente = models.CharField(max_length=4000, null=True, blank=True)

    class Meta(UnmanagedModel.Meta):
        db_table = "clienti"

    def __str__(self) -> str:
        return f"{self.cognome} {self.nome}".strip() or str(self.pk)
