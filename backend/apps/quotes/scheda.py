"""
Build the "Scheda Progetto" project sheet for a quote.

Like the consegna form, this is a coordinate overlay: values are stamped at fixed
millimetre positions onto a pre-printed background (``assets/scheda.pdf``),
reproducing the legacy FPDF + FPDI script — including its header fields, the
two wrapping free-text blocks (diagnosi/protesi) and a repeating line-items table
with running totals.

`prepare_scheda` turns a quote, its client and its line items into the document's
display values (pure, DB/HTTP-free); `render_scheda` stamps them over the template
and returns the PDF bytes (template path injectable for testing).
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import date
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

from apps.quotes.fpdf_canvas import FpdfCanvas
from apps.quotes.pdf_background import compose_on_template

# Required background template (the overlay coordinates are meaningless without
# it); the view turns a missing file into a clear error.
TEMPLATE_PATH = Path(__file__).resolve().parent / "assets" / "scheda.pdf"

# Lab/accreditation code printed verbatim on every sheet.
_LAB_CODE = "ITCA01059027"
# Wrap thresholds and the per-row vertical pitch, straight from the original.
_BLOCK_WRAP_AT = 65
_DESCRIPTION_WRAP_AT = 30
_ROW_PITCH_MM = 5.1
_ROW_BASE_Y_MM = 145.7
_VAT_RATE = 0.04


@dataclass(frozen=True)
class SchedaItem:
    """One line-items row, formatted for display."""

    codice: str
    descrizione: tuple[str, ...]  # 1 element (single line) or 2 (wrapped)
    quantita: str
    prezzo: str
    sconto: str
    show_sconto: bool
    importo: str


@dataclass(frozen=True)
class SchedaDocument:
    """The sheet's display values, ready to stamp."""

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
    diagnosi: tuple[str, ...]  # 1 element (single line) or 2 (wrapped)
    protesi: tuple[str, ...]
    items: tuple[SchedaItem, ...]
    sub_totale: str
    totale: str


