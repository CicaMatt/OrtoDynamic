"""
Shared layout primitives for the code-drawn PDF documents.

The consegna form, the DDT and the Scheda Progetto are all laid out with the same
`FpdfCanvas` box model and reuse a handful of identical building blocks: the
letterheaded page head with its centered title, a bold section title, a label/value
row, the bordered-table mechanics, and the date/signature footer. Those live here
so each generator keeps only its own
document-specific logic. Callers set the font (face/size) before drawing where the
size varies between documents; the helpers own the geometry that is genuinely shared.
"""
from __future__ import annotations

from .fpdf_canvas import FpdfCanvas
from .letterhead import CONTENT_TOP_MM, write_letterhead

# A drawn signature rule, shared by the footers.
SIGNATURE_RULE = "_" * 30

# Placeholder shown in a table whose body is empty.
EMPTY_TABLE_TEXT = "Nessuna voce disponibile"

# Shared head of every code-drawn document: the left margin its content starts at
# and the centered title's font size / box height.
_CONTENT_LEFT_MM = 10.0
_TITLE_SIZE = 14.0
_TITLE_HEIGHT_MM = 8.0


def new_titled_document(title: str) -> FpdfCanvas:
    """
    Start a letterheaded A4 page with `title` centered below the company header, and
    the cursor left at the content area underneath it.

    Shared by the code-drawn documents (consegna, DDT, scheda); each caller adds its
    own vertical spacing after the title.
    """
    pdf = FpdfCanvas()
    write_letterhead(pdf)
    pdf.set_xy(_CONTENT_LEFT_MM, CONTENT_TOP_MM)
    pdf.set_font("B", _TITLE_SIZE)
    pdf.cell(0, _TITLE_HEIGHT_MM, title, 0, 1, "C")
    return pdf


def section(pdf: FpdfCanvas, title: str) -> None:
    """A bold section heading on its own line."""
    pdf.set_font("B", 11)
    pdf.cell(0, 6, title, 0, 1)


def label_value(
    pdf: FpdfCanvas,
    label: str,
    value: str,
    *,
    label_w: float,
    size: float = 10.0,
    height: float = 6.0,
    value_bold: bool = True,
) -> None:
    """A label/value line: a fixed-width label cell, then the value running to the margin."""
    pdf.set_font("", size)
    pdf.cell(label_w, height, label, 0, 0)
    pdf.set_font("B" if value_bold else "", size)
    pdf.cell(0, height, value, 0, 1)


def table_row(pdf: FpdfCanvas, cells, *, height: float = 7.0) -> None:
    """
    Draw one bordered table row from `(width, text, align)` cells; the last cell
    closes the line (`ln=1`). The caller sets the font (and may pass an empty text
    to leave a bordered cell to be filled separately, e.g. a wrapped description).
    """
    cells = list(cells)
    last = len(cells) - 1
    for index, (width, text, align) in enumerate(cells):
        pdf.cell(width, height, text, 1, 1 if index == last else 0, align)


def table_empty(pdf: FpdfCanvas, width: float, *, height: float = 7.0,
                text: str = EMPTY_TABLE_TEXT) -> None:
    """A single full-width bordered row standing in for an empty table body."""
    pdf.cell(width, height, text, 1, 1, "C")


def signature_footer(pdf: FpdfCanvas, *, date_text: str, sign_label: str,
                     size: float = 10.0) -> None:
    """The closing row: ``Data: <date>`` on the left, ``<label> <rule>`` on the right."""
    pdf.set_font("", size)
    pdf.cell(95, 7, f"Data: {date_text}", 0, 0, "L")
    pdf.cell(95, 7, f"{sign_label} {SIGNATURE_RULE}", 0, 1, "R")
