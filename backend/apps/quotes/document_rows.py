"""Typed source rows passed from quote selectors to document preparation."""

from dataclasses import dataclass


@dataclass(frozen=True)
class QuoteDocumentItem:
    """Product and quote-line values consumed by DDT and Scheda preparation."""

    codice: str | None
    descrizione: str | None
    quantita: float | None
    prezzo: float | None
    importo: float | None
    sconto: float | None
