"""
PDF documents owned by the Quotes domain.

Each generator is a self-contained module exposing a pure ``prepare_*`` (build the
document's display values from domain objects, free of DB/HTTP concerns), a
``render_*`` (lay those out and return the PDF bytes) and a ``*_filename`` helper.
The generators use the reusable drawing and compositing primitives in
``apps.common.documents``.

This module is the package's public interface: application code imports the
generators from ``apps.quotes.documents``, not from the individual modules. (Tests
target the submodules directly, since they also exercise internal helpers.)
"""
from .ddt import DdtDocument, DdtItem, ddt_filename, prepare_ddt, render_ddt
from .delivery_form import (
    DeliveryFormFields,
    delivery_form_filename,
    prepare_delivery_form_fields,
    render_delivery_form,
)
from apps.quotes.document_rows import QuoteDocumentItem
from .scheda import (
    SchedaDocument,
    SchedaItem,
    prepare_scheda,
    render_scheda,
    scheda_filename,
)

__all__ = [
    "DdtDocument",
    "DdtItem",
    "ddt_filename",
    "prepare_ddt",
    "render_ddt",
    "DeliveryFormFields",
    "delivery_form_filename",
    "prepare_delivery_form_fields",
    "render_delivery_form",
    "QuoteDocumentItem",
    "SchedaDocument",
    "SchedaItem",
    "prepare_scheda",
    "render_scheda",
    "scheda_filename",
]
