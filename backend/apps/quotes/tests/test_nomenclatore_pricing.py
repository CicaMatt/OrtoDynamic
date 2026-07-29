"""Nomenclatore-year and quote-line price snapshot contracts."""

from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest
from django.conf import settings
from django.db.models import Q

from apps.common.exceptions import NotFoundError, ServiceError
from apps.products.selectors import quote_product_search
from apps.quotes import selectors, services
from apps.quotes.api.serializers import QuoteItemCreateSerializer, QuoteItemSerializer
from apps.quotes.api.views import QuoteItemDetailView, QuoteItemProductSearchView


def _existing_quote_query():
    query = MagicMock()
    query.exists.return_value = True
    return query


def _product_query(product):
    query = MagicMock()
    query.first.return_value = product
    return query


def _created_item():
    return SimpleNamespace(id=11)


def _quote_item(**overrides):
    values = {
        "id": 11,
        "id_preventivo": 500,
        "codice_nomenclatore": 7,
        "quantita": 2.0,
        "prezzo": 40.0,
        "importo": 80.0,
        "sconto": 0.0,
        "save": MagicMock(),
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def test_active_nomenclatore_year_is_centralized_and_exact():
    assert settings.NOMENCLATORE_ACTIVE_YEAR == "2025"


def test_new_items_can_select_2025_nomenclatore_records():
    product = SimpleNamespace(id=7, codice="T-7", descrizione="Tutore", prezzo=40.0, anno="2025")
    item = _created_item()

    with (
        patch.object(services.Quote.objects, "filter", return_value=_existing_quote_query()),
        patch.object(
            services.Product.objects, "filter", return_value=_product_query(product)
        ) as product_filter,
        patch.object(services.QuoteItem.objects, "create", return_value=item) as create,
        patch.object(services, "recompute_quote_total"),
    ):
        result = services.create_quote_item(
            quote_id=500,
            product_id=7,
            quantity=2,
            discount=10,
        )

    assert result is item
    product_filter.assert_called_once_with(pk=7, anno="2025")
    create.assert_called_once_with(
        id_preventivo=500,
        codice_nomenclatore=7,
        quantita=2,
        prezzo=40.0,
        importo=72.0,
        sconto=10,
    )


@pytest.mark.parametrize("catalog_year", ["2024", "2026"])
def test_records_before_or_after_2025_are_rejected_for_new_items(catalog_year):
    product = SimpleNamespace(id=7, prezzo=40.0, anno=catalog_year)

    def filter_catalog(**filters):
        selected = product if filters == {"pk": 7, "anno": product.anno} else None
        return _product_query(selected)

    with (
        patch.object(services.Quote.objects, "filter", return_value=_existing_quote_query()),
        patch.object(services.Product.objects, "filter", side_effect=filter_catalog),
        patch.object(services.QuoteItem.objects, "create") as create,
        patch.object(services, "recompute_quote_total") as recompute,
        pytest.raises(ServiceError, match="nomenclatore 2025"),
    ):
        services.create_quote_item(
            quote_id=500,
            product_id=7,
            quantity=1,
            discount=0,
        )

    create.assert_not_called()
    recompute.assert_not_called()


def test_adding_an_item_to_an_existing_quote_still_rejects_non_2025_selection():
    historical = SimpleNamespace(id=7, prezzo=40.0, anno="2024")

    def filter_catalog(**filters):
        return _product_query(historical if filters.get("anno") == historical.anno else None)

    with (
        patch.object(services.Quote.objects, "filter", return_value=_existing_quote_query()),
        patch.object(services.Product.objects, "filter", side_effect=filter_catalog),
        patch.object(services.QuoteItem.objects, "create") as create,
        pytest.raises(ServiceError, match="nomenclatore 2025"),
    ):
        services.create_quote_item(
            quote_id=500,
            product_id=7,
            quantity=1,
            discount=None,
        )

    create.assert_not_called()


def test_existing_non_2025_items_remain_visible_and_identified_as_historical():
    product = SimpleNamespace(
        id=7,
        codice="OLD-7",
        descrizione="Tutore storico",
        prezzo=99.0,
        anno="2024",
    )
    item = _quote_item()
    item_query = MagicMock()
    item_query.order_by.return_value = [item]

    with (
        patch.object(selectors.QuoteItem.objects, "filter", return_value=item_query),
        patch.object(selectors.Product.objects, "in_bulk", return_value={7: product}),
    ):
        [visible_item] = selectors.quote_items_with_products(500)

    data = QuoteItemSerializer(visible_item).data
    assert data["productId"] == "7"
    assert data["productYear"] == "2024"
    assert data["isHistorical"] is True
    assert data["price"] == "40.0"
    assert data["catalogPrice"] == "99.0"


@pytest.mark.parametrize(
    ("quantity", "discount", "expected_amount"),
    [(3, 0, 120.0), (2, 25, 60.0)],
    ids=["quantity-edit", "discount-edit"],
)
def test_quantity_or_discount_edits_preserve_saved_historical_price(
    quantity, discount, expected_amount
):
    item = _quote_item()
    current_catalog = SimpleNamespace(id=7, prezzo=999.0, anno="2024")

    with (
        patch.object(
            services.Product.objects,
            "filter",
            return_value=_product_query(current_catalog),
        ) as product_filter,
        patch.object(services, "recompute_quote_total"),
    ):
        services.update_quote_item(
            quote_item=item,
            product_id=7,
            quantity=quantity,
            discount=discount,
        )

    product_filter.assert_called_once_with(pk=7)
    assert item.prezzo == 40.0
    assert item.importo == expected_amount
    item.save.assert_called_once_with(update_fields=["quantita", "sconto", "importo"])


def test_changing_nomenclatore_uses_the_new_selected_2025_price():
    item = _quote_item()
    replacement = SimpleNamespace(id=8, prezzo=12.5, anno="2025")

    with (
        patch.object(
            services.Product.objects,
            "filter",
            return_value=_product_query(replacement),
        ) as product_filter,
        patch.object(services, "recompute_quote_total"),
    ):
        services.update_quote_item(
            quote_item=item,
            product_id=8,
            quantity=3,
            discount=20,
        )

    product_filter.assert_called_once_with(pk=8, anno="2025")
    assert (item.codice_nomenclatore, item.prezzo, item.importo) == (8, 12.5, 30.0)
    item.save.assert_called_once_with(
        update_fields=["codice_nomenclatore", "prezzo", "quantita", "sconto", "importo"]
    )


@pytest.mark.parametrize("replacement_year", ["2024", "2026"])
def test_changing_nomenclatore_rejects_non_2025_replacements(replacement_year):
    item = _quote_item()
    replacement = SimpleNamespace(id=8, prezzo=12.5, anno=replacement_year)

    def filter_catalog(**filters):
        selected = replacement if filters.get("anno") == replacement.anno else None
        return _product_query(selected)

    with (
        patch.object(services.Product.objects, "filter", side_effect=filter_catalog),
        patch.object(services, "recompute_quote_total") as recompute,
        pytest.raises(ServiceError, match="nomenclatore 2025"),
    ):
        services.update_quote_item(
            quote_item=item,
            product_id=8,
            quantity=3,
            discount=20,
        )

    assert (item.codice_nomenclatore, item.prezzo) == (7, 40.0)
    item.save.assert_not_called()
    recompute.assert_not_called()


def test_updating_catalog_price_does_not_modify_an_existing_quote_item():
    item = _quote_item(prezzo=40.0)
    repriced_catalog = SimpleNamespace(id=7, prezzo=250.0, anno="2025")

    with (
        patch.object(
            services.Product.objects,
            "filter",
            return_value=_product_query(repriced_catalog),
        ),
        patch.object(services, "recompute_quote_total"),
    ):
        services.update_quote_item(
            quote_item=item,
            product_id=7,
            quantity=2,
            discount=0,
        )

    assert item.prezzo == 40.0
    assert item.importo == 80.0


def test_direct_api_request_cannot_bypass_year_or_manipulate_price():
    serializer = QuoteItemCreateSerializer(
        data={
            "productId": 7,
            "quantity": 2,
            "discount": None,
            "price": 0.01,
            "amount": 0.02,
        }
    )
    assert serializer.is_valid(), serializer.errors
    assert "price" not in serializer.validated_data
    assert "amount" not in serializer.validated_data

    historical = SimpleNamespace(id=7, prezzo=40.0, anno="2024")

    def filter_catalog(**filters):
        return _product_query(historical if filters.get("anno") == historical.anno else None)

    with (
        patch.object(services.Quote.objects, "filter", return_value=_existing_quote_query()),
        patch.object(services.Product.objects, "filter", side_effect=filter_catalog),
        patch.object(services.QuoteItem.objects, "create") as create,
        pytest.raises(ServiceError, match="nomenclatore 2025"),
    ):
        serializer.save(quote_id=500)

    create.assert_not_called()


def test_client_submitted_price_is_ignored_in_favor_of_2025_catalog_snapshot():
    serializer = QuoteItemCreateSerializer(
        data={"productId": 7, "quantity": 2, "discount": 0, "price": 0.01}
    )
    assert serializer.is_valid(), serializer.errors
    product = SimpleNamespace(id=7, prezzo=40.0, anno="2025")
    item = _created_item()

    with (
        patch.object(services.Quote.objects, "filter", return_value=_existing_quote_query()),
        patch.object(services.Product.objects, "filter", return_value=_product_query(product)),
        patch.object(services.QuoteItem.objects, "create", return_value=item) as create,
        patch.object(services, "recompute_quote_total"),
    ):
        serializer.save(quote_id=500)

    assert create.call_args.kwargs["prezzo"] == 40.0
    assert create.call_args.kwargs["importo"] == 80.0


def test_quote_totals_and_document_rows_use_saved_item_prices_and_amounts():
    item = _quote_item(prezzo=40.0, importo=72.0, sconto=10.0)
    item.product = SimpleNamespace(
        id=7,
        codice="T-7",
        descrizione="Tutore",
        prezzo=999.0,
        anno="2025",
    )

    with patch.object(selectors, "quote_items_with_products", return_value=[item]):
        [ddt_row] = selectors.ddt_item_rows(500)
        [scheda_row] = selectors.scheda_item_rows(500)

    assert (ddt_row.prezzo, ddt_row.importo) == (40.0, 72.0)
    assert (scheda_row.prezzo, scheda_row.importo) == (40.0, 72.0)

    item_sum = MagicMock()
    item_sum.aggregate.return_value = {"total": 72.0}
    quote_update = MagicMock()
    with (
        patch.object(services.QuoteItem.objects, "filter", return_value=item_sum),
        patch.object(services.Quote.objects, "filter", return_value=quote_update),
    ):
        assert services.recompute_quote_total(500) == 72.0
    quote_update.update.assert_called_once_with(totale=72.0)


def test_new_and_historical_searches_apply_only_the_allowed_year_scope():
    base_queryset = MagicMock()
    filtered_queryset = MagicMock()
    ordered_queryset = MagicMock()
    base_queryset.filter.return_value = filtered_queryset
    filtered_queryset.order_by.return_value = ordered_queryset

    with patch.object(
        services.Product.objects,
        "annotate",
        return_value=base_queryset,
    ):
        quote_product_search("tutore")

    text_match = (
        Q(id_text__startswith="tutore")
        | Q(codice__icontains="tutore")
        | Q(descrizione__icontains="tutore")
    )
    assert base_queryset.filter.call_args.args[0] == Q(anno="2025") & text_match

    historical_base = MagicMock()
    historical_filtered = MagicMock()
    historical_annotated = MagicMock()
    historical_ordered = MagicMock()
    historical_base.filter.return_value = historical_filtered
    historical_filtered.annotate.return_value = historical_annotated
    historical_annotated.order_by.return_value = historical_ordered
    with patch.object(
        services.Product.objects,
        "annotate",
        return_value=historical_base,
    ):
        quote_product_search("tutore", current_product_id=7)

    assert historical_base.filter.call_args.args[0] == ((Q(anno="2025") & text_match) | Q(pk=7))


def test_historical_edit_search_derives_current_id_from_item_and_scopes_ownership():
    item_query = MagicMock()
    item_query.first.return_value = SimpleNamespace(codice_nomenclatore=7)
    expected = object()
    view = QuoteItemProductSearchView()
    view.kwargs = {"pk": 500, "item_id": 11}
    view.request = SimpleNamespace(query_params={"q": "tutore"})

    with (
        patch(
            "apps.quotes.api.views.QuoteItem.objects.filter", return_value=item_query
        ) as item_filter,
        patch("apps.quotes.api.views.quote_product_search", return_value=expected) as search,
    ):
        assert view.get_queryset() is expected

    item_filter.assert_called_once_with(pk=11, id_preventivo=500)
    search.assert_called_once_with("tutore", current_product_id=7)


def test_historical_edit_search_rejects_an_item_from_another_quote():
    item_query = MagicMock()
    item_query.first.return_value = None
    view = QuoteItemProductSearchView()
    view.kwargs = {"pk": 500, "item_id": 99}
    view.request = SimpleNamespace(query_params={"q": "tutore"})

    with (
        patch("apps.quotes.api.views.QuoteItem.objects.filter", return_value=item_query),
        pytest.raises(NotFoundError, match="Articolo inesistente"),
    ):
        view.get_queryset()


def test_item_updates_and_deletes_are_scoped_by_item_and_quote_id():
    queryset = object()
    view = QuoteItemDetailView()
    view.kwargs = {"pk": 500, "item_id": 11}

    with patch(
        "apps.quotes.api.views.QuoteItem.objects.filter", return_value=queryset
    ) as item_filter:
        assert view.get_queryset() is queryset

    item_filter.assert_called_once_with(pk=11, id_preventivo=500)


@pytest.mark.parametrize(
    ("quantity", "discount", "message"),
    [
        (0, 0, "quantità"),
        (-1, 0, "quantità"),
        (1, -0.01, "sconto"),
        (1, 100.01, "sconto"),
    ],
)
def test_service_rejects_invalid_quantity_and_discount(quantity, discount, message):
    with pytest.raises(ServiceError, match=message):
        services._validated_line_values(quantity, discount)


def test_service_rejects_a_negative_catalog_price():
    product = SimpleNamespace(id=7, prezzo=-0.01, anno="2025")
    with (
        patch.object(services.Product.objects, "filter", return_value=_product_query(product)),
        pytest.raises(ServiceError, match="prezzo.*negativo"),
    ):
        services._active_product(7)