def prepare_scheda(quote, client, items) -> SchedaDocument:
    """
    Map a quote, its client and its line items onto the sheet's display values.

    Names, comuni and tipologia are upper-cased; the indirizzo and telefono are
    left as-is; dates render ``DD/MM/YY``; the diagnosi (CR/LF stripped) and
    protesi wrap to two lines past 65 characters. Quantities and unit prices print
    as-is (whole numbers without a decimal part); line and document totals round to
    two decimals. `items` is any sequence exposing `codice`, `descrizione`,
    `prezzo`, `quantita`, `importo`, `sconto`.
    """
    diagnosi_raw = quote.diagnosi_circostanziata or ""
    protesi_raw = quote.prescizione_dettagliata_protesi or ""

    sub_total = 0.0
    prepared_items = []
    for item in items:
        if item.importo is not None:
            sub_total += float(item.importo)
        prepared_items.append(
            SchedaItem(
                codice=str(item.codice) if item.codice is not None else "",
                descrizione=_description_lines(item.descrizione or ""),
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
        # The original tests the raw length (CR/LF included) but stamps the cleaned text.
        diagnosi=_wrap(_strip_newlines(diagnosi_raw).upper(), len(diagnosi_raw)),
        protesi=_wrap(protesi_raw.upper(), len(protesi_raw)),
        items=tuple(prepared_items),
        sub_totale=_amount(sub_total),
        totale=_amount(sub_total * (1 + _VAT_RATE)),
    )


def scheda_filename(quote) -> str:
    """Suggested file name ``scheda-progetto-<id>.pdf``."""
    return f"scheda-progetto-{quote.id}.pdf"


def render_scheda(document: SchedaDocument, *, template_path: Path = TEMPLATE_PATH) -> bytes:
    """
    Stamp `document` over the template and return the PDF bytes. Raises
    `FileNotFoundError` when the template asset is absent (surfaced by the caller).
    """
    return compose_on_template(_build_overlay(document), template_path)


def _build_overlay(document: SchedaDocument) -> bytes:
    pdf = FpdfCanvas()
    pdf.set_font("", 9)

    # Header / fixed fields.
    pdf.write_at(23.5, 57, _LAB_CODE)
    pdf.write_at(32, 74.5, document.id_progetto)
    pdf.write_at(30, 81.6, document.data_preventivo)
    pdf.write_at(40, 89.5, document.cognome)
    pdf.set_xy(pdf.get_x() + 2, pdf.get_y())  # NOME flush after COGNOME, 2 mm gap
    pdf.write(document.nome)
    pdf.write_at(43, 97, document.indirizzo)
    pdf.set_xy(pdf.get_x() + 2, pdf.get_y())  # COMUNE after the address, 2 mm gap
    pdf.write(document.comune_residenza)
    pdf.set_xy(pdf.get_x() + 1, pdf.get_y())  # (PROVINCIA) after the comune, 1 mm gap
    pdf.write(f"({document.provincia})")
    pdf.write_at(38, 104.7, document.telefono)
    pdf.write_at(36, 112.1, document.comune_nascita)
    pdf.set_xy(pdf.get_x() + 2, pdf.get_y())  # birth date after the comune, 2 mm gap
    pdf.write(f"Data {document.data_nascita}")
    pdf.write_at(168, 59, document.tipologia)

    # Free-text blocks (9 pt), single line or wrapped to two.
    _write_block(pdf, document.diagnosi, single=(44, 120.7), wrapped=((44, 119), (44, 122)))
    _write_block(pdf, document.protesi, single=(50, 127.3), wrapped=((50, 125.4), (50, 128.4)))

    # Line-items table.
    for index, item in enumerate(document.items):
        dy = index * _ROW_PITCH_MM
        pdf.set_font("", 8)
        pdf.write_at(28, _ROW_BASE_Y_MM + dy, item.codice)

        pdf.set_font("", 6)
        if len(item.descrizione) == 2:
            pdf.write_at(49.2, 145.1 + dy, item.descrizione[0])
            pdf.write_at(49.2, 146.9 + dy, item.descrizione[1])
        else:
            pdf.write_at(49.2, 145.7 + dy, item.descrizione[0])

        pdf.set_font("", 8)
        pdf.write_at(94.5, 145.7 + dy, item.quantita)
        pdf.write_at(110.8, 145.7 + dy, f"{item.prezzo} €")
        if item.show_sconto:
            pdf.write_at(135.8, 145.7 + dy, f"{item.sconto}%")
        pdf.write_at(153.8, 145.9 + dy, f"{item.importo} €")
        pdf.write_at(173, 145.8 + dy, "4%")

    # Totals inherit the loop's 8 pt; with no items the size is still the 9 pt the
    # header left set, matching the original.
    pdf.set_font("", 8 if document.items else 9)
    pdf.write_at(153.8, 235, f"{document.sub_totale} €")
    pdf.write_at(153.8, 240, f"{document.totale} €")

    return pdf.output()


def _write_block(pdf, lines, *, single, wrapped) -> None:
    if len(lines) == 2:
        pdf.write_at(*wrapped[0], lines[0])
        pdf.write_at(*wrapped[1], lines[1])
    else:
        pdf.write_at(*single, lines[0])


def _wrap(text: str, raw_length: int) -> tuple[str, ...]:
    """Split into two fixed lines past the 65-char threshold (measured on `raw_length`)."""
    if raw_length >= _BLOCK_WRAP_AT:
        return (text[0:65], text[65:190])
    return (text,)


def _description_lines(text: str) -> tuple[str, ...]:
    """Item description: single line, or two past 30 chars (dropping index 28, per the original)."""
    if len(text) >= _DESCRIPTION_WRAP_AT:
        return (text[0:28], text[29:89])
    return (text,)


def _date(value: date | None) -> str:
    return value.strftime("%d/%m/%y") if value else ""


def _strip_newlines(text: str) -> str:
    return re.sub(r"[\r\n]", "", text)


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
