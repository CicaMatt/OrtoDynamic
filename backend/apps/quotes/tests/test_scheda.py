"""
Tests for the "Scheda Progetto" generator.

`prepare_scheda` is exercised with lightweight stubs (attribute reads only — no
database). `render_scheda` produces a code-drawn page, asserted by its size and
extracted text. The free text and item descriptions are kept in full (no
truncation), which the tests check explicitly.
"""
from datetime import date
from io import BytesIO

import pytest
from pypdf import PdfReader
from reportlab.lib.pagesizes import A4

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
    assert doc.indirizzo == "Via Roma 1"   # kept verbatim
    assert doc.telefono == "0811234567"
    assert doc.provincia == "NA"


def test_blank_dates_are_empty():
    doc = prepare(make_quote(data_preventivo=None), make_client(data_nascita=None))
    assert doc.data_preventivo == ""
    assert doc.data_nascita == ""


# --- no loss: full free text and descriptions -------------------------------

def test_diagnosi_and_protesi_kept_in_full():
    long_diagnosi = "Inizio " + "dettaglio clinico " * 30 + "FINEDIAGNOSI"
    long_protesi = "Prescrizione " + "molto dettagliata " * 30 + "FINEPROTESI"
    doc = prepare(make_quote(diagnosi_circostanziata=long_diagnosi,
                             prescizione_dettagliata_protesi=long_protesi))
    assert doc.diagnosi == long_diagnosi.upper()      # nothing truncated
    assert doc.protesi == long_protesi.upper()


def test_item_description_kept_in_full():
    long_desc = "Descrizione prodotto molto lunga " * 4  # ~132 chars
    doc = prepare(items=[make_item(descrizione=long_desc)])
    assert doc.items[0].descrizione == long_desc       # no 30/88-char truncation


# --- items & totals ---------------------------------------------------------

def test_item_numbers_and_sconto():
    doc = prepare(items=[make_item(prezzo=107.91, quantita=2.0, importo=215.82, sconto=10.0)])
    item = doc.items[0]
    assert item.prezzo == "107.91"
    assert item.quantita == "2"
    assert item.importo == "215.82"
    assert item.show_sconto is True
    assert item.sconto == "10"


def test_sconto_hidden_when_zero_or_missing():
    assert prepare(items=[make_item(sconto=0.0)]).items[0].show_sconto is False
    assert prepare(items=[make_item(sconto=None)]).items[0].show_sconto is False


def test_totals_subtotal_and_vat():
    doc = prepare(items=[make_item(importo=100.0), make_item(importo=215.82)])
    assert doc.sub_totale == "315.82"
    assert doc.totale == "328.45"  # 315.82 * 1.04 = 328.4528 -> 328.45


# --- filename ---------------------------------------------------------------

def test_filename_uses_id():
    assert scheda_filename(make_quote(id=7)) == "scheda-progetto-7.pdf"


# --- rendering --------------------------------------------------------------

def document(**overrides):
    base = dict(
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
        diagnosi="DIAGNOSI DI PROVA",
        protesi="PROTESI DI PROVA",
        items=(SchedaItem("C1", "Tutore", "2", "107.91", "", False, "215.82"),),
        sub_totale="215.82",
        totale="224.45",
    )
    base.update(overrides)
    return SchedaDocument(**base)


def _text(pdf_bytes):
    return PdfReader(BytesIO(pdf_bytes)).pages[0].extract_text()


def test_render_produces_single_a4_pdf_with_content():
    pdf = render_scheda(document())
    assert pdf.startswith(b"%PDF")
    reader = PdfReader(BytesIO(pdf))
    assert len(reader.pages) == 1
    assert float(reader.pages[0].mediabox.width) == pytest.approx(A4[0], abs=1.0)

    text = reader.pages[0].extract_text()
    for value in ("Ortodynamic srl", "Scheda Progetto", "ITCA01059027", "ROSSI MARIO",
                  "C1", "Tutore", "215.82 €"):
        assert value in text


def test_render_keeps_long_free_text():
    text = _text(render_scheda(document(
        diagnosi="INIZIO " + "DETTAGLIO " * 30 + "FINEDIAGNOSI",
        protesi="P " + "X " * 40 + "FINEPROTESI",
    )))
    # The tail tokens prove the blocks were rendered in full, not truncated.
    assert "FINEDIAGNOSI" in text
    assert "FINEPROTESI" in text


def test_render_empty_items_shows_placeholder():
    assert "Nessuna voce disponibile" in _text(render_scheda(document(items=())))


def test_render_includes_conformity_footer():
    text = _text(render_scheda(document()))
    for value in ("certificazioni e normative vigenti", "Francesco Pepe",
                  "all'albo N.48", "Timbro e firma"):
        assert value in text


def test_render_embeds_technician_signature():
    pdf = render_scheda(document())
    sizes = {image.image.size for image in PdfReader(BytesIO(pdf)).pages[0].images}
    assert (69, 90) in sizes  # the facsimile signature lifted from the pre-printed sheet


def test_footer_moves_to_next_page_when_it_does_not_fit():
    # A long items table fills the first page; the closing block must stay whole and
    # move to a second page rather than be split or pushed past the bottom margin.
    items = tuple(SchedaItem(f"C{i}", f"Voce {i}", "1", "10", "", False, "10") for i in range(20))
    reader = PdfReader(BytesIO(render_scheda(document(items=items))))
    assert len(reader.pages) == 2

    first, last = reader.pages[0].extract_text(), reader.pages[1].extract_text()
    assert "Timbro e firma" not in first
    for value in ("certificazioni e normative vigenti", "Francesco Pepe", "Timbro e firma"):
        assert value in last
    # the facsimile signature travels with the block.
    assert (69, 90) in {image.image.size for image in reader.pages[1].images}
