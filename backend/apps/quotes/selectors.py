"""
Read-side queries for the quotes app.

These selectors load a quote's line items together with their catalogue product in a
fixed number of queries (no per-row lookups) and shape them into the plain rows the
PDF document generators consume. Keeping the data access here lets the views stay
thin and the `apps.quotes.documents` generators stay pure — they accept any object
exposing the documented fields, with no knowledge of the ORM.
"""
from __future__ import annotations

from types import SimpleNamespace

from apps.products.models import Product
from apps.quotes.models import QuoteItem


def _items_with_products(quote_id):
    """
    A quote's line items, each paired with its catalogue product (``None`` when the
    product no longer exists), ordered by id. The products are fetched in one query.
    """
    items = list(QuoteItem.objects.filter(id_preventivo=quote_id).order_by("id"))
    product_ids = {item.codice_nomenclatore for item in items if item.codice_nomenclatore}
    products = {product.id: product for product in Product.objects.filter(id__in=product_ids)}
    return [(item, products.get(item.codice_nomenclatore)) for item in items]


def ddt_item_rows(quote_id):
    """
    The quote's line items as DDT rows (`codice`, `descrizione`, `quantita`,
    `prezzo`, `importo`). A line whose product is gone keeps a null code/description
    — the LEFT JOIN of the original query — so it still prints with its quantity.
    """
    return [
        SimpleNamespace(
            codice=product.codice if product else None,
            descrizione=product.descrizione if product else None,
            quantita=item.quantita,
            prezzo=item.prezzo,
            importo=item.importo,
        )
        for item, product in _items_with_products(quote_id)
    ]


def scheda_item_rows(quote_id):
    """
    The quote's line items as Scheda Progetto rows (`codice`/`descrizione` from the
    product, the money columns from the line). A line whose product is missing is
    dropped — the INNER JOIN of the original query.
    """
    return [
        SimpleNamespace(
            codice=product.codice,
            descrizione=product.descrizione,
            prezzo=item.prezzo,
            quantita=item.quantita,
            importo=item.importo,
            sconto=item.sconto,
        )
        for item, product in _items_with_products(quote_id)
        if product is not None
    ]
