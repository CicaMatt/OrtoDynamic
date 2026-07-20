"""
Serializers for the Quote resource backed by `preventivi`.

Field names are the camelCase keys the frontend consumes directly. The list and
detail views expose the full column set, so a single read serializer serves
both; `NullToEmptyMixin` renders SQL NULLs as empty strings and dates/numbers as
plain strings, keeping the frontend's all-strings contract.
"""
from django.db import transaction
from rest_framework import serializers

from apps.common.api.serializers import (
    CreatableSerializerMixin,
    NullToEmptyMixin,
    UpdateFieldsSerializer,
    nullable_text_fields,
    person_display_name,
    read_fields,
)
from apps.quotes.models import Quote
from apps.quotes.services import (
    create_quote_item,
    recompute_quote_total,
    update_quote_item,
)


class QuoteSerializer(NullToEmptyMixin):
    """Full column set shown in both the Preventivi table and detail view."""

    locals().update(read_fields({
        "idQuote": "id",
        # Links
        "clientId": "id_cliente",
        "doctorId": "id_medico",
    }))
    # Display names for the linked client/doctor, resolved from the objects the
    # view attaches in bulk (empty when the reference is unset or the row is gone).
    # The frontend shows these in place of the raw ids, revealing the id on hover.
    clientName = serializers.SerializerMethodField()
    clientCity = serializers.SerializerMethodField()
    doctorName = serializers.SerializerMethodField()
    workOrderId = serializers.SerializerMethodField()

    locals().update(read_fields({
        # Quote identity
        "quoteNumber": "numero_preventivo",
        "quoteType": "tipologia_preventivo",
        "status": "stato",
    }))
    creationDate = serializers.DateField(source="data_creazione")
    quoteDate = serializers.DateField(source="data_preventivo")
    locals().update(read_fields({
        "total": "totale",
        "entryBy": "entry_by",
        # Clinical data
        "diagnosis": "diagnosi_circostanziata",
        "therapeuticProgram": "programma_terapeutico",
        "detailedPrescription": "prescizione_dettagliata_protesi",
        # Authorization & deadlines
        "authorizationNumber": "numero_autorizzazione",
    }))
    acceptanceDate = serializers.DateField(source="data_accettazione")
    authorizationReceiptDate = serializers.DateField(source="data_ricezione_autorizzazione")
    locals().update(read_fields({
        "expiryDays": "giorni_scadenza",
        "maxExpiry": "massima_scadenza",
        # Supply & invoicing
        "measurementsOk": "misure_ok",
        "commissionsPaid": "provvigioni_pagate",
        "orderNumber": "numero_ordine",
        "model": "modello",
        "measurements": "misure",
        "invoiceNumber": "numero_fattura",
        # Free text
        "quote": "preventivo",
        "note": "note",
        "privateNote": "note_private",
        "finalNote": "note_finali",
    }))

    def get_clientName(self, quote):
        return person_display_name(getattr(quote, "client", None))

    def get_clientCity(self, quote):
        client = getattr(quote, "client", None)
        return client.citta if client is not None else None

    def get_doctorName(self, quote):
        return person_display_name(getattr(quote, "doctor", None))

    def get_workOrderId(self, quote):
        work_order = getattr(quote, "work_order", None)
        return str(work_order.id) if work_order is not None else None


class QuoteItemSerializer(NullToEmptyMixin):
    """
    Read-only line item shown in the quote detail's items box. Exposes only the
    columns the view renders; `productId` is the raw `codice_nomenclatore`
    reference (a `nomenclatore.id`), while `productCode` and `productDescription`
    are that product's `codice`/`descrizione`, read from the row attached by the
    view (absent for a product that no longer exists). Values follow the
    all-strings contract.
    """

    locals().update(read_fields({
        "id": "id",
        "productId": "codice_nomenclatore",
    }))
    productCode = serializers.SerializerMethodField()
    productDescription = serializers.SerializerMethodField()
    locals().update(read_fields({
        "quantity": "quantita",
        "price": "prezzo",
        "amount": "importo",
        "discount": "sconto",
    }))

    def get_productCode(self, item):
        product = getattr(item, "product", None)
        return product.codice if product is not None else None

    def get_productDescription(self, item):
        product = getattr(item, "product", None)
        return product.descrizione if product is not None else None


