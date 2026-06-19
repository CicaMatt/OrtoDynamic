"""
Build the "Modulo di privacy" consent form for a client.

A coordinate overlay (like the consegna form) that stamps three values onto the
pre-printed ``assets/privacy.pdf`` background, reproducing the legacy FPDF + FPDI
script. Unlike the other generators this document is keyed on a **client**, not a
quote, but it lives here alongside the rest of the PDF document generators and
their shared template assets (the original `generaPdf.php` was a single hub for
all document types). The client-scoped HTTP endpoint lives in `apps.clients`.

`prepare_privacy_form_fields` turns a client into the three display strings (pure,
DB/HTTP-free); `render_privacy_form` stamps them over the template and returns the
PDF bytes (template path injectable for testing).
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from pathlib import Path

from apps.quotes.fpdf_canvas import FpdfCanvas
from apps.quotes.pdf_background import compose_on_template

TEMPLATE_PATH = Path(__file__).resolve().parent / "assets" / "privacy.pdf"


@dataclass(frozen=True)
class PrivacyFormFields:
    """The three display strings stamped onto the form."""

    nome: str
    cognome: str
    generated_date: str  # today as "DD-MM-YY" (dashes, 2-digit year)


def prepare_privacy_form_fields(client, *, today: date) -> PrivacyFormFields:
    """
    Map a client onto the form's display strings: first name and surname
    upper-cased, and today's date as ``DD-MM-YY``. `today` is injected so the
    caller owns the clock (``timezone.localdate()`` in the view), keeping this pure.
    """
    return PrivacyFormFields(
        nome=(client.nome or "").upper(),
        cognome=(client.cognome or "").upper(),
        generated_date=today.strftime("%d-%m-%y"),
    )


def privacy_form_filename(client) -> str:
    """Suggested file name ``modulo-privacy-<id>.pdf``."""
    return f"modulo-privacy-{client.id}.pdf"


def render_privacy_form(
    fields: PrivacyFormFields, *, template_path: Path = TEMPLATE_PATH
) -> bytes:
    """
    Stamp `fields` over the template and return the PDF bytes. Raises
    `FileNotFoundError` when the template asset is absent (surfaced by the caller).
    """
    pdf = FpdfCanvas()
    pdf.set_font("", 9)
    # NOME is printed first; COGNOME sits at a fixed X = 100 on the same baseline
    # (not flowing after NOME), reversed vs. the other forms — kept as the original.
    pdf.write_at(40, 233, fields.nome)
    pdf.write_at(100, 233, fields.cognome)
    pdf.write_at(40, 249, fields.generated_date)
    return compose_on_template(pdf.output(), template_path)
