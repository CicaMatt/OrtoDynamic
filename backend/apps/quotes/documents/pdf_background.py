"""
Compose a generated PDF overlay onto a pre-printed 1-page template.

Both quote documents (the consegna form and the DDT) can render over a scanned A4
template, placed the way the legacy FPDI script placed it: top-left corner at
(5 mm, 5 mm), scaled to 200 mm wide with the aspect ratio preserved. This module
is the single home for that placement.
"""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

from pypdf import PdfReader, PdfWriter, Transformation
from reportlab.lib.pagesizes import A4

_MM_TO_PT = 72.0 / 25.4
_PAGE_W_PT, _PAGE_H_PT = A4
_OFFSET_MM = 5.0
_WIDTH_MM = 200.0


def compose_on_template(overlay_pdf: bytes, template_path: Path) -> bytes:
    """
    Lay page 1 of `template_path` as the background of a blank A4 page — at
    (5 mm, 5 mm), scaled to 200 mm wide — then merge `overlay_pdf` on top.

    Raises `FileNotFoundError` when the template file is absent; callers that
    treat the template as optional check for its presence first.
    """
    template_page = PdfReader(str(template_path)).pages[0]
    box = template_page.mediabox
    scale = (_WIDTH_MM * _MM_TO_PT) / float(box.width)
    scaled_height_pt = float(box.height) * scale

    # Normalise a non-(0,0) MediaBox origin, scale to width, then place the
    # template's top-left corner 5 mm in from the page's top-left.
    placement = (
        Transformation()
        .translate(-float(box.left), -float(box.bottom))
        .scale(scale)
        .translate(_OFFSET_MM * _MM_TO_PT, _PAGE_H_PT - _OFFSET_MM * _MM_TO_PT - scaled_height_pt)
    )

    writer = PdfWriter()
    page = writer.add_blank_page(width=_PAGE_W_PT, height=_PAGE_H_PT)
    page.merge_transformed_page(template_page, placement)
    page.merge_page(PdfReader(BytesIO(overlay_pdf)).pages[0])

    output = BytesIO()
    writer.write(output)
    return output.getvalue()


def overlay_full_size(template_path: Path, page_overlays: list[bytes]) -> bytes:
    """
    Stamp each overlay over the matching page of `template_path` at full original
    size — no inset, no scaling — keeping each template page as the output page 1:1.

    `page_overlays[i]` is a single-page PDF drawn over template page `i`. Used by
    multi-page documents whose template pages are the output pages directly. Raises
    `FileNotFoundError` when the template file is absent.
    """
    # Clone the template into the writer first, then merge onto the writer's own
    # pages (the supported path; merging onto detached reader pages is unreliable).
    writer = PdfWriter(clone_from=str(template_path))
    for index, overlay_pdf in enumerate(page_overlays):
        writer.pages[index].merge_page(PdfReader(BytesIO(overlay_pdf)).pages[0])

    output = BytesIO()
    writer.write(output)
    return output.getvalue()
