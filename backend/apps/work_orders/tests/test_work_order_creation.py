"""
Tests for the pure parts of work-order creation.

The DB orchestration (`create_work_order_from_quote`) writes to legacy, unmanaged
tables that the test database does not create, so — like the rest of the suite — it
is not exercised here; it is verified against the live database. These cover the
decision logic that is pure: which states spawn a work order, and how a catalogue
code is coerced into the `bigint` column.
"""
from apps.work_orders.services import WORK_ORDER_TRIGGER_STATES, _code_to_int


def test_both_in_lavorazione_states_trigger_creation():
    assert "IN LAVORAZIONE" in WORK_ORDER_TRIGGER_STATES
    assert "IN LAVORAZIONE SENZA AUTORIZZAZIONE" in WORK_ORDER_TRIGGER_STATES


def test_other_states_do_not_trigger_creation():
    for state in ("ACCETTATO", "SOSPESO", "CONSEGNATO", "AUTORIZZATO", ""):
        assert state not in WORK_ORDER_TRIGGER_STATES


def test_code_to_int_strips_leading_zeros_like_the_legacy_insert():
    assert _code_to_int("01012105") == 1012105
    assert _code_to_int("122403109") == 122403109


def test_code_to_int_passes_through_an_integer():
    assert _code_to_int(122403109) == 122403109


def test_code_to_int_returns_none_for_missing_or_non_numeric():
    assert _code_to_int(None) is None
    assert _code_to_int("") is None
    assert _code_to_int("ABC-1") is None
