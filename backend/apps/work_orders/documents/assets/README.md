# Work-order document assets

## `schedacollaudi.pdf` (required)

The Collaudi generator (`apps.work_orders.documents.collaudi`) stamps work-order
data onto this two-page pre-printed sheet.

- The template must contain two A4 pages (MediaBox about 595.32 × 842.04 pt).
- Each page is used at its full original size, without inset or scaling.
- If it is absent, `GET /api/v1/work-orders/<id>/collaudi/` returns the existing
  template-missing error response.
