"""
Build the "Modulo di consegna" delivery form for a quote.

A single A4 page generated entirely in code: the shared company letterhead followed
by the recipient and the delivery details. The public functions are pure and free
of HTTP/DB concerns, so the view stays thin and both can be unit tested in
isolation: `prepare_delivery_form_fields` turns a quote and its client into the
display strings, and `render_delivery_form` lays them out and returns the PDF bytes.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from .fpdf_canvas import FpdfCanvas
from .pdf_layout import label_value, new_titled_document, signature_footer


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


def render_delivery_form(fields: DeliveryFormFields) -> bytes:
    """Lay the delivery form out on a code-drawn A4 page and return the PDF bytes."""
    pdf = new_titled_document("Modulo di Consegna")
    pdf.ln(8)

    pdf.set_font("", 11)
    pdf.cell(0, 6, "Si attesta la consegna della fornitura ortopedica a:", 0, 1)
    pdf.ln(2)

    full_name = f"{fields.cognome} {fields.nome}".strip()
    _field_row(pdf, "Cognome e Nome:", full_name, value_bold=True)
    _field_row(pdf, "Nº Autorizzazione:", fields.numero_autorizzazione)
    _field_row(pdf, "Data Accettazione:", fields.data_accettazione)

    pdf.ln(24)
    signature_footer(pdf, date_text=fields.data_generazione,
                     sign_label="Firma per ricevuta:", size=11)

    return pdf.output()


def _field_row(pdf: FpdfCanvas, label: str, value: str, *, value_bold: bool = False) -> None:
    """This form's wider (48 mm / 11 pt) label/value row."""
    label_value(pdf, label, value, label_w=48, size=11, height=7, value_bold=value_bold)
