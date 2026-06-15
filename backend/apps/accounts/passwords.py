"""
Verification of legacy `tb_users` passwords.

The legacy PHP application stored passwords with `password_hash()` — bcrypt using
the `$2y$` prefix. Django's built-in hashers don't recognise that raw format, so
credentials are verified directly with the bcrypt library, which treats `$2y$`
as equivalent to `$2b$`. Hashes are never rewritten here: the legacy table stays
the single source of truth, and this module is the one place that understands its
password format.
"""
import bcrypt


def verify_legacy_password(raw_password: str, encoded: str) -> bool:
    """Return True iff `raw_password` matches the stored bcrypt hash `encoded`."""
    if not raw_password or not encoded:
        return False
    try:
        # bcrypt only uses the first 72 bytes; PHP's password_verify() truncates
        # silently, so we do the same to stay byte-for-byte compatible (and to
        # avoid bcrypt raising on longer inputs).
        return bcrypt.checkpw(raw_password.encode("utf-8")[:72], encoded.encode("utf-8"))
    except ValueError:
        # A malformed or unsupported hash in the legacy row — treat as no match
        # rather than letting the error surface as a 500.
        return False
