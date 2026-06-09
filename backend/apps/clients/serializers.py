"""
Read serializers for the Client resource.

Field names deliberately match the frontend's `Client` shape (camelCase) so the
React layer consumes the API directly with no transform step. Because the
underlying columns are nullable, `NullToEmptyMixin` renders SQL NULLs as empty
strings — the frontend treats every field as a plain string.
"""
from rest_framework import serializers

from .models import Client


class NullToEmptyMixin(serializers.Serializer):
    """Render NULL fields as empty strings and trim stray whitespace.

    The legacy data carries leading/trailing spaces on many text columns;
    cleaning them at the API boundary keeps every consumer from re-implementing
    the same trimming.
    """

    @staticmethod
    def _clean(value):
        if value is None:
            return ""
        if isinstance(value, str):
            return value.strip()
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {key: self._clean(value) for key, value in data.items()}


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


def _text(source):
    """Optional, blank/null-tolerant text field bound to a column."""
    return serializers.CharField(source=source, required=False, allow_blank=True, allow_null=True)


class ClientUpdateSerializer(serializers.Serializer):
    """
    Writable serializer for editing a client (anagrafica + orthopedic fields).

    Every field is optional so PATCH can send only what changed. Field names are
    the camelCase keys used by the frontend; `source` maps each to its column.
    The client id is intentionally not writable.
    """

    # Anagrafica
    name = _text("nome")
    surname = _text("cognome")
    fiscalCode = _text("codice_fiscale")
    gender = _text("sesso")
    birthMunicipality = _text("comune_nascita")
    birthDate = serializers.DateField(source="data_nascita", required=False, allow_null=True)
    address = _text("indirizzo")
    city = _text("citta")
    postalCode = _text("cap")
    country = _text("nazione")
    phone = _text("telefono")
    mobile = _text("cellulare")
    email = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    district = _text("distretto_appartenenza")
    doctorId = serializers.IntegerField(source="id_medico", required=False, allow_null=True)
    note = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    # Orthopedic — footwear / insole
    shoeSize = _text("misura_scarpa")
    shoeModel = _text("modello_scarpa")
    width = _text("pianta")
    collar = _text("collo")
    ankle = _text("caviglia")
    spur = _text("speronatura")
    lift = _text("rialzo")
    inclinedPlane = _text("piano_incl_tot")
    insoleType = _text("tipo_plantare")
    collarPassage = _text("passaggio_collo")
    anklePassage = _text("passaggio_caviglie")

    # Orthopedic — brace / frame
    braceType = _text("tipo_tutore")
    shoulderStraps = _text("spallacci")
    upToArmpit = _text("fino_ascella")
    frontFabricHeight = _text("alt_stoffa_ant")
    totalFrameHeight = _text("alt_tot_armatura")
    axillaryDistance = _text("dist_ascellare")

    # Orthopedic — body measurements
    waist = _text("misura_vita")
    pelvisSize = _text("misura_bacino")
    measure24 = _text("misura_2_4")
    neck = _text("mis_collo")
    humerus = _text("mis_omero")
    arm = _text("mis_braccio")
    wrist = _text("mis_polso")
    pelvis = _text("mis_bacino")
    thigh = _text("mis_coscia")
    leg = _text("mis_gamba")

    # Orthopedic — notes
    clientNote = _text("note_cliente")
    other = _text("altro")

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if validated_data:
            instance.save(update_fields=list(validated_data.keys()))
        return instance
