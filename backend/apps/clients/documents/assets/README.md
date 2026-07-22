# Client document assets

## `privacy.pdf` (required)

The privacy-form generator (`apps.clients.documents.privacy_form`) stamps the
client's first name, surname and generation date onto this pre-printed form.

- The template must contain one A4 page (MediaBox about 595.25 × 842 pt).
- It is positioned 5 mm from the top-left and scaled to 200 mm wide.
- If it is absent, `GET /api/v1/clients/<id>/privacy-form/` returns the existing
  template-missing error response.
