"""Small database-level guards for concurrent writes."""

from contextlib import contextmanager
from hashlib import sha256

from django.db import connection, transaction

from apps.common.exceptions import ConflictError


MYSQL_LOCK_TIMEOUT_SECONDS = 5


def _mysql_lock_name(table: str, record_id) -> str:
    name = f"ortodynamic:{table}:{record_id}"
    if len(name) <= 64:
        return name
    return f"ortodynamic:{sha256(name.encode()).hexdigest()[:51]}"


@contextmanager
def database_update_lock(table: str, record_id):
    """
    Serialize updates to one legacy row.

    The transaction lets update views use ``SELECT FOR UPDATE`` on transactional
    engines. MySQL additionally needs a named advisory lock because some deployed
    legacy tables may still use MyISAM, where row locks are not available.
    """
    with transaction.atomic():
        if connection.vendor != "mysql":
            yield
            return

        lock_name = _mysql_lock_name(table, record_id)
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT GET_LOCK(%s, %s)",
                [lock_name, MYSQL_LOCK_TIMEOUT_SECONDS],
            )
            acquired = cursor.fetchone()
            if not acquired or acquired[0] != 1:
                raise ConflictError("Risorsa in aggiornamento. Riprova tra pochi secondi.")
            try:
                yield
            finally:
                cursor.execute("SELECT RELEASE_LOCK(%s)", [lock_name])
