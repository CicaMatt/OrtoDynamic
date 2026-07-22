"""PDF documents owned by the Clients domain."""

from .privacy_form import (
    PrivacyFormFields,
    prepare_privacy_form_fields,
    privacy_form_filename,
    render_privacy_form,
)

__all__ = [
    "PrivacyFormFields",
    "prepare_privacy_form_fields",
    "privacy_form_filename",
    "render_privacy_form",
]
