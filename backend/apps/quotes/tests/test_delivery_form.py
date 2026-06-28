"""
Tests for the "Modulo di consegna" generator.

`prepare_delivery_form_fields` and `delivery_form_filename` are exercised with
lightweight stubs (they only read attributes, so no database or Django model is
needed). `render_delivery_form` produces a code-drawn page, asserted by its size
and extracted text.
"""
from datetime import date
from io import BytesIO
from types import SimpleNamespace

import pytest
from pypdf import PdfReader
from reportlab.lib.pagesizes import A4

from apps.quotes.documents.delivery_form import (
    DeliveryFormFields,
    delivery_form_filename,
    prepare_delivery_form_fields,
    render_delivery_form,
)

TODAY = date(2026, 6, 18)


def make_quote(**overrides):
    base = {
        "numero_autorizzazione": "AUT-12345",
        "data_accettazione": date(2024, 3, 7),
        "data_preventivo": date(2025, 11, 2),
    }
    base.update(overrides)
    return SimpleNamespace(**base)


# --- prepare_delivery_form_fields -------------------------------------------

def test_names_are_uppercased():
    fields = prepare_delivery_form_fields(
        make_quote(), SimpleNamespace(cognome="rossi", nome="mario"), today=TODAY
    )
    assert fields.cognome == "ROSSI"
    assert fields.nome == "MARIO"


def test_acceptance_date_is_day_month_two_digit_year():
    fields = prepare_delivery_form_fields(
        make_quote(data_accettazione=date(2024, 3, 7)),
        SimpleNamespace(cognome="r", nome="m"),
        today=TODAY,
    )
    assert fields.data_accettazione == "07/03/24"


def test_generation_date_is_day_month_four_digit_year():
    fields = prepare_delivery_form_fields(
        make_quote(), SimpleNamespace(cognome="r", nome="m"), today=TODAY
    )
    assert fields.data_generazione == "18/06/2026"


def test_missing_acceptance_date_is_blank():
    fields = prepare_delivery_form_fields(
        make_quote(data_accettazione=None),
        SimpleNamespace(cognome="r", nome="m"),
        today=TODAY,
    )
    assert fields.data_accettazione == ""


def test_missing_client_yields_empty_names():
    fields = prepare_delivery_form_fields(make_quote(), None, today=TODAY)
    assert fields.cognome == ""
    assert fields.nome == ""
    # The other values still come through.
    assert fields.numero_autorizzazione == "AUT-12345"


def test_blank_client_fields_become_empty_strings():
    fields = prepare_delivery_form_fields(
        make_quote(numero_autorizzazione=None),
        SimpleNamespace(cognome=None, nome=None),
        today=TODAY,
    )
    assert fields.cognome == ""
    assert fields.nome == ""
    assert fields.numero_autorizzazione == ""


# --- delivery_form_filename --------------------------------------------------

def test_filename_uses_quote_date():
    assert (
        delivery_form_filename(make_quote(data_preventivo=date(2025, 11, 2)), TODAY)
        == "modulo-consegna-251102.pdf"
    )


def test_filename_falls_back_to_today_without_quote_date():
    assert (
        delivery_form_filename(make_quote(data_preventivo=None), TODAY)
        == "modulo-consegna-260618.pdf"
    )


# --- render_delivery_form ----------------------------------------------------

def test_render_produces_single_a4_pdf():
    fields = DeliveryFormFields("ROSSI", "MARIO", "AUT-12345", "07/03/24", "18/06/2026")
    pdf = render_delivery_form(fields)

    assert pdf.startswith(b"%PDF")
    reader = PdfReader(BytesIO(pdf))
    assert len(reader.pages) == 1
    box = reader.pages[0].mediabox
    assert float(box.width) == pytest.approx(A4[0], abs=1.0)
    assert float(box.height) == pytest.approx(A4[1], abs=1.0)


def test_render_includes_letterhead_title_and_fields():
    fields = DeliveryFormFields("ROSSI", "MARIO", "AUT-12345", "07/03/24", "18/06/2026")
    text = PdfReader(BytesIO(render_delivery_form(fields))).pages[0].extract_text()
    for value in (
        "Ortodynamic srl",
        "Modulo di Consegna",
        "ROSSI MARIO",
        "AUT-12345",
        "07/03/24",
        "18/06/2026",
    ):
        assert value in text
