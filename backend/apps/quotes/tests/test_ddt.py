"""
Tests for the DDT (delivery note) generator.

`prepare_ddt` and the formatting it applies are exercised with lightweight stubs
(only attribute reads, so no database or Django model is needed). `render_ddt`
runs on a blank page (the primary case) and, separately, against a generated
blank-A4 stand-in for the optional template, keeping the suite hermetic.
"""
from datetime import date
from io import BytesIO
from types import SimpleNamespace

import pytest
from pypdf import PdfReader
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from apps.quotes.documents.ddt import (
    DdtDocument,
    DdtItem,
    ddt_filename,
    prepare_ddt,
    render_ddt,
)

TODAY = date(2026, 6, 19)


def make_quote(**overrides):
    base = {
        "id": 42,
        "numero_ordine": "ORD-9",
        "numero_preventivo": "PR-1",
        "numero_autorizzazione": "AUT-7",
    }
    base.update(overrides)
    return SimpleNamespace(**base)


def make_client(**overrides):
    base = {
        "cognome": "Rossi",
        "nome": "Mario",
        "indirizzo": "Via Roma 1",
        "cap": "80100",
        "citta": "Napoli",
        "provincia": "NA",
    }
    base.update(overrides)
    return SimpleNamespace(**base)


def item(codice="C1", descrizione="Tutore", quantita=1.0, prezzo=107.91, importo=215.82):
    return SimpleNamespace(
        codice=codice,
        descrizione=descrizione,
        quantita=quantita,
        prezzo=prezzo,
        importo=importo,
    )


def prepare(quote=None, client=None, items=()):
    return prepare_ddt(quote or make_quote(), client or make_client(), items, today=TODAY)


# --- ddt_number fallback chain ----------------------------------------------

def test_ddt_number_prefers_order_number():
    assert prepare(make_quote(numero_ordine="ORD-9")).ddt_number == "ORD-9"


def test_ddt_number_falls_back_to_quote_number():
    assert prepare(make_quote(numero_ordine="", numero_preventivo="PR-1")).ddt_number == "PR-1"


def test_ddt_number_falls_back_to_id():
    quote = make_quote(id=42, numero_ordine="", numero_preventivo=None)
    assert prepare(quote).ddt_number == "42"


# --- recipient & header fields ----------------------------------------------

def test_destinatario_is_surname_then_name_trimmed():
    assert prepare(client=make_client(cognome="Rossi", nome="Mario")).destinatario == "Rossi Mario"
    assert prepare(client=make_client(cognome="Rossi", nome=None)).destinatario == "Rossi"


def test_indirizzo_completo_format():
    doc = prepare(client=make_client(indirizzo="Via Roma 1", cap="80100", citta="Napoli", provincia="NA"))
    assert doc.indirizzo_completo == "Via Roma 1 - 80100 Napoli (NA)"


def test_authorization_and_date_passthrough():
    doc = prepare(make_quote(numero_autorizzazione="AUT-7"))
    assert doc.numero_autorizzazione == "AUT-7"
    assert doc.generated_date == "19/06/2026"
    assert prepare(make_quote(numero_autorizzazione=None)).numero_autorizzazione == ""


# --- item transforms --------------------------------------------------------

def test_missing_product_yields_empty_code_and_description():
    doc = prepare(items=[item(codice=None, descrizione=None, quantita=2.0)])
    assert doc.items[0].codice == ""
    assert doc.items[0].descrizione == ""


def test_description_untouched_when_within_limit():
    text = "A" * 55
    assert prepare(items=[item(descrizione=text)]).items[0].descrizione == text


def test_description_truncated_with_marker_within_limit():
    result = prepare(items=[item(descrizione="A" * 60)]).items[0].descrizione
    assert result == "A" * 52 + "..."
    assert len(result) == 55


