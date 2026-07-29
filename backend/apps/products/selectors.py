"""Read-side catalogue queries shared by product and quote APIs."""

from django.conf import settings
from django.db.models import Case, CharField, IntegerField, Q, Value, When
from django.db.models.functions import Cast

from apps.products.models import Product


# Cap type-ahead results: enough to scan, small enough to keep each request fast.
PRODUCT_SEARCH_LIMIT = 25


def quote_product_search(query, *, current_product_id=None):
    """
    Products selectable for a quote line.

    New lines receive exact active-year matches only. An existing line may also
    receive its own currently selected row regardless of year, so historical
    references stay visible without exposing unrelated catalogue editions.
    """
    query = query.strip()
    if not query and current_product_id is None:
        return Product.objects.none()

    text_match = (
        Q(id_text__startswith=query) | Q(codice__icontains=query) | Q(descrizione__icontains=query)
    )
    selectable = Q(anno=settings.NOMENCLATORE_ACTIVE_YEAR) & text_match
    if current_product_id is not None:
        # The current row is deliberately not constrained by the search text: it
        # remains available as the safe "keep historical selection" option.
        selectable |= Q(pk=current_product_id)

    queryset = Product.objects.annotate(id_text=Cast("id", output_field=CharField())).filter(
        selectable
    )
    if current_product_id is not None:
        # Keep the saved row inside the capped response even when its id sorts
        # after many active matches.
        queryset = queryset.annotate(
            current_selection_order=Case(
                When(pk=current_product_id, then=Value(0)),
                default=Value(1),
                output_field=IntegerField(),
            )
        ).order_by("current_selection_order", "id")
    else:
        queryset = queryset.order_by("id")
    return queryset[:PRODUCT_SEARCH_LIMIT]
