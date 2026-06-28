"""Production settings. Imports from base and hardens for deployment."""
from .base import *  # noqa: F401,F403
from .base import env

DEBUG = False

# Allowed hosts come from the environment, plus the hostname Render injects for
# the service (`RENDER_EXTERNAL_HOSTNAME`) so the public URL works without being
# hardcoded. At least one source must resolve — an empty list rejects all hosts.
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=[])
_render_hostname = env("RENDER_EXTERNAL_HOSTNAME", default=None)
if _render_hostname:
    ALLOWED_HOSTS.append(_render_hostname)

# --- Security hardening -----------------------------------------------------
SECURE_SSL_REDIRECT = env.bool("DJANGO_SECURE_SSL_REDIRECT", default=True)
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = env.int("DJANGO_SECURE_HSTS_SECONDS", default=31536000)
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
