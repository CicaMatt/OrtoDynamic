"""
A faithful subset of FPDF 1.81, rendered with reportlab.

The legacy quote documents are FPDF PDFs; this reproduces the parts of FPDF's
drawing model they rely on — millimetres, a top-left origin, the ``Write()``
cursor used for coordinate overlays and the ``Cell()``/``Ln()`` box model used for
flowing layouts — so the generated output lines up with the originals. Only the
behaviour those documents use is implemented: single-line text, a full border or
none, and L/C/R alignment.

Geometry (FPDF 1.81):
- Left-aligned text sits one interior cell margin (~1 mm) right of the pen X.
- The text baseline sits ``0.5*h + 0.3*fontSize`` (mm) below the cell top;
  ``Write()`` uses ``h = 0``, so its baseline is ``0.3*fontSize`` below the pen Y.
"""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

_MM_TO_PT = 72.0 / 25.4
_PAGE_W_MM = 210.0
_PAGE_H_PT = A4[1]
_MARGIN_MM = 10.0          # FPDF default page margin
_CELL_MARGIN_MM = 1.0      # FPDF interior cell margin (left/right text inset)
_BORDER_WIDTH_MM = 0.2     # FPDF default line width


class FpdfCanvas:
    """An A4 page drawn with FPDF semantics; `output()` returns the PDF bytes."""

    def __init__(self) -> None:
        self._buffer = BytesIO()
        self._canvas = canvas.Canvas(self._buffer, pagesize=A4)
        self._canvas.setLineWidth(_BORDER_WIDTH_MM * _MM_TO_PT)
        self.x = _MARGIN_MM
        self.y = _MARGIN_MM
        self._font = "Helvetica"
        self._size = 9.0
        self._canvas.setFont(self._font, self._size)

    def set_font(self, style: str = "", size: float = 9.0) -> None:
        self._font = "Helvetica-Bold" if "B" in style.upper() else "Helvetica"
        self._size = size
        self._canvas.setFont(self._font, size)

    def set_xy(self, x: float, y: float) -> None:
        self.x = x
        self.y = y

    def get_x(self) -> float:
        return self.x

    def get_y(self) -> float:
        return self.y

    def write(self, text: str) -> None:
        """FPDF ``Write(0, text)``: stamp at the cursor, then advance x by the text width."""
        text = text or ""
        self.cell(self._string_width_mm(text), 0, text)

    def write_at(self, x: float, y: float, text: str) -> None:
        """Convenience for the ``SetXY`` then ``Write`` pattern used by the overlays."""
        self.set_xy(x, y)
        self.write(text)

    def image(self, path: Path, x: float, y: float, w: float, h: float) -> None:
        """Draw an image using FPDF's top-left millimetre coordinates."""
        self._canvas.drawImage(
            ImageReader(str(path)),
            x * _MM_TO_PT,
            _PAGE_H_PT - (y + h) * _MM_TO_PT,
            width=w * _MM_TO_PT,
            height=h * _MM_TO_PT,
            mask="auto",
        )

    def cell(self, w: float, h: float, text: str = "", border: int = 0, ln: int = 0,
             align: str = "L") -> None:
        if w == 0:
            w = _PAGE_W_MM - _MARGIN_MM - self.x

        if border:
            self._canvas.rect(
                self.x * _MM_TO_PT,
                _PAGE_H_PT - (self.y + h) * _MM_TO_PT,
                w * _MM_TO_PT,
                h * _MM_TO_PT,
                stroke=1,
                fill=0,
            )

        if text:
            self.text_cell(self.x, self.y, w, h, text, align)

        if ln == 1:
            self.x = _MARGIN_MM
            self.y += h
        else:
            self.x += w

    def text_cell(self, x: float, y: float, w: float, h: float, text: str, align: str = "L") -> None:
        """Draw `text` inside the box (x, y, w, h) — vertically centered, L/C/R — without a
        border or moving the cursor. Shared by `cell` and the table/wrapping helpers."""
        if not text:
            return
        if align == "C":
            dx = (w - self._string_width_mm(text)) / 2
        elif align == "R":
            dx = w - _CELL_MARGIN_MM - self._string_width_mm(text)
        else:
            dx = _CELL_MARGIN_MM
        # FPDF vertical centering: baseline at y + 0.5*h + 0.3*FontSize (mm).
        baseline_mm = y + 0.5 * h + 0.3 * (self._size / _MM_TO_PT)
        self._canvas.drawString((x + dx) * _MM_TO_PT, _PAGE_H_PT - baseline_mm * _MM_TO_PT, text)

    def wrap(self, text: str, w: float) -> list[str]:
        """Greedily word-wrap `text` into lines fitting width `w` (mm) at the current font,
        honouring existing newlines. Always returns at least one (possibly empty) line."""
        usable = w - 2 * _CELL_MARGIN_MM
        lines: list[str] = []
        for paragraph in (text or "").split("\n"):
            current = ""
            for word in paragraph.split(" "):
                candidate = word if not current else f"{current} {word}"
                if not current or self._string_width_mm(candidate) <= usable:
                    current = candidate
                else:
                    lines.append(current)
                    current = word
            lines.append(current)
        return lines

    def multi_cell(self, w: float, h: float, text: str) -> None:
        """Draw `text` word-wrapped to width `w` with line height `h`, then drop the cursor
        below the block (x back to the left margin) — FPDF's MultiCell, left-aligned."""
        if w == 0:
            w = _PAGE_W_MM - _MARGIN_MM - self.x
        left = self.x
        for line in self.wrap(text, w):
            self.text_cell(left, self.y, w, h, line, "L")
            self.y += h
        self.x = _MARGIN_MM

    def ln(self, h: float) -> None:
        self.x = _MARGIN_MM
        self.y += h

    def fits(self, height: float) -> bool:
        """True if a block `height` mm tall fits below the cursor before the bottom margin."""
        page_height_mm = _PAGE_H_PT / _MM_TO_PT
        return self.y + height <= page_height_mm - _MARGIN_MM

    def add_page(self) -> None:
        """Finalize the current page and start a fresh one with the cursor back at the
        top-left margin. reportlab's ``showPage`` resets the graphics state, so the line
        width and current font are re-applied to keep drawing consistent across pages."""
        self._canvas.showPage()
        self._canvas.setLineWidth(_BORDER_WIDTH_MM * _MM_TO_PT)
        self._canvas.setFont(self._font, self._size)
        self.x = _MARGIN_MM
        self.y = _MARGIN_MM

    def output(self) -> bytes:
        self._canvas.showPage()
        self._canvas.save()
        return self._buffer.getvalue()

    def _string_width_mm(self, text: str) -> float:
        return self._canvas.stringWidth(text, self._font, self._size) / _MM_TO_PT
