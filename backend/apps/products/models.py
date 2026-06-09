"""Product model mapping the existing `nomenclatore` table."""

from django.db import models

from apps.common.models import UnmanagedModel


class Product(UnmanagedModel):
    id = models.BigAutoField(primary_key=True)
    codice = models.CharField(max_length=255)
    descrizione = models.CharField(max_length=4000)
    prezzo = models.FloatField()
    anno = models.CharField(max_length=100, null=True, blank=True)

    class Meta(UnmanagedModel.Meta):
        db_table = "nomenclatore"

    def __str__(self) -> str:
        return self.descrizione or self.codice or str(self.pk)