@pytest.mark.parametrize(
    "quantita,expected",
    [
        (1.0, "1"),
        (2, "2"),
        (1000.0, "1000"),       # whole numbers carry no thousands separator
        (2.5, "2,50"),
        (1234.5, "1.234,50"),
        (None, "0"),
    ],
)
def test_quantity_formatting(quantita, expected):
    assert prepare(items=[item(quantita=quantita)]).items[0].quantita == expected


def test_price_fields_are_formatted_when_requested():
    row = prepare(items=[item(prezzo=107.91, importo=215.82)],).items[0]
    assert row.prezzo_unitario == "107,91 €"
    assert row.importo == "215,82 €"


def test_descriptions_are_shorter_when_prices_are_requested():
    result = prepare(items=[item(descrizione="A" * 60)]).items[0].descrizione
    assert result == "A" * 52 + "..."

    priced_doc = prepare_ddt(
        make_quote(),
        make_client(),
        [item(descrizione="A" * 60)],
        today=TODAY,
        show_prices=True,
    )
    assert priced_doc.items[0].descrizione == "A" * 35 + "..."
    assert len(priced_doc.items[0].descrizione) == 38


# --- filename ---------------------------------------------------------------

def test_filename_uses_id():
    assert ddt_filename(make_quote(id=42)) == "ddt_42.pdf"


# --- rendering --------------------------------------------------------------

def document(items=()):
    return DdtDocument(
        ddt_number="ORD-9",
        generated_date="19/06/2026",
        numero_autorizzazione="AUT-7",
        destinatario="Rossi Mario",
        indirizzo_completo="Via Roma 1 - 80100 Napoli (NA)",
        items=tuple(items),
    )


def _read(pdf_bytes):
    reader = PdfReader(BytesIO(pdf_bytes))
    return reader, reader.pages[0]


def test_render_blank_page_is_single_a4_with_content():
    pdf = render_ddt(document(items=[DdtItem("C1", "Tutore", "1")]), template_path=None)
    assert pdf.startswith(b"%PDF")
    reader, page = _read(pdf)
    assert len(reader.pages) == 1
    assert float(page.mediabox.width) == pytest.approx(A4[0], abs=1.0)
    assert float(page.mediabox.height) == pytest.approx(A4[1], abs=1.0)

    text = page.extract_text()
    for value in (
        "Ortodynamic srl",
        "Documento di trasporto",
        "ORD-9",
        "Rossi Mario",
        "Codice",
        "Descrizione",
        "C1",
    ):
        assert value in text


def test_render_without_prices_keeps_price_columns_hidden():
    text = _read(
        render_ddt(
            document(items=[DdtItem("C1", "Tutore", "1", "107,91 €", "215,82 €")]),
            template_path=None,
        )
    )[1].extract_text()
    assert "Prezzo unit." not in text
    assert "107,91" not in text


def test_render_with_prices_shows_unit_and_line_totals():
    doc = DdtDocument(
        ddt_number="ORD-9",
        generated_date="19/06/2026",
        numero_autorizzazione="AUT-7",
        destinatario="Rossi Mario",
        indirizzo_completo="Via Roma 1 - 80100 Napoli (NA)",
        items=(DdtItem("C1", "Tutore", "1", "107,91 €", "215,82 €"),),
        show_prices=True,
    )

    text = _read(render_ddt(doc, template_path=None))[1].extract_text()
    assert "Prezzo unit." in text
    assert "Totale" in text
    assert "107,91 €" in text
    assert "215,82 €" in text


def test_render_empty_items_shows_placeholder():
    text = _read(render_ddt(document(items=[]), template_path=None))[1].extract_text()
    assert "Nessuna voce disponibile" in text


def test_render_over_template_composes_single_a4(tmp_path):
    template = tmp_path / "ddt.pdf"
    pdf = canvas.Canvas(str(template), pagesize=A4)
    pdf.showPage()
    pdf.save()

    out = render_ddt(document(items=[DdtItem("C1", "Tutore", "1")]), template_path=template)
    reader, page = _read(out)
    assert len(reader.pages) == 1
    assert float(page.mediabox.width) == pytest.approx(A4[0], abs=1.0)
