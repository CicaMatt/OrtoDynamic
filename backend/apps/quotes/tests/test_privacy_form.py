"""
Tests for the "Modulo di privacy" generator.

`prepare_privacy_form_fields` is exercised with lightweight stubs (attribute reads
only — no database). `render_privacy_form` runs against a generated blank-A4
stand-in for the required template, keeping the suite hermetic.
"""
from datetime import date
from io import BytesIO

import pytest
from pypdf import PdfReader
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from apps.quotes.privacy_form import (
    PrivacyFormFields,
    prepare_privacy_form_fields,
    privacy_form_filename,
    render_privacy_form,
)

TODAY = date(2026, 6, 19)


class Stub:
    def __init__(self, **attrs):
        self.__dict__.update(attrs)


def test_names_are_uppercased():
    fields = prepare_privacy_form_fields(Stub(nome="mario", cognome="rossi"), today=TODAY)
    assert fields.nome == "MARIO"
    assert fields.cognome == "ROSSI"


def test_date_is_day_month_two_digit_year_with_dashes():
    fields = prepare_privacy_form_fields(Stub(nome="m", cognome="r"), today=TODAY)
    assert fields.generated_date == "19-06-26"


def test_blank_names_become_empty_strings():
    fields = prepare_privacy_form_fields(Stub(nome=None, cognome=None), today=TODAY)
    assert fields.nome == ""
    assert fields.cognome == ""


def test_filename_uses_id():
    assert privacy_form_filename(Stub(id=42)) == "modulo-privacy-42.pdf"


@pytest.fixture
def template_path(tmp_path):
    path = tmp_path / "privacy.pdf"
    pdf = canvas.Canvas(str(path), pagesize=A4)
    pdf.showPage()
    pdf.save()
    return path


def test_render_produces_single_a4_pdf_with_fields(template_path):
    fields = PrivacyFormFields(nome="MARIO", cognome="ROSSI", generated_date="19-06-26")
    pdf = render_privacy_form(fields, template_path=template_path)

    assert pdf.startswith(b"%PDF")
    reader = PdfReader(BytesIO(pdf))
    assert len(reader.pages) == 1
    assert float(reader.pages[0].mediabox.width) == pytest.approx(A4[0], abs=1.0)

    text = reader.pages[0].extract_text()
    for value in ("MARIO", "ROSSI", "19-06-26"):
        assert value in text


def test_render_missing_template_raises(tmp_path):
    fields = PrivacyFormFields(nome="MARIO", cognome="ROSSI", generated_date="19-06-26")
    with pytest.raises(FileNotFoundError):
        render_privacy_form(fields, template_path=tmp_path / "missing.pdf")
