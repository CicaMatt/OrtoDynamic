"""
Build the "Scheda valutazione rischi e collaudi" (risk-assessment & testing sheet)
for a work order.

A 2-page coordinate overlay: each page of the pre-printed ``assets/schedacollaudi.pdf``
is used at full original size (no inset, no scaling — unlike the other forms) and
values are stamped at absolute millimetre positions, reproducing the legacy
FPDF + FPDI script (`generacollaudi.php`).

This document is keyed on a **work order** (lavorazione), but it lives here with the
other PDF generators and their shared template assets; the work-order-scoped HTTP
endpoint lives in `apps.work_orders`.

`prepare_collaudi` turns the work order, its client/quote and its line/check rows
into the document's display values (pure, DB/HTTP-free); `render_collaudi` stamps
them over the two template pages and returns the PDF bytes (path injectable).
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from pathlib import Path

from apps.quotes.fpdf_canvas import FpdfCanvas
from apps.quotes.pdf_background import overlay_full_size

TEMPLATE_PATH = Path(__file__).resolve().parent / "assets" / "schedacollaudi.pdf"

# Checkbox ticks: in the original the conditional logic is commented out, so every
# box is stamped with a literal "X" regardless of the data.
_PAGE1_X_MARKS = (
    (123, 124.9), (111.6, 133.4), (55, 133.4), (70, 125), (17, 125), (8.3, 133.4),
    (123.7, 185.5), (111.6, 194), (68, 185.5), (56, 194), (13.5, 185.5), (8.3, 194),
    (83.8, 83),
)
# Small (font 5) copies of the technician signature, all at X = 180.
_SIGNATURE_Y_F5 = (262.5, 214.5, 159.55, 94.55, 76.55)

_PROTESI_WRAP_AT = 45
_PERIODIC_ROW_PITCH_MM = 8.6
_MATERIAL_ROW_PITCH_MM = 8.0


@dataclass(frozen=True)
class CollaudiPeriodicCheck:
    data_intervento: str
    intervento: str
    firma_tecnico: str


@dataclass(frozen=True)
class CollaudiMaterial:
    materiale: str
    fornitore: str
    ddt: str
    lotto: str


@dataclass(frozen=True)
class CollaudiDocument:
    """The sheet's display values, ready to stamp."""

    nome: str
    cognome: str
    id_lavorazione: str
    protesi: tuple[str, ...]        # 1 line, or 3 when the description is long
    product_ids: tuple[str, ...]    # the strip from X = 30, Y = 65
    internal_codes: tuple[str, ...]
    external_codes: tuple[str, ...]
    data_prova: str
    data_verifica: str
    data_oggi: str
    firma_tecnico: str
    periodic_checks: tuple[CollaudiPeriodicCheck, ...]
    materials: tuple[CollaudiMaterial, ...]


def prepare_collaudi(work_order, client, quote, items, periodic_checks, *, today: date) -> CollaudiDocument:
    """
    Map the work order, its client/quote and its line/check rows onto the sheet's
    display values.

    Names are upper-cased; the protesi description (from the quote) is upper-cased
    and wrapped to three overlapping lines past 45 characters; dates render
    ``DD-MM-YYYY``. `items` is the job's `item_lavorazioni` rows (product id +
    production + traceability) and `periodic_checks` its `controlli_periodici` rows.
    `today` is injected to keep this pure.
    """
    items = list(items)
    raw_protesi = (quote.prescizione_dettagliata_protesi if quote is not None else "") or ""

    return CollaudiDocument(
        nome=(client.nome or "").upper() if client is not None else "",
        cognome=(client.cognome or "").upper() if client is not None else "",
        id_lavorazione=str(work_order.id),
        protesi=_protesi_lines(raw_protesi),
        product_ids=tuple(str(item.id) for item in items),
        internal_codes=tuple(str(item.id) for item in items if item.produzione == "INTERNA"),
        external_codes=tuple(str(item.id) for item in items if item.produzione == "ESTERNA"),
        data_prova=_date(work_order.data_prova_cliente),
        data_verifica=_date(work_order.data_verifica_cliente),
        data_oggi=today.strftime("%d-%m-%Y"),
        firma_tecnico=work_order.firma_tecnico or "",
        periodic_checks=tuple(
            CollaudiPeriodicCheck(
                data_intervento=check.data_intervento.isoformat() if check.data_intervento else "",
                intervento=check.intervento or "",
                firma_tecnico=check.firma_tecnico or "",
            )
            for check in periodic_checks
        ),
        materials=tuple(
            CollaudiMaterial(
                materiale=item.materiale or "",
                fornitore=item.fornitore or "",
                ddt=item.ddt or "",
                lotto=item.lotto or "",
            )
            for item in items
        ),
    )


