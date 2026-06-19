"""
Build the DDT (Documento di Trasporto / delivery note) for a quote.

Unlike the consegna form, this document has no pre-printed background in the
current system: the layout is generated programmatically as a sequence of flowing
cells on a blank A4 page, reproducing the legacy FPDF script. A `ddt.pdf` template
is supported only as an optional enhancement — if the asset exists it is drawn as
the page background (same (5 mm, 5 mm)/200 mm placement as the consegna form),
otherwise the page stays blank.

The public functions are pure and free of HTTP/DB concerns: `prepare_ddt` turns a
quote, its client and its line items into the document's display strings, and
`render_ddt` lays those out and returns the PDF bytes (template path injectable).
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from pathlib import Path

from apps.quotes.fpdf_canvas import FpdfCanvas
from apps.quotes.pdf_background import compose_on_template

# Optional background template; absent in the current system, so the default path
# normally does not exist and the document renders on a blank page.
TEMPLATE_PATH = Path(__file__).resolve().parent / "assets" / "ddt.pdf"

_DESCRIPTION_LIMIT = 55  # max width of the description column text, marker included
_TRIM_MARKER = "..."
_SIGNATURE_RULE = "_" * 30


@dataclass(frozen=True)
class DdtItem:
    """One table row, already formatted for display."""

    codice: str
    descrizione: str
    quantita: str


@dataclass(frozen=True)
class DdtDocument:
    """The DDT's display strings, ready to lay out."""

    ddt_number: str
    generated_date: str       # today as "DD/MM/YYYY"
    numero_autorizzazione: str  # "" when unset
    destinatario: str
    indirizzo_completo: str   # "" when there is nothing to show
    items: tuple[DdtItem, ...]


def prepare_ddt(quote, client, items, *, today: date) -> DdtDocument:
    """
    Map a quote, its client and its line items onto the DDT's display strings.

    `items` is any sequence of objects exposing `codice`, `descrizione` and
    `quantita` (the catalogue code/description, null when the product is gone, and
    the line quantity). Descriptions are truncated and quantities formatted here so
    `render_ddt` only lays out finished strings. `today` is injected to keep this
    pure (the view passes `timezone.localdate()`).
    """
    return DdtDocument(
        ddt_number=_ddt_number(quote),
        generated_date=today.strftime("%d/%m/%Y"),
        numero_autorizzazione=quote.numero_autorizzazione or "",
        destinatario=_destinatario(client),
        indirizzo_completo=_indirizzo_completo(client),
        items=tuple(
            DdtItem(
                codice=item.codice or "",
                descrizione=_truncate(item.descrizione or ""),
                quantita=_format_quantity(item.quantita),
            )
            for item in items
        ),
    )


def ddt_filename(quote) -> str:
    """Suggested file name ``ddt_<id>.pdf``."""
    return f"ddt_{quote.id}.pdf"


def render_ddt(document: DdtDocument, *, template_path: Path = TEMPLATE_PATH) -> bytes:
    """
    Lay the DDT out on a blank A4 page and return the PDF bytes. If `template_path`
    exists it is drawn as the page background; otherwise the page stays blank (the
    primary case in the current system).
    """
    content = _build_content(document)
    if template_path is not None and template_path.exists():
        return compose_on_template(content, template_path)
    return content


def _build_content(document: DdtDocument) -> bytes:
    pdf = FpdfCanvas()

    # 1. Title.
    pdf.set_font("B", 14)
    pdf.cell(0, 8, "Documento di trasporto", 0, 1, "C")
    pdf.ln(2)

    # 2. Header line 1: DDT number and today's date.
    pdf.set_font("", 10)
    pdf.cell(35, 6, "DDT n°:", 0, 0)
    pdf.cell(80, 6, document.ddt_number, 0, 0)
    pdf.cell(35, 6, "Data:", 0, 0)
    pdf.cell(0, 6, document.generated_date, 0, 1)

    # 3. Header line 2: authorization number when present, else a blank line to
    #    keep the vertical rhythm.
    if document.numero_autorizzazione:
        pdf.cell(35, 6, "Autorizzazione:", 0, 0)
        pdf.cell(80, 6, document.numero_autorizzazione, 0, 1)
    else:
        pdf.ln(6)
    pdf.ln(2)

    # 4. Recipient block.
    pdf.set_font("B", 11)
    pdf.cell(0, 6, "Destinatario", 0, 1)
    pdf.set_font("", 10)
    pdf.cell(0, 6, document.destinatario, 0, 1)
    if document.indirizzo_completo:
        pdf.cell(0, 6, document.indirizzo_completo, 0, 1)
    pdf.ln(4)

    # 5. Items table header.
    pdf.set_font("B", 9)
    pdf.cell(30, 7, "Codice", 1, 0, "L")
    pdf.cell(140, 7, "Descrizione", 1, 0, "L")
    pdf.cell(20, 7, "Qtà", 1, 1, "C")

    # 6. Items, or the empty state.
    pdf.set_font("", 9)
    if document.items:
        for item in document.items:
            pdf.cell(30, 7, item.codice, 1, 0, "L")
            pdf.cell(140, 7, item.descrizione, 1, 0, "L")
            pdf.cell(20, 7, item.quantita, 1, 1, "C")
    else:
        pdf.cell(190, 7, "Nessuna voce disponibile", 1, 1, "C")

    # 7. Footer: date and signature line.
    pdf.ln(12)
    pdf.set_font("", 10)
    pdf.cell(95, 7, f"Data: {document.generated_date}", 0, 0, "L")
    pdf.cell(95, 7, f"FIRMA: {_SIGNATURE_RULE}", 0, 1, "R")

    return pdf.output()


def _ddt_number(quote) -> str:
    """First non-empty of order number, then quote number, else the id."""
    for value in (quote.numero_ordine, quote.numero_preventivo):
        if value:
            return str(value)
    return str(quote.id)


def _destinatario(client) -> str:
    return f"{client.cognome or ''} {client.nome or ''}".strip()


def _indirizzo_completo(client) -> str:
    indirizzo = client.indirizzo or ""
    cap = client.cap or ""
    citta = client.citta or ""
    provincia = client.provincia or ""
    return f"{indirizzo} - {cap} {citta} ({provincia})".strip()


def _truncate(text: str, limit: int = _DESCRIPTION_LIMIT, marker: str = _TRIM_MARKER) -> str:
    """Trim to at most `limit` characters, the marker included (matches mb_strimwidth)."""
    if len(text) <= limit:
        return text
    return text[: limit - len(marker)] + marker


def _format_quantity(value) -> str:
    """Whole numbers as plain integers; otherwise Italian format (1.234,50)."""
    quantity = float(value) if value not in (None, "") else 0.0
    if quantity == int(quantity):
        return str(int(quantity))
    integer_part, decimal_part = f"{quantity:,.2f}".split(".")
    return f"{integer_part.replace(',', '.')},{decimal_part}"
