"""
Build the "Scheda Progetto" project sheet for a quote.

A single A4 page generated entirely in code: the shared company letterhead, the
project/client header, the diagnosi and protesi free-text blocks, and a line-items
table with running totals. Unlike the legacy overlay this loses nothing — the
diagnosi/protesi and item descriptions are rendered in full (word-wrapped) instead
of being truncated to fixed-length lines.

`prepare_scheda` turns a quote, its client and its line items into the document's
display values (pure, DB/HTTP-free); `render_scheda` lays them out and returns the
PDF bytes.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from decimal import ROUND_HALF_UP, Decimal

from apps.quotes.fpdf_canvas import FpdfCanvas
from apps.quotes.letterhead import CONTENT_TOP_MM, write_letterhead
from apps.quotes.pdf_layout import label_value, section, table_empty, table_row

# Lab/accreditation code shown in the header.
_LAB_CODE = "ITCA01059027"
_VAT_RATE = 0.04

# Items table: column widths (mm, summing to the 190 mm usable width), headers and
# alignments, and the per-line height used when a description wraps.
_ITEM_WIDTHS = (24.0, 74.0, 12.0, 26.0, 16.0, 26.0, 12.0)
_ITEM_HEADERS = ("Codice", "Descrizione", "Qtà", "Prezzo", "Sconto", "Importo", "IVA")
_ITEM_ALIGNS = ("L", "L", "C", "R", "C", "R", "C")
_ITEM_LINE_MM = 5.0


@dataclass(frozen=True)
class SchedaItem:
    """One line-items row, formatted for display (description kept in full)."""

    codice: str
    descrizione: str
    quantita: str
    prezzo: str
    sconto: str
    show_sconto: bool
    importo: str


@dataclass(frozen=True)
class SchedaDocument:
    """The sheet's display values, ready to lay out."""

    id_progetto: str
    data_preventivo: str
    cognome: str
    nome: str
    indirizzo: str
    comune_residenza: str
    provincia: str
    telefono: str
    comune_nascita: str
    data_nascita: str
    tipologia: str
    diagnosi: str
    protesi: str
    items: tuple[SchedaItem, ...]
    sub_totale: str
    totale: str


def prepare_scheda(quote, client, items) -> SchedaDocument:
    """
    Map a quote, its client and its line items onto the sheet's display values.

    Names, comuni, tipologia, diagnosi and protesi are upper-cased; indirizzo and
    telefono are kept as-is; dates render ``DD/MM/YY``. Free text and item
    descriptions are kept in full (the renderer wraps them). Quantities and unit
    prices print as-is (whole numbers without a decimal part); line and document
    totals round to two decimals. `items` is any sequence exposing `codice`,
    `descrizione`, `prezzo`, `quantita`, `importo`, `sconto`.
    """
    sub_total = 0.0
    prepared_items = []
    for item in items:
        if item.importo is not None:
            sub_total += float(item.importo)
        prepared_items.append(
            SchedaItem(
                codice=str(item.codice) if item.codice is not None else "",
                descrizione=item.descrizione or "",
                quantita=_plain(item.quantita),
                prezzo=_plain(item.prezzo),
                sconto=_plain(item.sconto),
                show_sconto=bool(item.sconto),
                importo=_amount(item.importo),
            )
        )

    return SchedaDocument(
        id_progetto=str(quote.id),
        data_preventivo=_date(quote.data_preventivo),
        cognome=(client.cognome or "").upper(),
        nome=(client.nome or "").upper(),
        indirizzo=client.indirizzo or "",
        comune_residenza=(client.citta or "").upper(),
        provincia=client.provincia or "",
        telefono=client.telefono or "",
        comune_nascita=(client.comune_nascita or "").upper(),
        data_nascita=_date(client.data_nascita),
        tipologia=(quote.tipologia_preventivo or "").upper(),
        diagnosi=(quote.diagnosi_circostanziata or "").upper(),
        protesi=(quote.prescizione_dettagliata_protesi or "").upper(),
        items=tuple(prepared_items),
        sub_totale=_amount(sub_total),
        totale=_amount(sub_total * (1 + _VAT_RATE)),
    )


def scheda_filename(quote) -> str:
    """Suggested file name ``scheda-progetto-<id>.pdf``."""
    return f"scheda-progetto-{quote.id}.pdf"


