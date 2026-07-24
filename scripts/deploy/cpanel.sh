#!/usr/bin/env bash
# Build and install OrtoDynamic from a repository checkout on a cPanel host.
#
# Required environment:
#   CPANEL_FRONTEND_DEPLOY_PATH  dedicated frontend document root (absolute path)
#   VITE_API_BASE_URL            public API URL ending in /api/v1
#
# Optional environment:
#   CPANEL_PYTHON                Python used to create backend/.venv (default: python3)
#   VITE_BASE_PATH               frontend URL path (default: /)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
PYTHON_COMMAND="${CPANEL_PYTHON:-python3}"
FRONTEND_DEPLOY_PATH="${CPANEL_FRONTEND_DEPLOY_PATH:-}"
API_BASE_URL="${VITE_API_BASE_URL:-}"
BASE_PATH="${VITE_BASE_PATH:-/}"

die() {
  printf 'Deployment error: %s\n' "$*" >&2
  exit 1
}

[ -n "$FRONTEND_DEPLOY_PATH" ] || die "CPANEL_FRONTEND_DEPLOY_PATH is required."
[ -n "$API_BASE_URL" ] || die "VITE_API_BASE_URL is required."
API_BASE_URL="${API_BASE_URL%/}"
[ "${FRONTEND_DEPLOY_PATH#/}" != "$FRONTEND_DEPLOY_PATH" ] \
  || die "CPANEL_FRONTEND_DEPLOY_PATH must be absolute."

case "$API_BASE_URL" in
  https://*/api/v1) ;;
  *) die "VITE_API_BASE_URL must be an HTTPS URL ending in /api/v1." ;;
esac

case "$BASE_PATH" in
  /*/) ;;
  *) die "VITE_BASE_PATH must begin and end with '/'." ;;
esac

case "${FRONTEND_DEPLOY_PATH%/}" in
  ""|/|/home|/usr|/var|/var/www)
    die "CPANEL_FRONTEND_DEPLOY_PATH is too broad. Use a dedicated document root."
    ;;
esac

if [ ! -x "$BACKEND_DIR/.venv/bin/python" ]; then
  "$PYTHON_COMMAND" -m venv "$BACKEND_DIR/.venv"
fi

"$BACKEND_DIR/.venv/bin/python" -m pip install \
  --disable-pip-version-check \
  -r "$BACKEND_DIR/requirements/production.txt"

npm --prefix "$FRONTEND_DIR" ci
VITE_API_BASE_URL="$API_BASE_URL" VITE_BASE_PATH="$BASE_PATH" \
  npm --prefix "$FRONTEND_DIR" run build

mkdir -p "$FRONTEND_DEPLOY_PATH"
cp -R "$FRONTEND_DIR/dist/." "$FRONTEND_DEPLOY_PATH/"

# Passenger observes this file and restarts the Django process after deployment.
mkdir -p "$BACKEND_DIR/tmp"
touch "$BACKEND_DIR/tmp/restart.txt"

printf 'Deployment prepared successfully.\n'
printf 'Frontend: %s\n' "$FRONTEND_DEPLOY_PATH"
printf 'Passenger app root: %s\n' "$BACKEND_DIR"
printf 'Readiness URL: %s/health/ready/\n' "${API_BASE_URL%/api/v1}"
