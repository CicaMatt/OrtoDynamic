"""Concurrency contracts for the shared database update guard."""

from contextlib import nullcontext
from types import SimpleNamespace
from unittest.mock import MagicMock, call, patch

import pytest

from apps.common.api.views import DatabaseLockedUpdateMixin
from apps.common.database import database_update_lock
from apps.common.exceptions import ConflictError


def _mysql_connection(lock_result=1):
    cursor = MagicMock()
    cursor.fetchone.return_value = (lock_result,)
    cursor_context = MagicMock()
    cursor_context.__enter__.return_value = cursor
    connection = SimpleNamespace(vendor="mysql", cursor=lambda: cursor_context)
    return connection, cursor


def test_mysql_update_lock_is_acquired_and_always_released():
    connection, cursor = _mysql_connection()

    with (
        patch("apps.common.database.connection", connection),
        patch("apps.common.database.transaction.atomic", return_value=nullcontext()),
        pytest.raises(RuntimeError, match="write failed"),
    ):
        with database_update_lock("clienti", 21):
            raise RuntimeError("write failed")

    assert cursor.execute.call_args_list == [
        call("SELECT GET_LOCK(%s, %s)", ["ortodynamic:clienti:21", 5]),
        call("SELECT RELEASE_LOCK(%s)", ["ortodynamic:clienti:21"]),
    ]


def test_mysql_update_lock_timeout_returns_a_conflict():
    connection, _ = _mysql_connection(lock_result=0)

    with (
        patch("apps.common.database.connection", connection),
        patch("apps.common.database.transaction.atomic", return_value=nullcontext()),
        pytest.raises(ConflictError, match="Risorsa in aggiornamento"),
    ):
        with database_update_lock("preventivi", 500):
            pass


class _UpdateProbe:
    lookup_field = "pk"
    lookup_url_kwarg = None

    def __init__(self, queryset):
        self.queryset = queryset
        self.kwargs = {"pk": 21}
        self.updated_queryset = None

    def get_queryset(self):
        return self.queryset

    def update(self, request, *args, **kwargs):
        self.updated_queryset = self.get_queryset()
        return "updated"


class _LockedUpdateProbe(DatabaseLockedUpdateMixin, _UpdateProbe):
    pass


def test_update_mixin_uses_one_shared_guard_and_selects_the_row_for_update():
    queryset = MagicMock()
    queryset.model._meta.db_table = "clienti"
    locked_queryset = queryset.select_for_update.return_value
    view = _LockedUpdateProbe(queryset)
    database_features = SimpleNamespace(has_select_for_update=True)

    with (
        patch("apps.common.api.views.connection", SimpleNamespace(features=database_features)),
        patch(
            "apps.common.api.views.database_update_lock", return_value=nullcontext()
        ) as update_lock,
    ):
        assert view.update(None) == "updated"

    update_lock.assert_called_once_with("clienti", 21)
    assert view.updated_queryset is locked_queryset
