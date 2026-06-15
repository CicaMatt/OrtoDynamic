"""
User model — maps the existing `tb_users` table for authentication.

`tb_users` is owned by the legacy database, so this model is unmanaged: Django
reads the rows (and updates `last_login` on sign-in) but never owns the schema.
It subclasses `AbstractBaseUser` purely for Django's session-auth integration
(`is_authenticated`, `get_session_auth_hash`, …). Password checking is overridden
because the stored hashes are PHP bcrypt (`$2y$`), a format Django's own hashers
do not recognise — see `apps.accounts.passwords`.

Authorization is intentionally out of scope: every account currently has the same
access, so `PermissionsMixin`/groups are not mapped. The legacy `group_id` column
is left unmapped until role-based access is actually needed.
"""
from django.contrib.auth.models import AbstractBaseUser
from django.db import models

from apps.accounts.passwords import verify_legacy_password


class User(AbstractBaseUser):
    # `tb_users.id` is an AUTO_INCREMENT int primary key.
    id = models.AutoField(primary_key=True)

    username = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    # `active` (tinyint) gates whether the account may sign in. Exposed as
    # `is_active` so Django's auth machinery (and our backend) reads it directly.
    is_active = models.BooleanField(db_column="active", default=True)

    # `password` and `last_login` are inherited from AbstractBaseUser and map to
    # the identically named columns.

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    class Meta:
        managed = False
        db_table = "tb_users"

    def __str__(self) -> str:
        return self.username

    def check_password(self, raw_password: str) -> bool:
        """Verify a raw password against the legacy PHP bcrypt hash."""
        return verify_legacy_password(raw_password, self.password)
