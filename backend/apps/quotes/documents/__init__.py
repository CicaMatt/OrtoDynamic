"""
PDF document generation for the quotes app.

Each generator is a self-contained module exposing a pure ``prepare_*`` (build the
document's display values from domain objects, free of DB/HTTP concerns), a
``render_*`` (lay those out and return the PDF bytes) and a ``*_filename`` helper.
The shared drawing primitives — ``fpdf_canvas`` (the FPDF-compatible canvas),
``pdf_layout`` (reusable layout blocks), ``letterhead`` and ``pdf_background``
(template compositing) — are internal to this package.

This module is the package's public interface: application code imports the
generators from ``apps.quotes.documents``, not from the individual modules. (Tests
target the submodules directly, since they also exercise internal helpers.)
"""
from .collaudi import (
    CollaudiDocument,
    CollaudiMaterial,
    CollaudiPeriodicCheck,
    collaudi_filename,
    prepare_collaudi,
    render_collaudi,
)
from .ddt import DdtDocument, DdtItem, ddt_filename, prepare_ddt, render_ddt
from .delivery_form import (
    DeliveryFormFields,
    delivery_form_filename,
    prepare_delivery_form_fields,
    render_delivery_form,
)
from .privacy_form import (
    PrivacyFormFields,
    prepare_privacy_form_fields,
    privacy_form_filename,
    render_privacy_form,
)
from .scheda import (
    SchedaDocument,
    SchedaItem,
    prepare_scheda,
    render_scheda,
    scheda_filename,
)

__all__ = [
    "CollaudiDocument",
    "CollaudiMaterial",
    "CollaudiPeriodicCheck",
    "collaudi_filename",
    "prepare_collaudi",
    "render_collaudi",
    "DdtDocument",
    "DdtItem",
    "ddt_filename",
    "prepare_ddt",
    "render_ddt",
    "DeliveryFormFields",
    "delivery_form_filename",
    "prepare_delivery_form_fields",
    "render_delivery_form",
    "PrivacyFormFields",
    "prepare_privacy_form_fields",
    "privacy_form_filename",
    "render_privacy_form",
    "SchedaDocument",
    "SchedaItem",
    "prepare_scheda",
    "render_scheda",
    "scheda_filename",
]
