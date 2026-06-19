"""
Build the "Modulo di consegna" delivery form for a quote.

A single A4 page: a pre-printed template PDF (``assets/moduloconsega.pdf``) is
placed as the page background and five short values are stamped on top of it at
fixed positions. This reproduces the legacy FPDF 1.81 + FPDI script, including its
exact text geometry, so the values land inside the boxes printed on the template.

The public functions are pure and free of HTTP/DB concerns, so the view stays thin
and both can be unit tested in isolation: `prepare_delivery_form_fields` turns a
quote and its client into the five display strings, and `render_delivery_form`
draws those strings over the template and returns the PDF bytes (the template path
is injectable for testing).
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from io import BytesIO
from pathlib import Path

from pypdf import PdfReader, PdfWriter, Transformation
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

# The template is a server-side asset shipped with the app (not user data and not
# a Django static file): a 1-page A4 PDF of the pre-printed form. It is absent
# from version control until supplied; the view turns a missing file into a clear
# error.
TEMPLATE_PATH = Path(__file__).resolve().parent / "assets" / "moduloconsega.pdf"

# --- Page & font geometry, reproducing FPDF 1.81 ----------------------------
# FPDF works in millimetres with a top-left origin; reportlab and pypdf work in
# PostScript points with a bottom-left origin. These constants bridge the two.
_MM_TO_PT = 72.0 / 25.4
_PAGE_W_PT, _PAGE_H_PT = A4  # 210x297 mm, matching the original AddPage() default

_FONT_NAME = "Helvetica"  # FPDF's "Arial" maps to the core Helvetica font
_FONT_SIZE_PT = 9

# FPDF's Cell() places the text baseline at ``y + 0.3 * FontSize`` (cell height
# 0), and Write()/Cell() indents a left-aligned string from the pen X by the
# interior cell margin. Both offsets are part of the original's real output, so
# they are reproduced rather than dropped; the coordinate table in the spec gives
# only the pen (SetXY) position.
_BASELINE_OFFSET_MM = 0.3 * (_FONT_SIZE_PT / _MM_TO_PT)  # ~0.95 mm below the pen Y
_CELL_MARGIN_MM = (28.35 / _MM_TO_PT) / 10               # ~1.00 mm right of the pen X

# Background placement: the template is drawn at (5 mm, 5 mm) from the top-left,
# scaled to 200 mm wide with its aspect ratio preserved (FPDI useTemplate).
_TEMPLATE_OFFSET_MM = 5.0
_TEMPLATE_WIDTH_MM = 200.0


@dataclass(frozen=True)
class DeliveryFormFields:
    """The five display strings stamped onto the form, already formatted."""

    cognome: str
    nome: str
    numero_autorizzazione: str
    data_accettazione: str  # "DD/MM/YY", or "" when unset
    data_generazione: str   # today as "DD/MM/YYYY"


def prepare_delivery_form_fields(quote, client, *, today: date) -> DeliveryFormFields:
    """
    Map a quote and its client onto the form's display strings.

    Names are upper-cased (empty when the client row is missing); the acceptance
    date renders as ``DD/MM/YY`` (empty when unset) and the generation date as
    ``DD/MM/YYYY``. `today` is passed in so the caller owns the clock
    (``timezone.localdate()`` in the view), keeping this function pure.
    """
    cognome = (client.cognome or "").upper() if client is not None else ""
    nome = (client.nome or "").upper() if client is not None else ""
    return DeliveryFormFields(
        cognome=cognome,
        nome=nome,
        numero_autorizzazione=quote.numero_autorizzazione or "",
        data_accettazione=(
            quote.data_accettazione.strftime("%d/%m/%y") if quote.data_accettazione else ""
        ),
        data_generazione=today.strftime("%d/%m/%Y"),
    )


def delivery_form_filename(quote, today: date) -> str:
    """Suggested file name ``modulo-consegna-YYMMDD.pdf``, keyed on the quote date."""
    basis = quote.data_preventivo or today
    return f"modulo-consegna-{basis:%y%m%d}.pdf"


def render_delivery_form(
    fields: DeliveryFormFields, *, template_path: Path = TEMPLATE_PATH
) -> bytes:
    """
    Draw `fields` over the template and return the finished PDF as bytes.

    Raises `FileNotFoundError` when the template asset is absent (a deployment
    error the caller surfaces to the client). `template_path` is injectable so
    tests can run against a generated stand-in.
    """
    overlay = _build_overlay(fields)
    return _compose(template_path, overlay)


def _build_overlay(fields: DeliveryFormFields) -> bytes:
    """An A4 page carrying only the five stamped strings (no background fill)."""
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    pdf.setFont(_FONT_NAME, _FONT_SIZE_PT)
    pdf.setFillColorRGB(0, 0, 0)

    # COGNOME first, then NOME flush after it with a 2 mm gap on the same baseline.
    # The gap is measured from the pen position FPDF leaves after COGNOME, which
    # advances by the string width only (the cell margin is not added to it).
    _draw(pdf, 92.0, 110.0, fields.cognome)
    cognome_width_mm = pdf.stringWidth(fields.cognome, _FONT_NAME, _FONT_SIZE_PT) / _MM_TO_PT
    _draw(pdf, 92.0 + cognome_width_mm + 2.0, 110.0, fields.nome)

    _draw(pdf, 55.0, 115.0, fields.numero_autorizzazione)
    _draw(pdf, 120.0, 115.0, fields.data_accettazione)
    _draw(pdf, 40.0, 255.0, fields.data_generazione)

    pdf.showPage()
    pdf.save()
    return buffer.getvalue()


def _draw(pdf: canvas.Canvas, x_mm: float, y_mm: float, text: str) -> None:
    """Stamp `text` at the FPDF pen position (x_mm, y_mm), matching FPDF geometry."""
    x_pt = (x_mm + _CELL_MARGIN_MM) * _MM_TO_PT
    baseline_pt = _PAGE_H_PT - (y_mm + _BASELINE_OFFSET_MM) * _MM_TO_PT
    pdf.drawString(x_pt, baseline_pt, text)


def _compose(template_path: Path, overlay: bytes) -> bytes:
    """Lay the template as the background of a blank A4 page, then the overlay on top."""
    template_page = PdfReader(str(template_path)).pages[0]
    box = template_page.mediabox
    scale = (_TEMPLATE_WIDTH_MM * _MM_TO_PT) / float(box.width)
    scaled_height_pt = float(box.height) * scale

    # Normalise a non-(0,0) MediaBox origin, scale to the target width, then place
    # the template's top-left corner 5 mm in from the page's top-left.
    placement = (
        Transformation()
        .translate(-float(box.left), -float(box.bottom))
        .scale(scale)
        .translate(
            _TEMPLATE_OFFSET_MM * _MM_TO_PT,
            _PAGE_H_PT - _TEMPLATE_OFFSET_MM * _MM_TO_PT - scaled_height_pt,
        )
    )

    writer = PdfWriter()
    page = writer.add_blank_page(width=_PAGE_W_PT, height=_PAGE_H_PT)
    page.merge_transformed_page(template_page, placement)
    page.merge_page(PdfReader(BytesIO(overlay)).pages[0])

    output = BytesIO()
    writer.write(output)
    return output.getvalue()
