"""
Read serializers for the Client resource.

Field names deliberately match the frontend's `Client` shape (camelCase) so the
React layer consumes the API directly with no transform step. Because the
underlying columns are nullable, `NullToEmptyMixin` renders SQL NULLs as empty
strings — the frontend treats every field as a plain string.
"""
from rest_framework import serializers

from apps.common.api.serializers import (
    CreatableSerializerMixin,
    NullToEmptyMixin,
    UpdateFieldsSerializer,
    nullable_text_fields,
    read_fields,
)

from apps.clients.models import Client


class ClientListSerializer(NullToEmptyMixin):
    """Columns shown in the Clienti table."""

    locals().update(read_fields({
        "idClient": "id",
        "name": "nome",
        "surname": "cognome",
        "fiscalCode": "codice_fiscale",
    }))
    birthDate = serializers.DateField(source="data_nascita")
    locals().update(read_fields({
        "birthMunicipality": "comune_nascita",
        "address": "indirizzo",
        "city": "citta",
        "province": "provincia",
        "phone": "telefono",
    }))


class ClientDetailSerializer(NullToEmptyMixin):
    """Full set of fields shown in the client detail view."""

    locals().update(read_fields({
        "idClient": "id",
        "name": "nome",
        "surname": "cognome",
        "fiscalCode": "codice_fiscale",
        "phone": "telefono",
        "mobile": "cellulare",
        "email": "email",
    }))
    birthDate = serializers.DateField(source="data_nascita")
    locals().update(read_fields({
        "gender": "sesso",
        "birthMunicipality": "comune_nascita",
        "address": "indirizzo",
        "city": "citta",
        "province": "provincia",
        "postalCode": "cap",
        "country": "nazione",
        "district": "distretto_appartenenza",
        "doctorId": "id_medico",
        "note": "note",
    }))


class ClientOrthopedicSerializer(NullToEmptyMixin):
    """Orthopedic measurements and specifications shown in the Dati Ortopedici view."""

    locals().update(read_fields({
        "idClient": "id",
        "name": "nome",
        "surname": "cognome",
        # Footwear / insole
        "shoeSize": "misura_scarpa",
        "shoeModel": "modello_scarpa",
        "width": "pianta",
        "collar": "collo",
        "ankle": "caviglia",
        "spur": "speronatura",
        "lift": "rialzo",
        "inclinedPlane": "piano_incl_tot",
        "insoleType": "tipo_plantare",
        "collarPassage": "passaggio_collo",
        "anklePassage": "passaggio_caviglie",
        # Brace / frame
        "braceType": "tipo_tutore",
        "shoulderStraps": "spallacci",
        "upToArmpit": "fino_ascella",
        "frontFabricHeight": "alt_stoffa_ant",
        "totalFrameHeight": "alt_tot_armatura",
        "axillaryDistance": "dist_ascellare",
        # Body measurements
        "waist": "misura_vita",
        "pelvisSize": "misura_bacino",
        "measure24": "misura_2_4",
        "neck": "mis_collo",
        "humerus": "mis_omero",
        "arm": "mis_braccio",
        "wrist": "mis_polso",
        "pelvis": "mis_bacino",
        "thigh": "mis_coscia",
        "leg": "mis_gamba",
        # Notes
        "clientNote": "note_cliente",
        "other": "altro",
    }))


class ClientUpdateSerializer(UpdateFieldsSerializer):
    """
    Writable serializer for editing a client (anagrafica + orthopedic fields).

    Every field is optional so PATCH can send only what changed. Field names are
    the camelCase keys used by the frontend; `source` maps each to its column.
    The client id is intentionally not writable.
    """

    locals().update(nullable_text_fields({
        # Anagrafica
        "name": "nome",
        "surname": "cognome",
        "fiscalCode": "codice_fiscale",
        "gender": "sesso",
        "birthMunicipality": "comune_nascita",
    }))
    birthDate = serializers.DateField(source="data_nascita", required=False, allow_null=True)
    locals().update(nullable_text_fields({
        "address": "indirizzo",
        "city": "citta",
        "province": "provincia",
        "postalCode": "cap",
        "country": "nazione",
        "phone": "telefono",
        "mobile": "cellulare",
        "email": None,
        "district": "distretto_appartenenza",
    }))
    doctorId = serializers.IntegerField(source="id_medico", required=False, allow_null=True)
    locals().update(nullable_text_fields({
        "note": None,
        # Orthopedic — footwear / insole
        "shoeSize": "misura_scarpa",
        "shoeModel": "modello_scarpa",
        "width": "pianta",
        "collar": "collo",
        "ankle": "caviglia",
        "spur": "speronatura",
        "lift": "rialzo",
        "inclinedPlane": "piano_incl_tot",
        "insoleType": "tipo_plantare",
        "collarPassage": "passaggio_collo",
        "anklePassage": "passaggio_caviglie",
        # Orthopedic — brace / frame
        "braceType": "tipo_tutore",
        "shoulderStraps": "spallacci",
        "upToArmpit": "fino_ascella",
        "frontFabricHeight": "alt_stoffa_ant",
        "totalFrameHeight": "alt_tot_armatura",
        "axillaryDistance": "dist_ascellare",
        # Orthopedic — body measurements
        "waist": "misura_vita",
        "pelvisSize": "misura_bacino",
        "measure24": "misura_2_4",
        "neck": "mis_collo",
        "humerus": "mis_omero",
        "arm": "mis_braccio",
        "wrist": "mis_polso",
        "pelvis": "mis_bacino",
        "thigh": "mis_coscia",
        "leg": "mis_gamba",
        # Orthopedic — notes
        "clientNote": "note_cliente",
        "other": "altro",
    }))


class ClientCreateSerializer(CreatableSerializerMixin, ClientUpdateSerializer):
    """
    Create a client. Reuses every writable field from the update serializer; the
    database assigns the id (AUTO_INCREMENT). The create screen asks for a complete
    demographic record as UX policy, while the permissive legacy table supports
    incomplete records, so the backend deliberately keeps these fields optional.
    """

    create_model = Client
    read_serializer_class = ClientDetailSerializer
