"""
Base settings shared by every environment.

Environment-specific settings live in `development.py` and `production.py`,
which import everything from this module and override only what differs.
All secrets and environment-specific values are read from the environment
(see `.env.example`) — never hardcoded here.
"""
from pathlib import Path

import environ

# backend/ — the directory that contains manage.py
BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env()
# Load a local .env if present (development convenience; absent in production).
environ.Env.read_env(BASE_DIR / ".env")

# --- Core -------------------------------------------------------------------
SECRET_KEY = env("DJANGO_SECRET_KEY")
DEBUG = env.bool("DJANGO_DEBUG", default=False)
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=[])

# --- Applications -----------------------------------------------------------
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "corsheaders",
]

# Project apps. One app per cohesive domain area of the management system.
# Add domain apps here as the database areas are mapped (e.g. "apps.clients").
LOCAL_APPS = [
    "apps.common",
    "apps.accounts",
    "apps.clients",
    "apps.doctors",
    "apps.health_companies",
    "apps.products",
    "apps.quotes",
    "apps.work_orders",
    "apps.municipalities",
    "apps.statuses",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# --- Middleware -------------------------------------------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# --- Database ---------------------------------------------------------------
# Points at the already-existing SQL database. The engine is env-driven so the
# same code runs against PostgreSQL or MySQL without edits. Domain models that
# map existing tables are declared with `managed = False` (see apps/common).
DATABASES = {
    "default": {
        "ENGINE": env("DJANGO_DB_ENGINE", default="django.db.backends.postgresql"),
        "NAME": env("DJANGO_DB_NAME"),
        "USER": env("DJANGO_DB_USER", default=""),
        "PASSWORD": env("DJANGO_DB_PASSWORD", default=""),
        "HOST": env("DJANGO_DB_HOST", default="localhost"),
        "PORT": env("DJANGO_DB_PORT", default=""),
        "CONN_MAX_AGE": env.int("DJANGO_DB_CONN_MAX_AGE", default=60),
    }
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- Password validation ----------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# --- Internationalization ---------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = env("DJANGO_TIME_ZONE", default="UTC")
USE_I18N = True
USE_TZ = True

# --- Static files -----------------------------------------------------------
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# --- Django REST Framework --------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "apps.common.pagination.DefaultPagination",
    "PAGE_SIZE": 25,
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    # Cookie-based session auth (CSRF-protected). Every endpoint requires an
    # authenticated user by default; views that must stay open (login, session
    # bootstrap) opt out with an explicit `AllowAny`.
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "apps.accounts.api.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "EXCEPTION_HANDLER": "apps.common.exceptions.api_exception_handler",
}

# --- Authentication & sessions ----------------------------------------------
# Credentials are checked against the legacy `tb_users` table by a custom backend;
# Django's default ModelBackend (which queries the absent `auth_user` table) is
# removed. The application owns no Django tables, so sessions live in a signed,
# tamper-proof cookie rather than a `django_session` table.
AUTHENTICATION_BACKENDS = ["apps.accounts.backends.LegacyUserBackend"]
SESSION_ENGINE = "django.contrib.sessions.backends.signed_cookies"

# The React frontend is served from its own origin, so the browser must be
# allowed to send the session/CSRF cookies cross-origin, and that origin must be
# trusted for CSRF on unsafe requests. Both are env-driven (see CORS below).
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = env.list("DJANGO_CSRF_TRUSTED_ORIGINS", default=[])

# --- CORS -------------------------------------------------------------------
# The React dev server / deployed frontend origins are env-driven.
CORS_ALLOWED_ORIGINS = env.list("DJANGO_CORS_ALLOWED_ORIGINS", default=[])
