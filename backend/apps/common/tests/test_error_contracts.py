"""Stable API envelopes for DRF validation errors."""

from rest_framework import serializers

from apps.common.exceptions import api_exception_handler


def test_field_validation_errors_include_a_message_and_fields_map():
    response = api_exception_handler(
        serializers.ValidationError(
            {
                "code": ["Questo campo è obbligatorio."],
                "price": ["Inserisci un numero valido."],
            }
        ),
        {},
    )

    assert response.status_code == 400
    assert response.data == {
        "error": {
            "message": "Controlla i campi evidenziati.",
            "fields": {
                "code": ["Questo campo è obbligatorio."],
                "price": ["Inserisci un numero valido."],
            },
        }
    }


def test_non_field_validation_error_becomes_the_general_message():
    response = api_exception_handler(
        serializers.ValidationError({"non_field_errors": ["Combinazione non valida."]}),
        {},
    )

    assert response.status_code == 400
    assert response.data == {"error": {"message": "Combinazione non valida."}}
