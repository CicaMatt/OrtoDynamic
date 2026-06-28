"""
Stateless authentication tokens.

A successful login hands the frontend a signed, timestamped token instead of
establishing a cookie session. The token carries only the user id and is signed
with ``SECRET_KEY`` via Django's own signing machinery — so it needs no database
table or migration (the app owns no Django-managed tables) and survives process
restarts as long as the key is stable.

The token is verified on every request by ``BearerTokenAuthentication``. Because
it is stateless it cannot be revoked server-side; expiry (``AUTH_TOKEN_TTL_SECONDS``)
is the only bound on its lifetime, so the TTL is kept short.
"""
from __future__ import annotations

from django.core import signing

# Namespacing salt so these tokens can never be confused with signed values
# produced elsewhere in the project that share ``SECRET_KEY``.
_SALT = "apps.accounts.auth-token"


def issue_token(user) -> str:
    """Return a signed token identifying ``user``."""
    return signing.dumps({"uid": user.pk}, salt=_SALT)


def read_token(token: str, *, max_age: int) -> int | None:
    """Return the user id carried by ``token``, or ``None`` if it is invalid or
    older than ``max_age`` seconds. ``SignatureExpired`` is a ``BadSignature``
    subclass, so a single guard covers both tampering and expiry."""
    try:
        payload = signing.loads(token, salt=_SALT, max_age=max_age)
    except signing.BadSignature:
        return None
    return payload.get("uid")
