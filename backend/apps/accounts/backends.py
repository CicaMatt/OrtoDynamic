"""
Authentication backend for the legacy `tb_users` table.

Replaces Django's default `ModelBackend`, which would query the non-existent
`auth_user` table. It looks a user up by username and verifies the password
against the legacy bcrypt hash. A throwaway verification runs on the
"user not found" path so response time doesn't reveal whether a username exists.
"""
import bcrypt
from django.contrib.auth.backends import BaseBackend

from apps.accounts.models import User
from apps.accounts.passwords import verify_legacy_password

# A throwaway hash (cost 10, matching the legacy rows) used only to spend
# comparable time on the "user not found" path, mitigating username enumeration
# via response timing. Computed once at import.
_TIMING_EQUALIZER_HASH = bcrypt.hashpw(b"timing-equalizer", bcrypt.gensalt(10)).decode("ascii")


class LegacyUserBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        # `username` carries the login identifier, which may be either the account
        # username or its email address — the legacy panel accepts both.
        if not username or not password:
            return None

        user = (
            User.objects.filter(username=username).first()
            or User.objects.filter(email=username).first()
        )
        if user is None:
            verify_legacy_password(password, _TIMING_EQUALIZER_HASH)
            return None
        if not user.check_password(password):
            return None
        if not user.is_active:
            return None
        return user

    def get_user(self, user_id):
        user = User.objects.filter(pk=user_id).first()
        # A user deactivated mid-session is treated as logged out on the next request.
        if user is None or not user.is_active:
            return None
        return user
