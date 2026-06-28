"""
Tests for the "Scheda valutazione rischi e collaudi" generator.

`prepare_collaudi` is exercised with lightweight stubs (attribute reads only — no
database). `render_collaudi` runs against a generated blank 2-page A4 stand-in for
the template, keeping the suite hermetic.
"""
from datetime import date
from io import BytesIO

import pytest
from pypdf import PdfReader
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from apps.quotes.documents.collaudi import (
    _MATRICOLA_PITCH_MM,
    _MATRICOLA_X0_MM,
    _MATRICOLA_X_MAX_MM,
    _matricola_pitch,
    collaudi_filename,
    prepare_collaudi,
    render_collaudi,
)

TODAY = date(2026, 6, 19)


class Stub:
    def __init__(self, **attrs):
        self.__dict__.update(attrs)


def make_work_order(**overrides):
    base = {
        "id": 555,
        "data_prova_cliente": date(2024, 3, 7),
        "data_verifica_cliente": date(2024, 4, 8),
        "firma_tecnico": "M. Bianchi",
    }
    base.update(overrides)
    return Stub(**base)


def make_client(**overrides):
    base = {"nome": "mario", "cognome": "rossi"}
    base.update(overrides)
    return Stub(**base)


def make_quote(protesi="protesi breve"):
    return Stub(prescizione_dettagliata_protesi=protesi)


def make_item(id, produzione=None, **overrides):
    base = {"id": id, "produzione": produzione, "materiale": None, "fornitore": None,
            "ddt": None, "lotto": None}
    base.update(overrides)
    return Stub(**base)


def make_check(**overrides):
    base = {"data_intervento": date(2024, 5, 9), "intervento": "controllo", "firma_tecnico": "T1"}
    base.update(overrides)
    return Stub(**base)


_UNSET = object()


def prepare(work_order=None, client=_UNSET, quote=_UNSET, items=(), checks=()):
    return prepare_collaudi(
        work_order or make_work_order(),
        make_client() if client is _UNSET else client,
        make_quote() if quote is _UNSET else quote,
        items,
        checks,
        today=TODAY,
    )


# --- header & identity ------------------------------------------------------

def test_names_uppercased_and_id():
    doc = prepare(make_work_order(id=555), make_client(nome="mario", cognome="rossi"))
    assert (doc.nome, doc.cognome) == ("MARIO", "ROSSI")
    assert doc.id_lavorazione == "555"


def test_missing_client_yields_empty_names():
    doc = prepare(client=None)
    assert doc.nome == ""
    assert doc.cognome == ""


def test_dates_are_dash_four_digit_year():
    doc = prepare(make_work_order(data_prova_cliente=date(2024, 3, 7),
                                  data_verifica_cliente=date(2024, 4, 8)))
    assert doc.data_prova == "07-03-2024"
    assert doc.data_verifica == "08-04-2024"
    assert doc.data_oggi == "19-06-2026"


def test_signature_passthrough():
    assert prepare(make_work_order(firma_tecnico="M. Bianchi")).firma_tecnico == "M. Bianchi"


# --- protesi wrapping -------------------------------------------------------

def test_protesi_single_line_when_short():
    assert prepare(quote=make_quote("breve")).protesi == ("BREVE",)


def test_protesi_three_overlapping_lines_when_long():
    raw = "".join(str(i % 10) for i in range(120))
    doc = prepare(quote=make_quote(raw))
    text = raw.upper()
    assert doc.protesi == (text[0:45], text[45:105], text[60:240])
    # line 3 overlaps line 2 from char 60 (the preserved quirk).
    assert doc.protesi[2][0] == text[60]


# --- product ids & production codes -----------------------------------------

def test_product_ids_and_production_split():
    items = [
        make_item(1, produzione="INTERNA"),
        make_item(2, produzione="ESTERNA"),
        make_item(3, produzione="INTERNA"),
    ]
    doc = prepare(items=items)
    assert doc.product_ids == ("1", "2", "3")
    assert doc.internal_codes == ("1", "3")
    assert doc.external_codes == ("2",)


# --- matricola strip pitch --------------------------------------------------

def test_matricola_pitch_uses_default_for_short_strips():
    # Up to 7 ids fit at the default pitch (last at 30 + 6*9 = 84), so it is kept.
    for count in range(0, 8):
        assert _matricola_pitch(count) == _MATRICOLA_PITCH_MM


def test_matricola_pitch_tightens_to_avoid_cod_column():
    # 9 ids would overrun at the default pitch, so the pitch is compressed and the
    # last id lands exactly on the strip's right edge — never in the COD column.
    pitch = _matricola_pitch(9)
    assert pitch < _MATRICOLA_PITCH_MM
    assert _MATRICOLA_X0_MM + pitch * 8 == pytest.approx(_MATRICOLA_X_MAX_MM)


# --- page-2 tables ----------------------------------------------------------

def test_periodic_checks_and_materials():
    items = [make_item(7, materiale="Pelle", fornitore="ACME", ddt="D-1", lotto="L-9")]
    checks = [make_check(data_intervento=date(2024, 5, 9), intervento="controllo", firma_tecnico="T1")]
    doc = prepare(items=items, checks=checks)

    assert doc.periodic_checks[0].data_intervento == "2024-05-09"  # raw ISO, as the DB returns it
    assert doc.periodic_checks[0].intervento == "controllo"
    assert doc.materials[0].materiale == "Pelle"
    assert doc.materials[0].ddt == "D-1"


def test_blank_traceability_fields_become_empty():
    doc = prepare(items=[make_item(7)], checks=[make_check(data_intervento=None)])
    assert doc.materials[0].materiale == ""
    assert doc.periodic_checks[0].data_intervento == ""


# --- filename ---------------------------------------------------------------

def test_filename_uses_id():
    assert collaudi_filename(make_work_order(id=555)) == "scheda-collaudi-555.pdf"


# --- rendering --------------------------------------------------------------

@pytest.fixture
def template_path(tmp_path):
    """A blank 2-page A4 stand-in for the real template."""
    path = tmp_path / "schedacollaudi.pdf"
    pdf = canvas.Canvas(str(path), pagesize=A4)
    pdf.showPage()
    pdf.showPage()
    pdf.save()
    return path


def test_render_produces_two_a4_pages_with_content(template_path):
    items = [make_item(7, produzione="INTERNA", materiale="Pelle", fornitore="ACME",
                       ddt="D-1", lotto="L-9")]
    checks = [make_check(intervento="controllo")]
    doc = prepare(make_work_order(id=555), items=items, checks=checks)

    out = render_collaudi(doc, template_path=template_path)
    assert out.startswith(b"%PDF")
    reader = PdfReader(BytesIO(out))
    assert len(reader.pages) == 2
    assert float(reader.pages[0].mediabox.width) == pytest.approx(A4[0], abs=1.0)

    page1 = reader.pages[0].extract_text()
    for value in ("MARIO", "ROSSI", "555", "X", "07-03-2024"):
        assert value in page1

    page2 = reader.pages[1].extract_text()
    for value in ("controllo", "Pelle", "D-1", "L-9"):
        assert value in page2


def test_render_missing_template_raises(tmp_path):
    with pytest.raises(FileNotFoundError):
        render_collaudi(prepare(), template_path=tmp_path / "missing.pdf")
