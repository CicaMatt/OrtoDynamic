"""Parity fixtures for the authoritative quote-line amount calculation."""

import pytest

from apps.quotes.services import line_amount


PARITY_CASES = [
    (10.0, 3, None, 30.0),
    (50.0, 2, 25, 75.0),
    (40.0, 2, 100, 0.0),
    (9.99, 3, 10, 26.97),
    (1.005, 1, None, 1.01),
    (10.0, None, 20, None),
    (None, 5, 20, None),
]


@pytest.mark.parametrize(("price", "quantity", "discount", "expected"), PARITY_CASES)
def test_line_amount_parity_cases(price, quantity, discount, expected):
    assert line_amount(price, quantity, discount) == expected
