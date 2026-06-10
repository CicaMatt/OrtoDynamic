"""
Serializers for the WorkOrder resource backed by `lavorazioni`.

Field names are the camelCase keys the frontend consumes directly. The list and
detail views expose the full column set, so a single read serializer serves
both; `NullToEmptyMixin` renders SQL NULLs as empty strings and dates as plain
strings, keeping the frontend's all-strings contract.
"""
from rest_framework import serializers

from apps.common.api.serializers import (
    NullToEmptyMixin,
    UpdateFieldsSerializer,
    nullable_text,
)


class WorkOrderSerializer(NullToEmptyMixin):
    """Full column set shown in both the Lavorazioni table and detail view."""

    id = serializers.CharField()

    # Links
    quoteId = serializers.CharField(source="id_preventivo")
    clientId = serializers.CharField(source="id_cliente")

    # Lifecycle
    status = serializers.CharField(source="stato")
    creationDate = serializers.DateField(source="data_creazione_lavorazione")
    completionDate = serializers.DateField(source="data_fine_lavorazione")
    deliveryDate = serializers.DateField(source="data_consegna")
    cancellationDate = serializers.DateField(source="data_annullamento")
    maxExpiry = serializers.CharField(source="massima_scadenza")

    # Client trial & check
    clientTrial = serializers.CharField(source="prova_cliente")
    clientTrialOutcome = serializers.CharField(source="pos_ril")
    clientTrialDate = serializers.DateField(source="data_prova_cliente")
    clientCheck = serializers.CharField(source="verifica_cliente")
    clientCheckOutcome = serializers.CharField(source="verifica_pos_ril")
    clientCheckDate = serializers.DateField(source="data_verifica_cliente")
    doctorSignature = serializers.CharField(source="firma_medico")

    # Technical service
    technicalService = serializers.CharField(source="assistenza_tecnica")
    serviceStatus = serializers.CharField(source="stato_lavorazione_assistenza")
    complaintReason = serializers.CharField(source="ragione_reclamo")
    device = serializers.CharField(source="presidio")
    warranty = serializers.CharField(source="garanzia")
    serviceDeliveryDate = serializers.DateField(source="data_consegna_assistenza")
    testOutcome = serializers.CharField(source="esito_collaudo_assistenza_tecnica")
    testOutcomeDate = serializers.DateField(source="data_esito_collaudo_assistenza")
    serviceDoctorSignature = serializers.CharField(source="firma_medico_assistenza")
    technicianSignature = serializers.CharField(source="firma_tecnico")

    # Free text
    interventionDescription = serializers.CharField(source="descrizione_intervento")
    technicalNotes = serializers.CharField(source="annotazioni_tecniche_assistenza")


class WorkOrderUpdateSerializer(UpdateFieldsSerializer):
    """
    Writable serializer for editing a work order. Every field is optional so
    PATCH sends only what changed. `quoteId` is required-on-the-row and therefore
    not nullable; everything else may be cleared.
    """

    # Links
    quoteId = serializers.IntegerField(source="id_preventivo", required=False)
    clientId = serializers.IntegerField(source="id_cliente", required=False, allow_null=True)

    # Lifecycle
    status = nullable_text("stato")
    creationDate = serializers.DateField(
        source="data_creazione_lavorazione", required=False, allow_null=True
    )
    completionDate = serializers.DateField(
        source="data_fine_lavorazione", required=False, allow_null=True
    )
    deliveryDate = serializers.DateField(source="data_consegna", required=False, allow_null=True)
    cancellationDate = serializers.DateField(
        source="data_annullamento", required=False, allow_null=True
    )
    maxExpiry = nullable_text("massima_scadenza")

    # Client trial & check
    clientTrial = nullable_text("prova_cliente")
    clientTrialOutcome = nullable_text("pos_ril")
    clientTrialDate = serializers.DateField(
        source="data_prova_cliente", required=False, allow_null=True
    )
    clientCheck = nullable_text("verifica_cliente")
    clientCheckOutcome = nullable_text("verifica_pos_ril")
    clientCheckDate = serializers.DateField(
        source="data_verifica_cliente", required=False, allow_null=True
    )
    doctorSignature = nullable_text("firma_medico")

    # Technical service
    technicalService = nullable_text("assistenza_tecnica")
    serviceStatus = nullable_text("stato_lavorazione_assistenza")
    complaintReason = nullable_text("ragione_reclamo")
    device = nullable_text("presidio")
    warranty = nullable_text("garanzia")
    serviceDeliveryDate = serializers.DateField(
        source="data_consegna_assistenza", required=False, allow_null=True
    )
    testOutcome = nullable_text("esito_collaudo_assistenza_tecnica")
    testOutcomeDate = serializers.DateField(
        source="data_esito_collaudo_assistenza", required=False, allow_null=True
    )
    serviceDoctorSignature = nullable_text("firma_medico_assistenza")
    technicianSignature = nullable_text("firma_tecnico")

    # Free text
    interventionDescription = nullable_text("descrizione_intervento")
    technicalNotes = nullable_text("annotazioni_tecniche_assistenza")
