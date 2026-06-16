"""
Serializers for the Quote resource backed by `preventivi`.

Field names are the camelCase keys the frontend consumes directly. The list and
detail views expose the full column set, so a single read serializer serves
both; `NullToEmptyMixin` renders SQL NULLs as empty strings and dates/numbers as
plain strings, keeping the frontend's all-strings contract.
"""
from rest_framework import serializers

from apps.common.api.serializers import (
    CreatableSerializerMixin,
    NullToEmptyMixin,
    UpdateFieldsSerializer,
    nullable_text,
)
from apps.quotes.models import Quote
from apps.quotes.services import create_quote_item


class QuoteSerializer(NullToEmptyMixin):
    """Full column set shown in both the Preventivi table and detail view."""

    id = serializers.CharField()

    # Links
    clientId = serializers.CharField(source="id_cliente")
    doctorId = serializers.CharField(source="id_medico")

    # Quote identity
    quoteNumber = serializers.CharField(source="numero_preventivo")
    quoteType = serializers.CharField(source="tipologia_preventivo")
    status = serializers.CharField(source="stato")
    creationDate = serializers.DateField(source="data_creazione")
    quoteDate = serializers.DateField(source="data_preventivo")
    total = serializers.CharField(source="totale")
    entryBy = serializers.CharField(source="entry_by")

    # Clinical data
    diagnosis = serializers.CharField(source="diagnosi_circostanziata")
    therapeuticProgram = serializers.CharField(source="programma_terapeutico")
    detailedPrescription = serializers.CharField(source="prescizione_dettagliata_protesi")

    # Authorization & deadlines
    authorizationNumber = serializers.CharField(source="numero_autorizzazione")
    acceptanceDate = serializers.DateField(source="data_accettazione")
    authorizationReceiptDate = serializers.DateField(source="data_ricezione_autorizzazione")
    expiryDays = serializers.CharField(source="giorni_scadenza")
    maxExpiry = serializers.CharField(source="massima_scadenza")

    # Supply & invoicing
    measurementsOk = serializers.CharField(source="misure_ok")
    commissionsPaid = serializers.CharField(source="provvigioni_pagate")
    orderNumber = serializers.CharField(source="numero_ordine")
    model = serializers.CharField(source="modello")
    measurements = serializers.CharField(source="misure")
    invoiceNumber = serializers.CharField(source="numero_fattura")

    # Free text
    quote = serializers.CharField(source="preventivo")
    note = serializers.CharField()
    privateNote = serializers.CharField(source="note_private")
    finalNote = serializers.CharField(source="note_finali")


class QuoteItemSerializer(NullToEmptyMixin):
    """
    Read-only line item shown in the quote detail's items box. Exposes only the
    columns the view renders; `productId` is the raw `codice_nomenclatore`
    reference (a `nomenclatore.id`) and `productDescription` is that product's
    `descrizione`, read from the row attached by the view (absent for a product
    that no longer exists). Values follow the all-strings contract.
    """

    id = serializers.CharField()
    productId = serializers.CharField(source="codice_nomenclatore")
    productDescription = serializers.SerializerMethodField()
    quantity = serializers.CharField(source="quantita")
    price = serializers.CharField(source="prezzo")
    amount = serializers.CharField(source="importo")
    discount = serializers.CharField(source="sconto")

    def get_productDescription(self, item):
        product = getattr(item, "product", None)
        return product.descrizione if product is not None else None


class QuoteItemCreateSerializer(serializers.Serializer):
    """
    Create a line item for a quote. Only the client-controlled inputs are
    accepted: the product reference (required) plus the line's quantity and
    discount. `prezzo` and `importo` are derived from the product by
    `create_quote_item`, and the parent `id_preventivo` is injected by the view —
    none of the three is trusted from the client. The created row is rendered back
    with `QuoteItemSerializer` for the all-strings contract.
    """

    productId = serializers.IntegerField(source="product_id")
    quantity = serializers.FloatField(allow_null=True, default=None, min_value=0)
    discount = serializers.FloatField(allow_null=True, default=None)

    def create(self, validated_data):
        return create_quote_item(**validated_data)

    def to_representation(self, instance):
        return QuoteItemSerializer(instance).data


class QuoteUpdateSerializer(UpdateFieldsSerializer):
    """
    Writable serializer for editing a quote. Every field is optional so PATCH
    sends only what changed. `clientId` is required-on-the-row and therefore not
    nullable; everything else may be cleared.
    """

    # Links
    clientId = serializers.IntegerField(source="id_cliente", required=False)
    doctorId = serializers.IntegerField(source="id_medico", required=False, allow_null=True)

    # Quote identity
    # `status` is intentionally not writable here: it changes only through the
    # guarded transition endpoint, which enforces the `stato_check` rules.
    quoteNumber = nullable_text("numero_preventivo")
    quoteType = nullable_text("tipologia_preventivo")
    creationDate = serializers.DateField(source="data_creazione", required=False, allow_null=True)
    quoteDate = serializers.DateField(source="data_preventivo", required=False, allow_null=True)
    total = serializers.FloatField(source="totale", required=False, allow_null=True)
    entryBy = nullable_text("entry_by")

    # Clinical data
    diagnosis = nullable_text("diagnosi_circostanziata")
    therapeuticProgram = nullable_text("programma_terapeutico")
    detailedPrescription = nullable_text("prescizione_dettagliata_protesi")

    # Authorization & deadlines
    authorizationNumber = nullable_text("numero_autorizzazione")
    acceptanceDate = serializers.DateField(source="data_accettazione", required=False, allow_null=True)
    authorizationReceiptDate = serializers.DateField(
        source="data_ricezione_autorizzazione", required=False, allow_null=True
    )
    expiryDays = nullable_text("giorni_scadenza")
    maxExpiry = nullable_text("massima_scadenza")

    # Supply & invoicing
    measurementsOk = nullable_text("misure_ok")
    commissionsPaid = nullable_text("provvigioni_pagate")
    orderNumber = nullable_text("numero_ordine")
    model = nullable_text("modello")
    measurements = nullable_text("misure")
    invoiceNumber = nullable_text("numero_fattura")

    # Free text
    quote = nullable_text("preventivo")
    note = nullable_text()
    privateNote = nullable_text("note_private")
    finalNote = nullable_text("note_finali")


class QuoteCreateSerializer(CreatableSerializerMixin, QuoteUpdateSerializer):
    """
    Create a quote, reusing the update serializer's writable fields.

    Status is not client-controllable: `QuoteUpdateSerializer` already omits it,
    and every new quote is forced to start as INSERITO here. The database assigns
    the id; required-field enforcement lives in the frontend form, so the
    remaining fields stay optional (consistent with the other create serializers).
    """

    create_model = Quote
    read_serializer_class = QuoteSerializer

    # New quotes always start in this state; the column is never client-set.
    INITIAL_STATUS = "INSERITO"

    def create(self, validated_data):
        validated_data["stato"] = self.INITIAL_STATUS
        return super().create(validated_data)


class QuoteStatusRequestSerializer(serializers.Serializer):
    """Validates the body of a status-change request (the target state name)."""

    status = serializers.CharField()
