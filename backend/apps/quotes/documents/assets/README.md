# Document generator assets

Assets used by the PDF generators in `apps.quotes.documents`. There are two kinds:
**image assets** drawn onto the code-generated documents, and **PDF templates**
overlaid as a page background behind a coordinate overlay.

> The "Modulo di consegna" and "Scheda Progetto" are now drawn entirely in code and
> no longer use a pre-printed background, so their former templates
> (`moduloconsega.pdf`, `scheda.pdf`) have been removed.

## Image assets

### `logo.png`

The company logo in the shared letterhead (`apps.quotes.documents.letterhead`),
drawn at the top-left of every code-generated document (consegna, DDT, scheda).

### `firma.png`

The technician's facsimile signature stamped in the Scheda Progetto closing block
(`apps.quotes.documents.scheda`). Its box is ~15 mm wide and the height preserves the
image's aspect ratio, so it is never distorted.

## PDF templates

A template is laid down as the page background and the generator stamps values over
it at calibrated coordinates — so a different background will not line up.

### `ddt.pdf` (optional)

The DDT generator (`apps.quotes.documents.ddt`) builds its layout programmatically on
a **blank A4 page** — the normal case, no asset required. If a `ddt.pdf` is dropped
here:

    backend/apps/quotes/documents/assets/ddt.pdf

it is drawn as the page background behind the generated content (top-left at
(5 mm, 5 mm), scaled to 200 mm wide). Its absence is not an error;
`GET /api/v1/quotes/<id>/ddt/` simply renders on a blank page.

### `privacy.pdf` (required)

The "Modulo di privacy" generator (`apps.quotes.documents.privacy_form`) stamps a
client's first name, surname and today's date onto this pre-printed consent form:

    backend/apps/quotes/documents/assets/privacy.pdf

Requirements:

- **1 page**, **A4** (MediaBox ≈ 595.25 × 842 pt).
- Placed top-left at (5 mm, 5 mm), scaled to 200 mm wide.

This document is keyed on a **client** (the generator lives here with the other PDF
documents, but the endpoint is `GET /api/v1/clients/<id>/privacy-form/`). When the
file is absent that endpoint returns HTTP 500 with the message "Modello del modulo
di privacy non disponibile."

### `schedacollaudi.pdf` (required)

The "Scheda valutazione rischi e collaudi" generator (`apps.quotes.documents.collaudi`)
stamps work-order data onto this **2-page** pre-printed sheet:

    backend/apps/quotes/documents/assets/schedacollaudi.pdf

Requirements:

- **2 pages**, each **A4** (MediaBox ≈ 595.32 × 842.04 pt).
- Unlike the other templates, each page is used at **full original size** (no 5 mm
  inset, no 200 mm scaling) — the overlay is drawn directly on the full-size page.

This document is keyed on a **work order** (the generator lives here, but the endpoint
is `GET /api/v1/work-orders/<id>/collaudi/`). When the file is absent that endpoint
returns HTTP 500 with the message "Modello della scheda collaudi non disponibile."
