"""Development settings. Imports everything from base and relaxes constraints."""
from .base import *  # noqa: F401,F403
from .base import env

DEBUG = env.bool("DJANGO_DEBUG", default=True)

ALLOWED_HOSTS = env.list(
    "DJANGO_ALLOWED_HOSTS", default=["localhost", "127.0.0.1", "0.0.0.0"]
)

# Convenient default for the local React dev server (Vite).
CORS_ALLOWED_ORIGINS = env.list(
    "DJANGO_CORS_ALLOWED_ORIGINS", default=["http://localhost:5173"]
)

# Trust the Vite dev origin for CSRF on cross-origin unsafe requests (login,
# logout, and the existing create/update endpoints once they require auth).
CSRF_TRUSTED_ORIGINS = env.list(
    "DJANGO_CSRF_TRUSTED_ORIGINS", default=["http://localhost:5173"]
)
