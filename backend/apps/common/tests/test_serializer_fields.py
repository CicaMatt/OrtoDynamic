"""Characterize public serializer fields before making declarations explicit."""

from types import SimpleNamespace

import pytest
from rest_framework import serializers

from apps.accounts.api.serializers import EmployeeSerializer, UserSerializer
from apps.clients.api.serializers import (
    ClientDetailSerializer,
    ClientListSerializer,
    ClientOrthopedicSerializer,
    ClientUpdateSerializer,
)
from apps.common.api.serializers import (
    NullToEmptySerializer,
    nullable_text,
    optional_text,
)
from apps.doctors.api.serializers import (
    DoctorDetailSerializer,
    DoctorListSerializer,
    DoctorUpdateSerializer,
)
from apps.health_companies.api.serializers import (
    HealthCompanyDetailSerializer,
    HealthCompanyListSerializer,
    HealthCompanyUpdateSerializer,
)
from apps.products.api.serializers import ProductSerializer, ProductUpdateSerializer
from apps.quotes.api.serializers import (
    QuoteItemSerializer,
    QuoteSerializer,
    QuoteUpdateSerializer,
)
from apps.work_orders.api.serializers import (
    WorkOrderItemSerializer,
    WorkOrderSerializer,
    WorkOrderUpdateSerializer,
)


def fields(*items):
    """Compact expected `(public name, source, DRF field class)` table."""
    return list(items)


