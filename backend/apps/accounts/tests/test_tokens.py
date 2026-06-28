"""
Tests for the stateless auth token — the credential issued at login and verified
on every request. Pure signing logic, no database, so these run without the
legacy MySQL database being reachable.
"""
from apps.accounts.tokens import issue_token, read_token

# `issue_token` only reads `user.pk`, so a lightweight stand-in avoids the DB.
class _User:
    def __init__(self, pk: int):
        self.pk = pk


def test_round_trip_returns_the_user_id():
    token = issue_token(_User(pk=42))
    assert read_token(token, max_age=3600) == 42


def test_expired_token_is_rejected():
    # A negative max_age makes any freshly minted token already too old, exercising
    # the expiry branch without manipulating the clock.
    token = issue_token(_User(pk=1))
    assert read_token(token, max_age=-1) is None


def test_tampered_token_is_rejected():
    token = issue_token(_User(pk=1))
    tampered = token[:-1] + ("A" if token[-1] != "A" else "B")
    assert read_token(tampered, max_age=3600) is None


def test_garbage_token_is_rejected_without_raising():
    assert read_token("not-a-real-token", max_age=3600) is None
