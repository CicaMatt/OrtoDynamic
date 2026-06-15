"""
Tests for legacy password verification — the security-critical core of login.

These exercise pure logic and in-memory model instances only (no database), so
they run without the legacy MySQL database being reachable.
"""
import bcrypt

from apps.accounts.models import User
from apps.accounts.passwords import verify_legacy_password

PASSWORD = "correct horse battery staple"


def _php_bcrypt(raw: str) -> str:
    """A bcrypt hash in PHP's `$2y$` format, as stored in `tb_users`."""
    return bcrypt.hashpw(raw.encode(), bcrypt.gensalt(10)).replace(b"$2b$", b"$2y$", 1).decode()


def test_verify_accepts_correct_password_against_php_2y_hash():
    assert verify_legacy_password(PASSWORD, _php_bcrypt(PASSWORD)) is True


def test_verify_rejects_wrong_password():
    assert verify_legacy_password("wrong", _php_bcrypt(PASSWORD)) is False


def test_verify_handles_2b_prefix_too():
    assert verify_legacy_password(PASSWORD, bcrypt.hashpw(PASSWORD.encode(), bcrypt.gensalt(10)).decode()) is True


def test_verify_rejects_empty_inputs():
    assert verify_legacy_password("", _php_bcrypt(PASSWORD)) is False
    assert verify_legacy_password(PASSWORD, "") is False


def test_verify_rejects_malformed_hash_without_raising():
    assert verify_legacy_password(PASSWORD, "not-a-bcrypt-hash") is False


def test_verify_truncates_to_72_bytes_like_php():
    base = "A" * 72
    hashed = _php_bcrypt(base)
    # bcrypt only consumes the first 72 bytes; PHP truncates silently, so a longer
    # string sharing that prefix must still verify — and must not raise.
    assert verify_legacy_password(base + "ignored-tail", hashed) is True


def test_user_check_password_delegates_to_verifier():
    user = User(username="tester", password=_php_bcrypt(PASSWORD))
    assert user.check_password(PASSWORD) is True
    assert user.check_password("nope") is False
