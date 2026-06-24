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
    person_display_name,
)
from apps.work_orders.models import WorkOrder, WorkOrderItem


class WorkOrderSerializer(NullToEmptyMixin):
    """Full column set shown in both the Lavorazioni table and detail view."""

    idWorkOrder = serializers.CharField(source="id")

    # Links
    quoteId = serializers.CharField(source="id_preventivo")
    clientId = serializers.CharField(source="id_cliente")
    # Display name for the linked client, resolved from the object the view
    # attaches (empty when the reference is unset or the row is gone). The frontend
    # shows this in place of the raw id, revealing the id on hover.
    clientName = serializers.SerializerMethodField()

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

    def get_clientName(self, work_order):
        return person_display_name(getattr(work_order, "client", None))


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
    # `status` is intentionally not writable here: it changes only through the
    # status endpoint, which restricts the value to the defined work-order states.
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


class WorkOrderStatusUpdateSerializer(serializers.Serializer):
    """
    Set a work order's status. The target is chosen freely from the fixed set of
    work-order states (no transition rules); `ChoiceField` rejects anything else.
    The read representation is the full work order.
    """

    status = serializers.ChoiceField(choices=WorkOrder.STATUSES, source="stato")

    def update(self, instance, validated_data):
        instance.stato = validated_data["stato"]
        instance.save(update_fields=["stato"])
        return instance

    def to_representation(self, instance):
        return WorkOrderSerializer(instance).data


class WorkOrderItemSerializer(NullToEmptyMixin):
    """
    A work order line (`item_lavorazioni`) shown in the detail view. The product
    and amount columns are read from the linked quote line (`item_preventivi`,
    attached by the view as `quote_item`); `status`, `production` and the date
    columns are this line's own. Values follow the all-strings contract.
    """

    id = serializers.CharField()

    # Joined from the linked item_preventivi row (may be absent).
    productId = serializers.SerializerMethodField()
    quantity = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    amount = serializers.SerializerMethodField()
    discount = serializers.SerializerMethodField()

    # This line's own columns.
    status = serializers.CharField(source="stato")
    production = serializers.CharField(source="produzione")
    cancellationDate = serializers.DateField(source="data_annullamento")
    orderDate = serializers.DateField(source="data_ordine")
    partialDeliveryDate = serializers.DateField(source="data_consegna_parziale")
    deliveryDate = serializers.DateField(source="data_consegna")

    @staticmethod
    def _quote_value(item, attr):
        quote_item = getattr(item, "quote_item", None)
        value = getattr(quote_item, attr, None) if quote_item is not None else None
        return None if value is None else str(value)

    def get_productId(self, item):
        return self._quote_value(item, "codice_nomenclatore")

    def get_quantity(self, item):
        return self._quote_value(item, "quantita")

    def get_price(self, item):
        return self._quote_value(item, "prezzo")

    def get_amount(self, item):
        return self._quote_value(item, "importo")

    def get_discount(self, item):
        return self._quote_value(item, "sconto")


class WorkOrderItemUpdateSerializer(UpdateFieldsSerializer):
    """
    Editable fields of a work order line. `status`/`production` are restricted to
    their sets; `orderDate`/`partialDeliveryDate` are free. The two conditional
    dates track the status: `cancellationDate` exists exactly when the status is
    ANNULLATO and `deliveryDate` exactly when it is CONSEGNATO (required for that
    status, forbidden otherwise). PATCH persists only the fields sent.
    """

    # Statuses that gate the conditional dates.
    CANCELLED = "ANNULLATO"
    DELIVERED = "CONSEGNATO"

    status = serializers.ChoiceField(
        choices=WorkOrderItem.STATUSES, source="stato", required=False, allow_blank=True
    )
    production = serializers.ChoiceField(
        choices=WorkOrderItem.PRODUCTIONS, source="produzione", required=False, allow_blank=True
    )
    cancellationDate = serializers.DateField(
        source="data_annullamento", required=False, allow_null=True
    )
    orderDate = serializers.DateField(source="data_ordine", required=False, allow_null=True)
    partialDeliveryDate = serializers.DateField(
        source="data_consegna_parziale", required=False, allow_null=True
    )
    deliveryDate = serializers.DateField(source="data_consegna", required=False, allow_null=True)

    def validate(self, attrs):
        # Effective values after the patch, so the rule holds for the result.
        instance = self.instance
        status = attrs.get("stato", getattr(instance, "stato", None))

        # Only check a conditional date when the status or that date is touched,
        # so editing unrelated fields never trips on pre-existing legacy data.
        if "stato" in attrs or "data_annullamento" in attrs:
            cancellation = attrs.get("data_annullamento", getattr(instance, "data_annullamento", None))
            if status == self.CANCELLED and cancellation is None:
                raise serializers.ValidationError(
                    {"cancellationDate": "Obbligatoria quando lo stato è ANNULLATO."}
                )
            if status != self.CANCELLED and cancellation is not None:
                raise serializers.ValidationError(
                    {"cancellationDate": "Ammessa solo quando lo stato è ANNULLATO."}
                )

        if "stato" in attrs or "data_consegna" in attrs:
            delivery = attrs.get("data_consegna", getattr(instance, "data_consegna", None))
            if status == self.DELIVERED and delivery is None:
                raise serializers.ValidationError(
                    {"deliveryDate": "Obbligatoria quando lo stato è CONSEGNATO."}
                )
            if status != self.DELIVERED and delivery is not None:
                raise serializers.ValidationError(
                    {"deliveryDate": "Ammessa solo quando lo stato è CONSEGNATO."}
                )

        return attrs
