"""Quote business operations that go beyond plain field updates."""
from apps.common.exceptions import ConflictError
from apps.statuses.services import allowed_target_states


def change_quote_status(quote, target_status):
    """
    Move `quote` to `target_status`, enforcing the PREVENTIVI transition rules.

    The allowed transitions come entirely from the `stato_check` table (via
    `apps.statuses`). Raises `ConflictError` when the move is not permitted from
    the quote's current state; on success persists only the status column.
    """
    if target_status not in allowed_target_states(quote.STATUS_TABLE, quote.stato):
        raise ConflictError(
            f"Transizione di stato non consentita da «{quote.stato or '—'}» a «{target_status}»."
        )
    quote.stato = target_status
    quote.save(update_fields=["stato"])
    return quote
