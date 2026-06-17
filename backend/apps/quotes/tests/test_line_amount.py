"""
Tests for quote-line amount computation — the discount rule applied to `importo`.

These exercise pure arithmetic only (no database), so they run without the
legacy database being reachable, like the rest of the suite.
"""
from apps.quotes.services import line_amount


def test_no_discount_is_price_times_quantity():
    assert line_amount(10.0, 3, None) == 30.0


def test_discount_reduces_amount_by_percent():
    # 50 × 2 = 100, less 25% → 75.
    assert line_amount(50.0, 2, 25) == 75.0


def test_full_discount_zeroes_the_amount():
    assert line_amount(40.0, 2, 100) == 0.0


def test_amount_is_rounded_to_cents():
    # 9.99 × 3 = 29.97, less 10% → 26.973 → 26.97.
    assert line_amount(9.99, 3, 10) == 26.97


def test_missing_quantity_yields_no_amount():
    assert line_amount(10.0, None, 20) is None


def test_missing_price_yields_no_amount():
    assert line_amount(None, 5, 20) is None
