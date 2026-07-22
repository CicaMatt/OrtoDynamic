# Quote document assets

Assets used only by PDF generators in `apps.quotes.documents`.

The Modulo di consegna and Scheda Progetto are drawn entirely in code and no
longer use their former pre-printed templates (`moduloconsega.pdf` and
`scheda.pdf`). The shared company logo lives beside the reusable letterhead in
`apps.common.documents/assets/logo.png`.

## `firma.png`

The technician's facsimile signature is stamped in the Scheda Progetto closing
block (`apps.quotes.documents.scheda`). Its box is about 15 mm wide and preserves
the image's aspect ratio.

## `ddt.pdf` (optional)

The DDT generator (`apps.quotes.documents.ddt`) normally draws on a blank A4 page.
If a `ddt.pdf` is placed at:

    backend/apps/quotes/documents/assets/ddt.pdf

it is used as the background, positioned 5 mm from the top-left and scaled to
200 mm wide. Its absence is not an error.
