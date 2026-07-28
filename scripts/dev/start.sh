#!/usr/bin/env bash
# Start backend (Django :8000) and frontend (Vite :5173) for local development.
# Ctrl-C stops both; scripts/dev/stop.sh cleans up any left running.
set -e
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

if [ -n "${BACKEND_PYTHON:-}" ]; then
  backend_python="$BACKEND_PYTHON"
elif [ -x backend/.venv/bin/python ]; then
  backend_python=backend/.venv/bin/python
else
  backend_python=python
fi

if ! "$backend_python" -c 'import django' >/dev/null 2>&1; then
  printf >&2 'Django is not available through %s.\n' "$backend_python"
  printf >&2 'Create the backend environment and install its dependencies first:\n'
  printf >&2 '  cd backend && python3 -m venv .venv && .venv/bin/python -m pip install -r requirements/development.txt\n'
  exit 1
fi

trap 'kill 0' EXIT
"$backend_python" backend/manage.py runserver &
npm --prefix frontend run dev &
wait
