"""
Tests for the "Scheda Progetto" generator.

`prepare_scheda` and its formatting/wrapping are exercised with lightweight stubs
(attribute reads only — no database). `render_scheda` runs against a generated
blank-A4 stand-in for the required template, keeping the suite hermetic.
"""
from datetime import date
from io import BytesIO

import pytest
from pypdf import PdfReader
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from apps.quotes.scheda import (
    SchedaDocument,
    SchedaItem,
    prepare_scheda,
    render_scheda,
    scheda_filename,
)


class Stub:
    def __init__(self, **attrs):
        self.__dict__.update(attrs)


def make_quote(**overrides):
    base = {
        "id": 7,
        "data_preventivo": date(2025, 3, 7),
        "diagnosi_circostanziata": "diagnosi breve",
        "prescizione_dettagliata_protesi": "protesi breve",
        "tipologia_preventivo": "asl",
    }
    base.update(overrides)
    return Stub(**base)


def make_client(**overrides):
    base = {
        "cognome": "rossi",
        "nome": "mario",
        "citta": "napoli",
        "provincia": "NA",
        "telefono": "0811234567",
        "comune_nascita": "salerno",
        "data_nascita": date(1980, 1, 2),
        "indirizzo": "Via Roma 1",
    }
    base.update(overrides)
    return Stub(**base)


def make_item(**overrides):
    base = {
        "codice": "C1",
        "descrizione": "Tutore",
        "prezzo": 107.91,
        "quantita": 2.0,
        "importo": 215.82,
        "sconto": None,
    }
    base.update(overrides)
    return Stub(**base)


def prepare(quote=None, client=None, items=()):
    return prepare_scheda(quote or make_quote(), client or make_client(), items)


# --- header fields ----------------------------------------------------------

def test_identity_and_dates():
    doc = prepare(make_quote(id=7, data_preventivo=date(2025, 3, 7)))
    assert doc.id_progetto == "7"
    assert doc.data_preventivo == "07/03/25"
    assert doc.data_nascita == "02/01/80"


def test_uppercasing_and_as_is_fields():
    doc = prepare(
        make_quote(tipologia_preventivo="asl"),
        make_client(cognome="rossi", nome="mario", citta="napoli", comune_nascita="salerno",
                    indirizzo="Via Roma 1", telefono="0811234567", provincia="NA"),
    )
    assert (doc.cognome, doc.nome) == ("ROSSI", "MARIO")
    assert doc.comune_residenza == "NAPOLI"
    assert doc.comune_nascita == "SALERNO"
    assert doc.tipologia == "ASL"
    # indirizzo, telefono and provincia code are kept verbatim (render adds parens).
    assert doc.indirizzo == "Via Roma 1"
    assert doc.telefono == "0811234567"
    assert doc.provincia == "NA"


def test_blank_dates_are_empty():
    doc = prepare(make_quote(data_preventivo=None), make_client(data_nascita=None))
    assert doc.data_preventivo == ""
    assert doc.data_nascita == ""


# --- diagnosi / protesi wrapping --------------------------------------------

def test_diagnosi_single_line_strips_newlines_and_uppercases():
    assert prepare(make_quote(diagnosi_circostanziata="ab\ncd")).diagnosi == ("ABCD",)


def test_diagnosi_wraps_past_65_chars():
    text = "a" * 70
    diag = prepare(make_quote(diagnosi_circostanziata=text)).diagnosi
    assert diag == ("A" * 65, "A" * 5)


def test_diagnosi_wrap_decision_uses_raw_length():
    # 60 visible chars + 6 newlines: raw length 66 >= 65 triggers the wrap, but the
    # stamped (cleaned) text is only 60 chars, so the second line is empty.
    text = "a" * 60 + "\n" * 6
    assert prepare(make_quote(diagnosi_circostanziata=text)).diagnosi == ("A" * 60, "")


def test_protesi_is_not_newline_stripped():
    assert prepare(make_quote(prescizione_dettagliata_protesi="ab\ncd")).protesi == ("AB\nCD",)


# --- line items -------------------------------------------------------------

def test_item_numbers_formatted_as_is_and_importo_rounded():
    doc = prepare(items=[make_item(prezzo=107.91, quantita=2.0, importo=215.82, sconto=None)])
    item = doc.items[0]
    assert item.prezzo == "107.91"
    assert item.quantita == "2"          # whole number prints without decimals
    assert item.importo == "215.82"
    assert item.show_sconto is False


def test_item_sconto_shown_only_when_nonzero():
    assert prepare(items=[make_item(sconto=10.0)]).items[0].show_sconto is True
    assert prepare(items=[make_item(sconto=10.0)]).items[0].sconto == "10"
    assert prepare(items=[make_item(sconto=0.0)]).items[0].show_sconto is False


def test_item_missing_importo_counts_as_zero():
    doc = prepare(items=[make_item(importo=None)])
    assert doc.items[0].importo == "0"
    assert doc.sub_totale == "0"


def test_description_single_line_when_short():
    assert prepare(items=[make_item(descrizione="Tutore")]).items[0].descrizione == ("Tutore",)


def test_description_wraps_past_30_chars_dropping_index_28():
    text = "".join(str(i % 10) for i in range(40))  # 40 distinct-ish chars
    desc = prepare(items=[make_item(descrizione=text)]).items[0].descrizione
    assert desc == (text[0:28], text[29:89])
    assert len(desc[0]) == 28


def test_totals_subtotal_and_vat():
    doc = prepare(items=[make_item(importo=100.0), make_item(importo=215.82)])
    assert doc.sub_totale == "315.82"
    # 315.82 * 1.04 = 328.4528 -> 328.45
    assert doc.totale == "328.45"


# --- filename ---------------------------------------------------------------

def test_filename_uses_id():
    assert scheda_filename(make_quote(id=7)) == "scheda-progetto-7.pdf"


# --- rendering --------------------------------------------------------------

@pytest.fixture
def template_path(tmp_path):
    path = tmp_path / "scheda.pdf"
    pdf = canvas.Canvas(str(path), pagesize=A4)
    pdf.showPage()
    pdf.save()
    return path


def document(items=()):
    return SchedaDocument(
        id_progetto="7",
        data_preventivo="07/03/25",
        cognome="ROSSI",
        nome="MARIO",
        indirizzo="Via Roma 1",
        comune_residenza="NAPOLI",
        provincia="NA",
        telefono="0811234567",
        comune_nascita="SALERNO",
        data_nascita="02/01/80",
        tipologia="ASL",
        diagnosi=("DIAGNOSI",),
        protesi=("PROTESI",),
        items=tuple(items),
        sub_totale="215.82",
        totale="224.45",
    )


def test_render_produces_single_a4_pdf_with_content(template_path):
    item = SchedaItem("C1", ("Tutore",), "2", "107.91", "", False, "215.82")
    pdf = render_scheda(document(items=[item]), template_path=template_path)

    assert pdf.startswith(b"%PDF")
    reader = PdfReader(BytesIO(pdf))
    assert len(reader.pages) == 1
    assert float(reader.pages[0].mediabox.width) == pytest.approx(A4[0], abs=1.0)

    text = reader.pages[0].extract_text()
    for value in ("ITCA01059027", "ROSSI", "NAPOLI", "(NA)", "Data 02/01/80", "107.91 €", "4%", "215.82 €"):
        assert value in text


def test_render_missing_template_raises(tmp_path):
    with pytest.raises(FileNotFoundError):
        render_scheda(document(), template_path=tmp_path / "missing.pdf")
