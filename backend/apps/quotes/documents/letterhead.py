"""
Shared company letterhead for the code-generated PDF documents.

Drawn at the top-left of each document so every generated PDF carries the same
Ortodynamic header (logo + company lines), matching the header printed on the
legacy pre-printed forms. Document content starts at `CONTENT_TOP_MM`.
"""
from __future__ import annotations

from pathlib import Path

from .fpdf_canvas import FpdfCanvas

LOGO_PATH = Path(__file__).resolve().parent / "assets" / "logo.png"

LETTERHEAD_LINES = (
    "Ortodynamic srl",
    "Via Filettine 12-14",
    "84016 Pagani SA",
    "Tel 081-5151302 081-18754715",
    "Pec: ortdynamicsrl@arubapec.it",
    "P. Iva 05078030656",
)

# Y (mm) below the letterhead where a document's own content can begin.
CONTENT_TOP_MM = 46.0


def write_letterhead(pdf: FpdfCanvas) -> None:
    """Draw the logo (if present) and the company lines at the top-left of the page."""
    if LOGO_PATH.exists():
        pdf.image(LOGO_PATH, 16, 9, 18, 22.5)

    pdf.set_font("B", 11)
    pdf.write_at(39, 10, LETTERHEAD_LINES[0])
    pdf.set_font("", 8)
    for index, line in enumerate(LETTERHEAD_LINES[1:]):
        pdf.write_at(39, 15 + index * 4, line)