def render_scheda(document: SchedaDocument) -> bytes:
    """Lay the project sheet out on a code-drawn A4 page and return the PDF bytes."""
    pdf = FpdfCanvas()
    write_letterhead(pdf)
    pdf.set_xy(10, CONTENT_TOP_MM)

    pdf.set_font("B", 14)
    pdf.cell(0, 8, "Scheda Progetto", 0, 1, "C")
    pdf.ln(4)

    # Project header.
    _field(pdf, "Progetto Nº:", document.id_progetto)
    _field(pdf, "Data Preventivo:", document.data_preventivo)
    _field(pdf, "Tipologia:", document.tipologia)
    _field(pdf, "Codice Lab.:", _LAB_CODE)
    pdf.ln(3)

    # Client.
    section(pdf, "Cliente")
    _field(pdf, "Cognome e Nome:", f"{document.cognome} {document.nome}".strip())
    _field(pdf, "Indirizzo:", _address(document))
    _field(pdf, "Telefono:", document.telefono)
    _field(pdf, "Nato a:", _birth(document))
    pdf.ln(3)

    # Free-text blocks, rendered in full.
    section(pdf, "Diagnosi Circostanziata")
    pdf.set_font("", 9)
    pdf.multi_cell(0, 5, document.diagnosi or "—")
    pdf.ln(2)

    section(pdf, "Prescrizione Dettagliata Protesi")
    pdf.set_font("", 9)
    pdf.multi_cell(0, 5, document.protesi or "—")
    pdf.ln(4)

    # Items.
    section(pdf, "Voci")
    _items_table(pdf, document)
    pdf.ln(2)
    pdf.set_font("", 10)
    pdf.cell(150, 6, "Subtotale:", 0, 0, "R")
    pdf.cell(40, 6, f"{document.sub_totale} €", 0, 1, "R")
    pdf.set_font("B", 10)
    pdf.cell(150, 6, "Totale (IVA 4% inclusa):", 0, 0, "R")
    pdf.cell(40, 6, f"{document.totale} €", 0, 1, "R")

    return pdf.output()


def _field(pdf: FpdfCanvas, label: str, value: str) -> None:
    """This sheet's 46 mm label / bold-value row."""
    label_value(pdf, label, value, label_w=46)


def _items_table(pdf: FpdfCanvas, document: SchedaDocument) -> None:
    pdf.set_font("B", 8)
    table_row(pdf, ((width, header, "C") for width, header in zip(_ITEM_WIDTHS, _ITEM_HEADERS)))

    pdf.set_font("", 8)
    if not document.items:
        table_empty(pdf, sum(_ITEM_WIDTHS))
        return

    description_x = 10.0 + _ITEM_WIDTHS[0]
    for item in document.items:
        description_lines = pdf.wrap(item.descrizione, _ITEM_WIDTHS[1])
        row_height = max(1, len(description_lines)) * _ITEM_LINE_MM
        top = pdf.get_y()

        sconto = f"{item.sconto}%" if item.show_sconto else ""
        prezzo = f"{item.prezzo} €" if item.prezzo else ""
        importo = f"{item.importo} €" if item.importo else ""
        # The description cell is drawn empty (border only); its wrapped lines are
        # placed afterwards so a long description grows the row instead of clipping.
        values = (item.codice, "", item.quantita, prezzo, sconto, importo, "4%")
        table_row(pdf, zip(_ITEM_WIDTHS, values, _ITEM_ALIGNS), height=row_height)
        for line_index, line in enumerate(description_lines):
            pdf.text_cell(description_x, top + line_index * _ITEM_LINE_MM, _ITEM_WIDTHS[1], _ITEM_LINE_MM, line, "L")


def _address(document: SchedaDocument) -> str:
    location = " ".join(
        part for part in (document.comune_residenza, f"({document.provincia})" if document.provincia else "") if part
    )
    return f"{document.indirizzo} - {location}".strip(" -")


def _birth(document: SchedaDocument) -> str:
    if document.data_nascita:
        return f"{document.comune_nascita} il {document.data_nascita}".strip()
    return document.comune_nascita


def _date(value: date | None) -> str:
    return value.strftime("%d/%m/%y") if value else ""


def _plain(value) -> str:
    """A DOUBLE column value as the DB would render it: whole → integer, else as-is."""
    if value is None or value == "":
        return ""
    number = float(value)
    return str(int(number)) if number == int(number) else str(number)


def _amount(value) -> str:
    """Round to two decimals (half-up, like PHP `round`), then drop trailing zeros."""
    number = float(value) if value not in (None, "") else 0.0
    rounded = Decimal(str(number)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    text = format(rounded, "f")
    return text.rstrip("0").rstrip(".") if "." in text else text
