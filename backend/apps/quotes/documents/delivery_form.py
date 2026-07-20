"""Build the "Modulo di consegna" delivery form for a quote."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from .fpdf_canvas import FpdfCanvas
from .formatting import date_long_slash, date_short_slash, upper_or_empty
from .letterhead import CONTENT_TOP_MM, write_letterhead

BODY_LEFT = 20.0
BODY_WIDTH = 170.0
RECIPIENT_LEFT = 142.0
SUBJECT_TOP = 94.0
BODY_TOP = 118.0
BODY_FONT_SIZE = 11.0
SIGNATURE_TITLE_FONT_SIZE = 11.0
STATIC_AUTHORIZATION_DATE = "01/01/70"


@dataclass(frozen=True)
class DeliveryFormFields:
    """Display strings stamped onto the form, already formatted."""

    cognome: str
    nome: str
    data_nascita: str    # "DD/MM/YY", or "" when unset
    numero_autorizzazione: str
    data_accettazione: str  # "DD/MM/YY", or "" when unset
    data_generazione: str   # today as "DD/MM/YYYY"


def prepare_delivery_form_fields(quote, client, *, today: date) -> DeliveryFormFields:
    """
    Map a quote and its client onto the form's display strings.

    Names are upper-cased (empty when the client row is missing); dates render as
    ``DD/MM/YY`` where they fill legacy blanks, and the generation date as
    ``DD/MM/YYYY``. `today` is passed in so the caller owns the clock
    (``timezone.localdate()`` in the view), keeping this function pure.
    """
    cognome = upper_or_empty(client.cognome) if client is not None else ""
    nome = upper_or_empty(client.nome) if client is not None else ""
    data_nascita = date_short_slash(client.data_nascita) if client is not None else ""
    return DeliveryFormFields(
        cognome=cognome,
        nome=nome,
        data_nascita=data_nascita,
        numero_autorizzazione=quote.numero_autorizzazione or "",
        data_accettazione=date_short_slash(quote.data_accettazione),
        data_generazione=date_long_slash(today),
    )


def delivery_form_filename(quote, today: date) -> str:
    """Suggested file name ``modulo-consegna-YYMMDD.pdf``, keyed on the quote date."""
    basis = quote.data_preventivo or today
    return f"modulo-consegna-{basis:%y%m%d}.pdf"


def render_delivery_form(fields: DeliveryFormFields) -> bytes:
    """Lay the delivery form out as regular document text."""
    pdf = FpdfCanvas()
    write_letterhead(pdf)
    _write_delivery_form(pdf, fields)
    return pdf.output()


def _write_delivery_form(pdf: FpdfCanvas, fields: DeliveryFormFields) -> None:
    _write_recipient(pdf)
    _write_subject(pdf, fields)
    _write_body(pdf)
    _write_signature_area(pdf, fields)


def _write_recipient(pdf: FpdfCanvas) -> None:
    pdf.set_font("", BODY_FONT_SIZE)
    pdf.set_xy(RECIPIENT_LEFT, CONTENT_TOP_MM + 2)
    pdf.cell(28, 7, "Spett. Asl", 0, 0)
    pdf.cell(0, 7, "distretto", 0, 1)
    pdf.set_xy(RECIPIENT_LEFT + 4, CONTENT_TOP_MM + 13)
    pdf.cell(0, 7, "Ufficio Riabilitazione", 0, 1)


def _write_subject(pdf: FpdfCanvas, fields: DeliveryFormFields) -> None:
    full_name = f"{fields.cognome} {fields.nome}".strip()
    authorization = fields.numero_autorizzazione or ""

    pdf.set_font("", BODY_FONT_SIZE)
    pdf.set_xy(BODY_LEFT, SUBJECT_TOP)
    _line_with_centered_field(
        pdf,
        "Oggetto: fornitura Ortopedica del paziente",
        full_name,
        field_width=92,
    )
    _authorization_line(pdf, authorization)


def _write_body(pdf: FpdfCanvas) -> None:
    pdf.set_font("", BODY_FONT_SIZE)
    pdf.set_xy(BODY_LEFT, BODY_TOP)
    paragraphs = [
        (
            "Comunicasi ai sensi del D.M. 02/03/1984, che in data odierna è stato "
            "consegnato il presidio di cui autorizzazione in oggetto. Pertanto "
            "trascorsi 20 g. da oggi, nulla ricevendo ai sensi del D.L. 15/02/1984, "
            "emetteremo fattura per la liquidazione. L’assistito cui la presente è "
            "stata consegnata, unitamente al presidio dichiara, sottoscrivendo, di "
            "non aver versato alcuna somma a nessun titolo, di essere a conoscenza "
            "e di autorizzare l’immissione del suo nominativo in archivio clienti "
            "e di aver ricevuto l’attestato di conformità e le istruzioni uso e "
            "manutenzione del presidio."
        ),
        (
            "Egli si impegna, inoltre, ad effettuare il collaudo entro 5gg ai sensi "
            "del D.L. 15/02/1984."
        ),
        (
            "Ortodynamic srl tratterà i dati secondo i diritti previsti dall’art. 7 "
            "del D.Lgs 196/2003. Il cliente potrà in ogni momento chiedere rettifica, "
            "accesso, integrazione, cancellazione o opposizione formulando richiesta "
            "scritta ad ORTODYNAMIC srl via Filettine,12-14 Pagani 84016 SA"
        ),
    ]
    for index, paragraph in enumerate(paragraphs):
        pdf.set_xy(BODY_LEFT, pdf.get_y())
        pdf.multi_cell(BODY_WIDTH, 6, paragraph)
        pdf.ln(3 if index != 2 else 10)


def _write_signature_area(pdf: FpdfCanvas, fields: DeliveryFormFields) -> None:
    pdf.ln(10)
    pdf.set_font("B", SIGNATURE_TITLE_FONT_SIZE)
    _line(pdf, "Letto integralmente, confermato e sottoscritto:")
    pdf.set_font("", BODY_FONT_SIZE)
    pdf.ln(12)
    _line(pdf, "L’assistito o chi ne fa le veci_______________________________")
    pdf.ln(12)
    _line(pdf, "Grado di parentela__________________________________________")
    pdf.ln(10)
    _pagani_date_line(pdf, fields.data_generazione)


def _line(pdf: FpdfCanvas, text: str) -> None:
    pdf.set_xy(BODY_LEFT, pdf.get_y())
    pdf.cell(BODY_WIDTH, 7, text, 0, 1)


def _line_with_centered_field(
    pdf: FpdfCanvas,
    label: str,
    value: str,
    *,
    field_width: float,
) -> None:
    pdf.set_xy(BODY_LEFT, pdf.get_y())
    pdf.cell(BODY_WIDTH - field_width, 7, label, 0, 0)
    field_x = pdf.get_x()
    field_y = pdf.get_y()
    pdf.cell(field_width, 7, value, 0, 1, "C")
    pdf.hline(field_x, field_y + 5.2, field_x + field_width)


def _authorization_line(pdf: FpdfCanvas, authorization: str) -> None:
    pdf.set_xy(BODY_LEFT, pdf.get_y())
    pdf.cell(38, 7, "Autorizzazione n", 0, 0)
    _centered_underlined_cell(pdf, authorization, width=54)
    pdf.cell(10, 7, "del", 0, 0, "C")
    _centered_underlined_cell(pdf, STATIC_AUTHORIZATION_DATE, width=50, ln=1)


def _centered_underlined_cell(
    pdf: FpdfCanvas,
    value: str,
    *,
    width: float,
    ln: int = 0,
) -> None:
    field_x = pdf.get_x()
    field_y = pdf.get_y()
    pdf.cell(width, 7, value, 0, ln, "C")
    pdf.hline(field_x, field_y + 5.2, field_x + width)


def _pagani_date_line(pdf: FpdfCanvas, date_text: str) -> None:
    pdf.set_xy(BODY_LEFT, pdf.get_y())
    pdf.cell(15, 7, "Pagani", 0, 0)
    _centered_underlined_cell(pdf, date_text, width=38, ln=1)
