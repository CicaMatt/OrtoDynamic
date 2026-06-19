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
from pathlib import Path

from apps.quotes.fpdf_canvas import FpdfCanvas
from apps.quotes.pdf_background import compose_on_template

# The template is a server-side asset shipped with the app (not user data and not
# a Django static file): a 1-page A4 PDF of the pre-printed form. It is absent
# from version control until supplied; the view turns a missing file into a clear
# error.
TEMPLATE_PATH = Path(__file__).resolve().parent / "assets" / "moduloconsega.pdf"


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
    return compose_on_template(overlay, template_path)


def _build_overlay(fields: DeliveryFormFields) -> bytes:
    """An A4 page carrying only the five stamped strings (no background fill)."""
    pdf = FpdfCanvas()
    pdf.set_font("", 9)

    # COGNOME first, then NOME flush after it with a 2 mm gap on the same baseline
    # (`get_x()` after a write is the pen position FPDF leaves: start + text width).
    pdf.write_at(92, 110, fields.cognome)
    pdf.set_xy(pdf.get_x() + 2, pdf.get_y())
    pdf.write(fields.nome)

    pdf.write_at(55, 115, fields.numero_autorizzazione)
    pdf.write_at(120, 115, fields.data_accettazione)
    pdf.write_at(40, 255, fields.data_generazione)

    return pdf.output()
