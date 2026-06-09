"""
Health company model — maps the existing `aziende_sanitarie` table.
"""

from django.db import models

from apps.common.models import UnmanagedModel


class HealthCompany(UnmanagedModel):
    id = models.BigAutoField(primary_key=True)
    anno = models.IntegerField(null=True, blank=True)
    codice_regione = models.CharField(max_length=255, null=True, blank=True)
    denominazione_regione = models.CharField(max_length=255, null=True, blank=True)
    codice_azienda = models.CharField(max_length=255, null=True, blank=True)
    denominazione_azienda = models.CharField(max_length=255, null=True, blank=True)
    codice_comune = models.CharField(max_length=255, null=True, blank=True)
    comune = models.CharField(max_length=255, null=True, blank=True)
    maschi = models.CharField(max_length=255, null=True, blank=True)
    femmine = models.CharField(max_length=255, null=True, blank=True)
    totale = models.CharField(max_length=255, null=True, blank=True)
    distretto = models.CharField(max_length=255, null=True, blank=True)

    class Meta(UnmanagedModel.Meta):
        db_table = "aziende_sanitarie"

    def __str__(self) -> str:
        return self.denominazione_azienda or self.comune or str(self.pk)
