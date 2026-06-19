# Quotes app assets

## `moduloconsega.pdf` (required, not yet in version control)

The "Modulo di consegna" generator (`apps.quotes.delivery_form`) stamps five
values onto this file as the page background. Drop the pre-printed template here:

    backend/apps/quotes/assets/moduloconsega.pdf

Requirements for the file:

- **1 page**, **A4 portrait** (MediaBox 595 × 842 pt).
- It is the same scanned/pre-printed form the legacy PHP/FPDI script used. The
  overlay coordinates are calibrated to it — a different background will not line
  up.

It is placed at (5 mm, 5 mm) from the top-left and scaled to 200 mm wide (≈ 95.2 %)
with its aspect ratio preserved, matching the original `useTemplate(tpl, 5, 5, 200)`.

Until the file is present, `GET /api/v1/quotes/<id>/delivery-form/` returns HTTP
500 with the message "Modello del modulo di consegna non disponibile."

## `ddt.pdf` (optional)

The DDT generator (`apps.quotes.ddt`) builds its layout programmatically on a
**blank A4 page** — this is the normal case, and no asset is required. If a
`ddt.pdf` is dropped here:

    backend/apps/quotes/assets/ddt.pdf

it is drawn as the page background behind the generated content, with the same
1-page A4 placement as `moduloconsega.pdf` (top-left at (5 mm, 5 mm), scaled to
200 mm wide). Its absence is not an error; `GET /api/v1/quotes/<id>/ddt/` simply
renders on a blank page.

## `scheda.pdf` (required, not yet in version control)

The "Scheda Progetto" generator (`apps.quotes.scheda`) stamps header fields, the
diagnosi/protesi blocks and a line-items table onto this pre-printed form. Drop it
here:

    backend/apps/quotes/assets/scheda.pdf

Requirements:

- **Page 1** is used (the file may have more pages). **A4** (MediaBox ≈ 595.5 × 842 pt).
- Same placement as the other overlays: top-left at (5 mm, 5 mm), scaled to 200 mm
  wide. The overlay coordinates are calibrated to it — a different background will
  not line up.

Until the file is present, `GET /api/v1/quotes/<id>/scheda/` returns HTTP 500 with
the message "Modello della scheda progetto non disponibile."

## `privacy.pdf` (required, not yet in version control)

The "Modulo di privacy" generator (`apps.quotes.privacy_form`) stamps a client's
first name, surname and today's date onto this pre-printed consent form. Drop it
here:

    backend/apps/quotes/assets/privacy.pdf

Requirements:

- **1 page**, **A4** (MediaBox ≈ 595.25 × 842 pt).
- Same placement as the other overlays: top-left at (5 mm, 5 mm), scaled to 200 mm
  wide. The overlay coordinates are calibrated to it.

This document is keyed on a **client** (the form generator lives with the other PDF
documents, but the endpoint is `GET /api/v1/clients/<id>/privacy-form/`). Until the
file is present that endpoint returns HTTP 500 with the message "Modello del modulo
di privacy non disponibile."