def collaudi_filename(work_order) -> str:
    """Suggested file name ``scheda-collaudi-<id>.pdf``."""
    return f"scheda-collaudi-{work_order.id}.pdf"


def render_collaudi(document: CollaudiDocument, *, template_path: Path = TEMPLATE_PATH) -> bytes:
    """
    Stamp `document` over the two template pages and return the PDF bytes. Raises
    `FileNotFoundError` when the template asset is absent (surfaced by the caller).
    """
    return overlay_full_size(template_path, [_build_page1(document), _build_page2(document)])


def _build_page1(document: CollaudiDocument) -> bytes:
    pdf = FpdfCanvas()

    pdf.set_font("", 9)
    pdf.write_at(30, 44, document.nome)
    pdf.write_at(60, 44, document.cognome)

    # Product-id strip, left to right, 9 mm pitch.
    pdf.set_font("", 6)
    for index, product_id in enumerate(document.product_ids):
        pdf.write_at(30 + 9 * index, 65, product_id)

    pdf.set_font("", 9)
    pdf.write_at(120, 65, document.id_lavorazione)

    # Protesi description: one line, or three overlapping lines when long.
    pdf.set_font("", 5)
    if len(document.protesi) == 3:
        pdf.write_at(92.3, 50, document.protesi[0])
        pdf.write_at(92.3, 52, document.protesi[1])
        pdf.write_at(92.3, 54, document.protesi[2])
    else:
        pdf.write_at(90, 53, document.protesi[0])

    # Every checkbox is ticked unconditionally (the conditional logic is disabled
    # in the original).
    pdf.set_font("", 9)
    for x, y in _PAGE1_X_MARKS:
        pdf.write_at(x, y, "X")

    pdf.write_at(17.5, 168.1, document.data_prova)
    pdf.write_at(17.5, 228.1, document.data_verifica)
    pdf.write_at(17.5, 262.1, document.data_oggi)

    pdf.write_at(100, 228.1, document.firma_tecnico)
    pdf.write_at(100, 168.1, document.firma_tecnico)
    pdf.set_font("", 5)
    for y in _SIGNATURE_Y_F5:
        pdf.write_at(180, y, document.firma_tecnico)

    # Production-code lists: a label drawn once, then the ids at an 8 mm pitch.
    pdf.set_font("", 9)
    if document.internal_codes:
        pdf.write_at(23, 90, "CODICE PRODUZIONI INTERNE: ")
        for index, code in enumerate(document.internal_codes):
            pdf.write_at(79 + 8 * index, 90, code)
    if document.external_codes:
        pdf.write_at(23, 98, "CODICE PRODUZIONI ESTERNE: ")
        for index, code in enumerate(document.external_codes):
            pdf.write_at(79 + 8 * index, 98, code)

    return pdf.output()


def _build_page2(document: CollaudiDocument) -> bytes:
    pdf = FpdfCanvas()
    pdf.set_font("", 9)

    for index, check in enumerate(document.periodic_checks):
        z = index * _PERIODIC_ROW_PITCH_MM
        pdf.write_at(25, 48 + z, check.data_intervento)
        pdf.write_at(50, 48 + z, check.intervento)
        pdf.write_at(155, 48 + z, check.firma_tecnico)

    for index, material in enumerate(document.materials):
        g = index * _MATERIAL_ROW_PITCH_MM
        pdf.write_at(25, 161.5 + g, material.materiale)
        pdf.write_at(62, 161.5 + g, material.fornitore)
        pdf.write_at(107, 161.5 + g, material.ddt)
        pdf.write_at(150, 161.5 + g, material.lotto)

    return pdf.output()


def _protesi_lines(raw: str) -> tuple[str, ...]:
    """Upper-cased; three overlapping lines past 45 chars (line 3 starts at 60), else one."""
    text = raw.upper()
    if len(raw) >= _PROTESI_WRAP_AT:
        return (text[0:45], text[45:105], text[60:240])
    return (text,)


def _date(value: date | None) -> str:
    return value.strftime("%d-%m-%Y") if value else ""
