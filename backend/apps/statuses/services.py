"""
Read-only workflow queries over the `stato` / `stato_check` tables.

A domain identifies its rows by a table key (e.g. "PREVENTIVI"). Given that key
and a current state, these helpers report the permitted next states — driven
entirely by the database, with no rules hard-coded here.
"""
from apps.statuses.models import Status, StatusTransition


def valid_states(table):
    """State names defined for `table`, in the table's natural (id) order."""
    return list(
        Status.objects.filter(tabella=table).order_by("id").values_list("nome", flat=True)
    )


def allowed_target_states(table, current_state):
    """
    Distinct states reachable from `current_state` for `table`.

    A target is allowed when a `stato_check` row links the two for this table and
    the target is itself a defined state. The result is de-duplicated (the rules
    table may repeat a pair) and ordered by the state table's natural order.
    """
    rank = {name: index for index, name in enumerate(valid_states(table))}
    targets = StatusTransition.objects.filter(
        tabella_check=table, stato_partenza=current_state
    ).values_list("stato_arrivo", flat=True)
    allowed = {target for target in targets if target in rank}
    return sorted(allowed, key=rank.__getitem__)


def is_transition_allowed(table, current_state, target_state):
    """Whether `current_state` → `target_state` is permitted for `table`."""
    return target_state in allowed_target_states(table, current_state)
