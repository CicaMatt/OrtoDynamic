"""
Read serializers for the Client resource.

Field names deliberately match the frontend's `Client` shape (camelCase) so the
React layer consumes the API directly with no transform step. Because the
underlying columns are nullable, `NullToEmptyMixin` renders SQL NULLs as empty
strings — the frontend treats every field as a plain string.
"""
from rest_framework import serializers

from apps.common.api.serializers import (
    NullToEmptyMixin,
    UpdateFieldsSerializer,
    nullable_text,
)

from apps.clients.models import Client


class ClientListSerializer(NullToEmptyMixin):
    """Columns shown in the Clienti table."""

    code = serializers.CharField(source="id")
    name = serializers.CharField(source="nome")
    surname = serializers.CharField(source="cognome")
    fiscalCode = serializers.CharField(source="codice_fiscale")
    birthDate = serializers.DateField(source="data_nascita")
    birthMunicipality = serializers.CharField(source="comune_nascita")
    address = serializers.CharField(source="indirizzo")
    city = serializers.CharField(source="citta")
    province = serializers.CharField(source="provincia")
    phone = serializers.CharField(source="telefono")


class ClientDetailSerializer(NullToEmptyMixin):
    """Full set of fields shown in the client detail view."""

    code = serializers.CharField(source="id")
    name = serializers.CharField(source="nome")
    surname = serializers.CharField(source="cognome")
    fiscalCode = serializers.CharField(source="codice_fiscale")
    phone = serializers.CharField(source="telefono")
    mobile = serializers.CharField(source="cellulare")
    email = serializers.CharField()
    birthDate = serializers.DateField(source="data_nascita")
    gender = serializers.CharField(source="sesso")
    birthMunicipality = serializers.CharField(source="comune_nascita")
    address = serializers.CharField(source="indirizzo")
    city = serializers.CharField(source="citta")
    province = serializers.CharField(source="provincia")
    postalCode = serializers.CharField(source="cap")
    country = serializers.CharField(source="nazione")
    district = serializers.CharField(source="distretto_appartenenza")
    doctorId = serializers.CharField(source="id_medico")
    note = serializers.CharField()


class ClientOrthopedicSerializer(NullToEmptyMixin):
    """Orthopedic measurements and specifications shown in the Dati Ortopedici view."""

    code = serializers.CharField(source="id")
    name = serializers.CharField(source="nome")
    surname = serializers.CharField(source="cognome")

    # Footwear / insole
    shoeSize = serializers.CharField(source="misura_scarpa")
    shoeModel = serializers.CharField(source="modello_scarpa")
    width = serializers.CharField(source="pianta")
    collar = serializers.CharField(source="collo")
    ankle = serializers.CharField(source="caviglia")
    spur = serializers.CharField(source="speronatura")
    lift = serializers.CharField(source="rialzo")
    inclinedPlane = serializers.CharField(source="piano_incl_tot")
    insoleType = serializers.CharField(source="tipo_plantare")
    collarPassage = serializers.CharField(source="passaggio_collo")
    anklePassage = serializers.CharField(source="passaggio_caviglie")

    # Brace / frame
    braceType = serializers.CharField(source="tipo_tutore")
    shoulderStraps = serializers.CharField(source="spallacci")
    upToArmpit = serializers.CharField(source="fino_ascella")
    frontFabricHeight = serializers.CharField(source="alt_stoffa_ant")
    totalFrameHeight = serializers.CharField(source="alt_tot_armatura")
    axillaryDistance = serializers.CharField(source="dist_ascellare")

    # Body measurements
    waist = serializers.CharField(source="misura_vita")
    pelvisSize = serializers.CharField(source="misura_bacino")
    measure24 = serializers.CharField(source="misura_2_4")
    neck = serializers.CharField(source="mis_collo")
    humerus = serializers.CharField(source="mis_omero")
    arm = serializers.CharField(source="mis_braccio")
    wrist = serializers.CharField(source="mis_polso")
    pelvis = serializers.CharField(source="mis_bacino")
    thigh = serializers.CharField(source="mis_coscia")
    leg = serializers.CharField(source="mis_gamba")

    # Notes
    clientNote = serializers.CharField(source="note_cliente")
    other = serializers.CharField(source="altro")


class ClientUpdateSerializer(UpdateFieldsSerializer):
    """
    Writable serializer for editing a client (anagrafica + orthopedic fields).

    Every field is optional so PATCH can send only what changed. Field names are
    the camelCase keys used by the frontend; `source` maps each to its column.
    The client id is intentionally not writable.
    """

    # Anagrafica
    name = nullable_text("nome")
    surname = nullable_text("cognome")
    fiscalCode = nullable_text("codice_fiscale")
    gender = nullable_text("sesso")
    birthMunicipality = nullable_text("comune_nascita")
    birthDate = serializers.DateField(source="data_nascita", required=False, allow_null=True)
    address = nullable_text("indirizzo")
    city = nullable_text("citta")
    postalCode = nullable_text("cap")
    country = nullable_text("nazione")
    phone = nullable_text("telefono")
    mobile = nullable_text("cellulare")
    email = nullable_text()
    district = nullable_text("distretto_appartenenza")
    doctorId = serializers.IntegerField(source="id_medico", required=False, allow_null=True)
    note = nullable_text()

    # Orthopedic — footwear / insole
    shoeSize = nullable_text("misura_scarpa")
    shoeModel = nullable_text("modello_scarpa")
    width = nullable_text("pianta")
    collar = nullable_text("collo")
    ankle = nullable_text("caviglia")
    spur = nullable_text("speronatura")
    lift = nullable_text("rialzo")
    inclinedPlane = nullable_text("piano_incl_tot")
    insoleType = nullable_text("tipo_plantare")
    collarPassage = nullable_text("passaggio_collo")
    anklePassage = nullable_text("passaggio_caviglie")

    # Orthopedic — brace / frame
    braceType = nullable_text("tipo_tutore")
    shoulderStraps = nullable_text("spallacci")
    upToArmpit = nullable_text("fino_ascella")
    frontFabricHeight = nullable_text("alt_stoffa_ant")
    totalFrameHeight = nullable_text("alt_tot_armatura")
    axillaryDistance = nullable_text("dist_ascellare")

    # Orthopedic — body measurements
    waist = nullable_text("misura_vita")
    pelvisSize = nullable_text("misura_bacino")
    measure24 = nullable_text("misura_2_4")
    neck = nullable_text("mis_collo")
    humerus = nullable_text("mis_omero")
    arm = nullable_text("mis_braccio")
    wrist = nullable_text("mis_polso")
    pelvis = nullable_text("mis_bacino")
    thigh = nullable_text("mis_coscia")
    leg = nullable_text("mis_gamba")

    # Orthopedic — notes
    clientNote = nullable_text("note_cliente")
    other = nullable_text("altro")