SERIALIZER_FIELDS = [
    (
        UserSerializer,
        fields(
            ("id", "id", "CharField"),
            ("username", "username", "CharField"),
            ("email", "email", "CharField"),
            ("firstName", "first_name", "CharField"),
            ("lastName", "last_name", "CharField"),
        ),
    ),
    (
        EmployeeSerializer,
        fields(
            ("username", "username", "CharField"),
            ("email", "email", "CharField"),
            ("firstName", "first_name", "CharField"),
            ("lastName", "last_name", "CharField"),
            ("idEmployee", "id", "CharField"),
        ),
    ),
    (
        ProductSerializer,
        fields(
            ("idProduct", "id", "CharField"),
            ("code", "codice", "CharField"),
            ("description", "descrizione", "CharField"),
            ("price", "prezzo", "CharField"),
            ("year", "anno", "CharField"),
        ),
    ),
    (
        ProductUpdateSerializer,
        fields(
            ("code", "codice", "CharField"),
            ("description", "descrizione", "CharField"),
            ("price", "prezzo", "FloatField"),
            ("year", "anno", "CharField"),
        ),
    ),
    (
        DoctorListSerializer,
        fields(
            ("idDoctor", "id", "CharField"),
            ("surname", "cognome", "CharField"),
            ("name", "nome", "CharField"),
            ("address", "indirizzo", "CharField"),
            ("phone", "telefono", "CharField"),
            ("email", "mail", "CharField"),
        ),
    ),
    (
        DoctorDetailSerializer,
        fields(
            ("idDoctor", "id", "CharField"),
            ("surname", "cognome", "CharField"),
            ("name", "nome", "CharField"),
            ("address", "indirizzo", "CharField"),
            ("phone", "telefono", "CharField"),
            ("email", "mail", "CharField"),
            ("note", "note", "CharField"),
        ),
    ),
    (
        DoctorUpdateSerializer,
        fields(
            ("surname", "cognome", "CharField"),
            ("name", "nome", "CharField"),
            ("address", "indirizzo", "CharField"),
            ("phone", "telefono", "CharField"),
            ("email", "mail", "CharField"),
            ("note", "note", "CharField"),
        ),
    ),
    (
        HealthCompanyListSerializer,
        fields(
            ("idHealthCompany", "id", "CharField"),
            ("municipalityCode", "codice_comune", "CharField"),
            ("municipality", "comune", "CharField"),
            ("regionCode", "codice_regione", "CharField"),
            ("regionName", "denominazione_regione", "CharField"),
            ("companyCode", "codice_azienda", "CharField"),
            ("companyName", "denominazione_azienda", "CharField"),
            ("year", "anno", "CharField"),
        ),
    ),
    (
        HealthCompanyDetailSerializer,
        fields(
            ("idHealthCompany", "id", "CharField"),
            ("municipalityCode", "codice_comune", "CharField"),
            ("municipality", "comune", "CharField"),
            ("regionCode", "codice_regione", "CharField"),
            ("regionName", "denominazione_regione", "CharField"),
            ("companyCode", "codice_azienda", "CharField"),
            ("companyName", "denominazione_azienda", "CharField"),
            ("year", "anno", "CharField"),
            ("males", "maschi", "CharField"),
            ("females", "femmine", "CharField"),
            ("total", "totale", "CharField"),
            ("district", "distretto", "CharField"),
        ),
    ),
    (
        HealthCompanyUpdateSerializer,
        fields(
            ("year", "anno", "IntegerField"),
            ("municipalityCode", "codice_comune", "CharField"),
            ("municipality", "comune", "CharField"),
            ("regionCode", "codice_regione", "CharField"),
            ("regionName", "denominazione_regione", "CharField"),
            ("companyCode", "codice_azienda", "CharField"),
            ("companyName", "denominazione_azienda", "CharField"),
            ("males", "maschi", "CharField"),
            ("females", "femmine", "CharField"),
            ("total", "totale", "CharField"),
            ("district", "distretto", "CharField"),
        ),
    ),
    (
        ClientListSerializer,
        fields(
            ("idClient", "id", "CharField"),
            ("name", "nome", "CharField"),
            ("surname", "cognome", "CharField"),
            ("fiscalCode", "codice_fiscale", "CharField"),
            ("birthDate", "data_nascita", "DateField"),
            ("birthMunicipality", "comune_nascita", "CharField"),
            ("address", "indirizzo", "CharField"),
            ("city", "citta", "CharField"),
            ("province", "provincia", "CharField"),
            ("phone", "telefono", "CharField"),
        ),
    ),
    (
        ClientDetailSerializer,
        fields(
            ("idClient", "id", "CharField"),
            ("name", "nome", "CharField"),
            ("surname", "cognome", "CharField"),
            ("fiscalCode", "codice_fiscale", "CharField"),
            ("phone", "telefono", "CharField"),
            ("mobile", "cellulare", "CharField"),
            ("email", "email", "CharField"),
            ("birthDate", "data_nascita", "DateField"),
            ("gender", "sesso", "CharField"),
            ("birthMunicipality", "comune_nascita", "CharField"),
            ("address", "indirizzo", "CharField"),
            ("city", "citta", "CharField"),
            ("province", "provincia", "CharField"),
            ("postalCode", "cap", "CharField"),
            ("country", "nazione", "CharField"),
            ("district", "distretto_appartenenza", "CharField"),
            ("doctorId", "id_medico", "CharField"),
            ("note", "note", "CharField"),
        ),
    ),
    (
        ClientOrthopedicSerializer,
        fields(
            ("idClient", "id", "CharField"),
            ("name", "nome", "CharField"),
            ("surname", "cognome", "CharField"),
            ("shoeSize", "misura_scarpa", "CharField"),
            ("shoeModel", "modello_scarpa", "CharField"),
            ("width", "pianta", "CharField"),
            ("collar", "collo", "CharField"),
            ("ankle", "caviglia", "CharField"),
            ("spur", "speronatura", "CharField"),
            ("lift", "rialzo", "CharField"),
            ("inclinedPlane", "piano_incl_tot", "CharField"),
            ("insoleType", "tipo_plantare", "CharField"),
            ("collarPassage", "passaggio_collo", "CharField"),
            ("anklePassage", "passaggio_caviglie", "CharField"),
            ("braceType", "tipo_tutore", "CharField"),
            ("shoulderStraps", "spallacci", "CharField"),
            ("upToArmpit", "fino_ascella", "CharField"),
            ("frontFabricHeight", "alt_stoffa_ant", "CharField"),
            ("totalFrameHeight", "alt_tot_armatura", "CharField"),
            ("axillaryDistance", "dist_ascellare", "CharField"),
            ("waist", "misura_vita", "CharField"),
            ("pelvisSize", "misura_bacino", "CharField"),
            ("measure24", "misura_2_4", "CharField"),
            ("neck", "mis_collo", "CharField"),
            ("humerus", "mis_omero", "CharField"),
            ("arm", "mis_braccio", "CharField"),
            ("wrist", "mis_polso", "CharField"),
            ("pelvis", "mis_bacino", "CharField"),
            ("thigh", "mis_coscia", "CharField"),
            ("leg", "mis_gamba", "CharField"),
            ("clientNote", "note_cliente", "CharField"),
            ("other", "altro", "CharField"),
        ),
    ),
    (
        ClientUpdateSerializer,
        fields(
            ("name", "nome", "CharField"),
            ("surname", "cognome", "CharField"),
            ("fiscalCode", "codice_fiscale", "CharField"),
            ("gender", "sesso", "CharField"),
            ("birthMunicipality", "comune_nascita", "CharField"),
            ("birthDate", "data_nascita", "DateField"),
            ("address", "indirizzo", "CharField"),
            ("city", "citta", "CharField"),
            ("province", "provincia", "CharField"),
            ("postalCode", "cap", "CharField"),
            ("country", "nazione", "CharField"),
            ("phone", "telefono", "CharField"),
            ("mobile", "cellulare", "CharField"),
            ("email", "email", "CharField"),
            ("district", "distretto_appartenenza", "CharField"),
            ("doctorId", "id_medico", "IntegerField"),
            ("note", "note", "CharField"),
            ("shoeSize", "misura_scarpa", "CharField"),
            ("shoeModel", "modello_scarpa", "CharField"),
            ("width", "pianta", "CharField"),
            ("collar", "collo", "CharField"),
            ("ankle", "caviglia", "CharField"),
            ("spur", "speronatura", "CharField"),
            ("lift", "rialzo", "CharField"),
            ("inclinedPlane", "piano_incl_tot", "CharField"),
            ("insoleType", "tipo_plantare", "CharField"),
            ("collarPassage", "passaggio_collo", "CharField"),
            ("anklePassage", "passaggio_caviglie", "CharField"),
            ("braceType", "tipo_tutore", "CharField"),
            ("shoulderStraps", "spallacci", "CharField"),
            ("upToArmpit", "fino_ascella", "CharField"),
            ("frontFabricHeight", "alt_stoffa_ant", "CharField"),
            ("totalFrameHeight", "alt_tot_armatura", "CharField"),
            ("axillaryDistance", "dist_ascellare", "CharField"),
            ("waist", "misura_vita", "CharField"),
            ("pelvisSize", "misura_bacino", "CharField"),
            ("measure24", "misura_2_4", "CharField"),
            ("neck", "mis_collo", "CharField"),
            ("humerus", "mis_omero", "CharField"),
            ("arm", "mis_braccio", "CharField"),
            ("wrist", "mis_polso", "CharField"),
            ("pelvis", "mis_bacino", "CharField"),
            ("thigh", "mis_coscia", "CharField"),
            ("leg", "mis_gamba", "CharField"),
            ("clientNote", "note_cliente", "CharField"),
            ("other", "altro", "CharField"),
        ),
    ),
    (
        QuoteSerializer,
        fields(
            ("idQuote", "id", "CharField"),
            ("clientId", "id_cliente", "CharField"),
            ("doctorId", "id_medico", "CharField"),
            ("clientName", "*", "SerializerMethodField"),
            ("clientCity", "*", "SerializerMethodField"),
            ("doctorName", "*", "SerializerMethodField"),
            ("workOrderId", "*", "SerializerMethodField"),
            ("quoteNumber", "numero_preventivo", "CharField"),
            ("quoteType", "tipologia_preventivo", "CharField"),
            ("status", "stato", "CharField"),
            ("creationDate", "data_creazione", "DateField"),
            ("quoteDate", "data_preventivo", "DateField"),
            ("total", "totale", "CharField"),
            ("entryBy", "entry_by", "CharField"),
            ("diagnosis", "diagnosi_circostanziata", "CharField"),
            ("therapeuticProgram", "programma_terapeutico", "CharField"),
            ("detailedPrescription", "prescizione_dettagliata_protesi", "CharField"),
            ("authorizationNumber", "numero_autorizzazione", "CharField"),
            ("acceptanceDate", "data_accettazione", "DateField"),
            ("authorizationReceiptDate", "data_ricezione_autorizzazione", "DateField"),
            ("expiryDays", "giorni_scadenza", "CharField"),
            ("maxExpiry", "massima_scadenza", "CharField"),
            ("measurementsOk", "misure_ok", "CharField"),
            ("commissionsPaid", "provvigioni_pagate", "CharField"),
            ("orderNumber", "numero_ordine", "CharField"),
            ("model", "modello", "CharField"),
            ("measurements", "misure", "CharField"),
            ("invoiceNumber", "numero_fattura", "CharField"),
            ("quote", "preventivo", "CharField"),
            ("note", "note", "CharField"),
            ("privateNote", "note_private", "CharField"),
            ("finalNote", "note_finali", "CharField"),
        ),
    ),
    (
        QuoteItemSerializer,
        fields(
            ("id", "id", "CharField"),
            ("productId", "codice_nomenclatore", "CharField"),
            ("productCode", "*", "SerializerMethodField"),
            ("productDescription", "*", "SerializerMethodField"),
            ("quantity", "quantita", "CharField"),
            ("price", "prezzo", "CharField"),
            ("amount", "importo", "CharField"),
            ("discount", "sconto", "CharField"),
        ),
    ),
    (
        QuoteUpdateSerializer,
        fields(
            ("clientId", "id_cliente", "IntegerField"),
            ("doctorId", "id_medico", "IntegerField"),
            ("quoteNumber", "numero_preventivo", "CharField"),
            ("quoteType", "tipologia_preventivo", "CharField"),
            ("creationDate", "data_creazione", "DateField"),
            ("quoteDate", "data_preventivo", "DateField"),
            ("entryBy", "entry_by", "CharField"),
            ("diagnosis", "diagnosi_circostanziata", "CharField"),
            ("therapeuticProgram", "programma_terapeutico", "CharField"),
            ("detailedPrescription", "prescizione_dettagliata_protesi", "CharField"),
            ("authorizationNumber", "numero_autorizzazione", "CharField"),
            ("acceptanceDate", "data_accettazione", "DateField"),
            ("authorizationReceiptDate", "data_ricezione_autorizzazione", "DateField"),
            ("expiryDays", "giorni_scadenza", "CharField"),
            ("measurementsOk", "misure_ok", "CharField"),
            ("commissionsPaid", "provvigioni_pagate", "CharField"),
            ("orderNumber", "numero_ordine", "CharField"),
            ("model", "modello", "CharField"),
            ("measurements", "misure", "CharField"),
            ("invoiceNumber", "numero_fattura", "CharField"),
            ("quote", "preventivo", "CharField"),
            ("note", "note", "CharField"),
            ("privateNote", "note_private", "CharField"),
            ("finalNote", "note_finali", "CharField"),
        ),
    ),
    (
        WorkOrderSerializer,
        fields(
            ("idWorkOrder", "id", "CharField"),
            ("quoteId", "id_preventivo", "CharField"),
            ("clientId", "id_cliente", "CharField"),
            ("clientName", "*", "SerializerMethodField"),
            ("quoteStatus", "*", "SerializerMethodField"),
            ("status", "stato", "CharField"),
            ("creationDate", "data_creazione_lavorazione", "DateField"),
            ("completionDate", "data_fine_lavorazione", "DateField"),
            ("deliveryDate", "data_consegna", "DateField"),
            ("cancellationDate", "data_annullamento", "DateField"),
            ("maxExpiry", "massima_scadenza", "CharField"),
            ("clientTrial", "prova_cliente", "CharField"),
            ("clientTrialOutcome", "pos_ril", "CharField"),
            ("clientTrialDate", "data_prova_cliente", "DateField"),
            ("clientCheck", "verifica_cliente", "CharField"),
            ("clientCheckOutcome", "verifica_pos_ril", "CharField"),
            ("clientCheckDate", "data_verifica_cliente", "DateField"),
            ("doctorSignature", "firma_medico", "CharField"),
            ("technicalService", "assistenza_tecnica", "CharField"),
            ("serviceStatus", "stato_lavorazione_assistenza", "CharField"),
            ("complaintReason", "ragione_reclamo", "CharField"),
            ("device", "presidio", "CharField"),
            ("warranty", "garanzia", "CharField"),
            ("serviceDeliveryDate", "data_consegna_assistenza", "DateField"),
            ("testOutcome", "esito_collaudo_assistenza_tecnica", "CharField"),
            ("testOutcomeDate", "data_esito_collaudo_assistenza", "DateField"),
            ("serviceDoctorSignature", "firma_medico_assistenza", "CharField"),
            ("technicianSignature", "firma_tecnico", "CharField"),
            ("interventionDescription", "descrizione_intervento", "CharField"),
            ("technicalNotes", "annotazioni_tecniche_assistenza", "CharField"),
        ),
    ),
    (
        WorkOrderItemSerializer,
        fields(
            ("id", "id", "CharField"),
            ("productId", "*", "SerializerMethodField"),
            ("productCode", "*", "SerializerMethodField"),
            ("productDescription", "*", "SerializerMethodField"),
            ("quantity", "*", "SerializerMethodField"),
            ("price", "*", "SerializerMethodField"),
            ("amount", "*", "SerializerMethodField"),
            ("discount", "*", "SerializerMethodField"),
            ("status", "stato", "CharField"),
            ("production", "produzione", "CharField"),
            ("cancellationDate", "data_annullamento", "DateField"),
            ("orderDate", "data_ordine", "DateField"),
            ("partialDeliveryDate", "data_consegna_parziale", "DateField"),
            ("deliveryDate", "data_consegna", "DateField"),
        ),
    ),
    (
        WorkOrderUpdateSerializer,
        fields(
            ("creationDate", "data_creazione_lavorazione", "DateField"),
            ("completionDate", "data_fine_lavorazione", "DateField"),
            ("deliveryDate", "data_consegna", "DateField"),
            ("cancellationDate", "data_annullamento", "DateField"),
            ("maxExpiry", "massima_scadenza", "CharField"),
            ("clientTrial", "prova_cliente", "CharField"),
            ("clientTrialOutcome", "pos_ril", "CharField"),
            ("clientTrialDate", "data_prova_cliente", "DateField"),
            ("clientCheck", "verifica_cliente", "CharField"),
            ("clientCheckOutcome", "verifica_pos_ril", "CharField"),
            ("clientCheckDate", "data_verifica_cliente", "DateField"),
            ("doctorSignature", "firma_medico", "CharField"),
            ("technicalService", "assistenza_tecnica", "CharField"),
            ("serviceStatus", "stato_lavorazione_assistenza", "CharField"),
            ("complaintReason", "ragione_reclamo", "CharField"),
            ("device", "presidio", "CharField"),
            ("warranty", "garanzia", "CharField"),
            ("serviceDeliveryDate", "data_consegna_assistenza", "DateField"),
            ("testOutcome", "esito_collaudo_assistenza_tecnica", "CharField"),
            ("testOutcomeDate", "data_esito_collaudo_assistenza", "DateField"),
            ("serviceDoctorSignature", "firma_medico_assistenza", "CharField"),
            ("technicianSignature", "firma_tecnico", "CharField"),
            ("interventionDescription", "descrizione_intervento", "CharField"),
            ("technicalNotes", "annotazioni_tecniche_assistenza", "CharField"),
        ),
    ),
]


@pytest.mark.parametrize(("serializer_class", "expected"), SERIALIZER_FIELDS)
def test_serializer_field_contract(serializer_class, expected):
    actual = [
        (name, field.source, type(field).__name__)
        for name, field in serializer_class().fields.items()
    ]
    assert actual == expected


def test_scalar_text_helpers_keep_their_validation_contract():
    optional = optional_text("legacy_column")
    nullable = nullable_text("legacy_column")

    assert optional.required is False
    assert optional.allow_blank is True
    assert optional.allow_null is False
    assert optional.source == "legacy_column"

    assert nullable.required is False
    assert nullable.allow_blank is True
    assert nullable.allow_null is True
    assert nullable.source == "legacy_column"


def test_read_base_keeps_null_and_whitespace_normalization():
    class ExampleSerializer(NullToEmptySerializer):
        missing = serializers.CharField()
        padded = serializers.CharField()
        count = serializers.IntegerField()

    data = ExampleSerializer(
        SimpleNamespace(missing=None, padded="  visible value  ", count=4)
    ).data

    assert data == {"missing": "", "padded": "visible value", "count": 4}