class QuoteItemCreateSerializer(serializers.Serializer):
    """
    Create a line item for a quote. Only the client-controlled inputs are
    accepted: the product reference (required) plus the line's quantity and
    discount (a 1–100 percentage, or null for none). `prezzo` and `importo` are
    derived from the product by `create_quote_item`, and the parent
    `id_preventivo` is injected by the caller — none of the three is trusted from
    the client. Used both standalone (the items endpoint) and nested under
    `QuoteCreateSerializer`. The created row is rendered back with
    `QuoteItemSerializer` for the all-strings contract.
    """

    productId = serializers.IntegerField(source="product_id")
    quantity = serializers.FloatField(default=1, min_value=1)
    discount = serializers.FloatField(allow_null=True, default=None, min_value=1, max_value=100)

    def create(self, validated_data):
        return create_quote_item(**validated_data)

    def to_representation(self, instance):
        return QuoteItemSerializer(instance).data


class QuoteItemUpdateSerializer(serializers.Serializer):
    """
    Edit an existing line's quantity and discount. The product and its `prezzo`
    are fixed, and `importo` is recomputed by `update_quote_item`, so none of
    those is accepted here. Both inputs are optional for PATCH; an omitted field
    keeps the line's current value. `discount` is a 1–100 percentage (or null to
    clear it). The updated row is rendered with `QuoteItemSerializer`.
    """

    quantity = serializers.FloatField(source="quantita", required=False, min_value=1)
    discount = serializers.FloatField(
        source="sconto", required=False, allow_null=True, min_value=1, max_value=100
    )

    def update(self, instance, validated_data):
        quantity = validated_data.get("quantita", instance.quantita)
        discount = validated_data.get("sconto", instance.sconto)
        return update_quote_item(quote_item=instance, quantity=quantity, discount=discount)

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
    locals().update(nullable_text_fields({
        "quoteNumber": "numero_preventivo",
        "quoteType": "tipologia_preventivo",
    }))
    creationDate = serializers.DateField(source="data_creazione", required=False, allow_null=True)
    quoteDate = serializers.DateField(source="data_preventivo", required=False, allow_null=True)
    # `total` (totale) is intentionally not writable: it is always derived from the
    # sum of the quote's line items' importi (see `recompute_quote_total`), kept in
    # sync whenever those items change, and never set directly by the client.
    locals().update(nullable_text_fields({
        "entryBy": "entry_by",
        # Clinical data
        "diagnosis": "diagnosi_circostanziata",
        "therapeuticProgram": "programma_terapeutico",
        "detailedPrescription": "prescizione_dettagliata_protesi",
        # Authorization & deadlines
        "authorizationNumber": "numero_autorizzazione",
    }))
    acceptanceDate = serializers.DateField(source="data_accettazione", required=False, allow_null=True)
    authorizationReceiptDate = serializers.DateField(
        source="data_ricezione_autorizzazione", required=False, allow_null=True
    )
    locals().update(nullable_text_fields({
        "expiryDays": "giorni_scadenza",
        "maxExpiry": "massima_scadenza",
        # Supply & invoicing
        "measurementsOk": "misure_ok",
        "commissionsPaid": "provvigioni_pagate",
        "orderNumber": "numero_ordine",
        "model": "modello",
        "measurements": "misure",
        "invoiceNumber": "numero_fattura",
        # Free text
        "quote": "preventivo",
        "note": None,
        "privateNote": "note_private",
        "finalNote": "note_finali",
    }))


class QuoteCreateSerializer(CreatableSerializerMixin, QuoteUpdateSerializer):
    """
    Create a quote, reusing the update serializer's writable fields, optionally
    with its initial line items in the same request.

    Status is not client-controllable: `QuoteUpdateSerializer` already omits it,
    and every new quote is forced to start as INSERITO here. The database assigns
    the id; required-field enforcement lives in the frontend form, so the
    remaining fields stay optional (consistent with the other create serializers).
    The quote and its `items` are inserted in one transaction, so a failure on any
    line rolls back the whole create rather than leaving a quote with no lines.
    """

    create_model = Quote
    read_serializer_class = QuoteSerializer

    # New quotes always start in this state; the column is never client-set.
    INITIAL_STATUS = "INSERITO"

    # Optional line items, created together with the quote. Write-only: the
    # response renders the quote alone (the detail view loads its items).
    items = QuoteItemCreateSerializer(many=True, required=False, write_only=True)

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        validated_data["stato"] = self.INITIAL_STATUS
        with transaction.atomic():
            quote = super().create(validated_data)
            for item_data in items_data:
                create_quote_item(quote_id=quote.id, **item_data)
            # Each create_quote_item already derived the running total; a quote with
            # no lines still needs its total initialised to 0.
            if not items_data:
                recompute_quote_total(quote.id)
        return quote


class QuoteStatusRequestSerializer(serializers.Serializer):
    """Validates a status-change request: the target state and an optional private note."""

    status = serializers.CharField()
    # Optional private note recorded with the change (the legacy `state_note`).
    note = serializers.CharField(required=False, allow_blank=True, allow_null=True)
