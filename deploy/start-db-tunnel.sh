#!/usr/bin/env bash
#
# Exposes the local MySQL (127.0.0.1:3306) over a public ngrok TCP endpoint so the
# Render-hosted backend can reach it during the client demo.
#
# Keep this running for the duration of the demo: closing it — or letting the
# machine sleep — takes the database (and therefore the app) offline. Each run
# prints a new "Forwarding" address; copy its host and port into the Render
# service's DJANGO_DB_HOST / DJANGO_DB_PORT and redeploy if they changed.
#
# One-time setup:
#     brew install ngrok
#     ngrok config add-authtoken <your-token>   # from dashboard.ngrok.com
set -euo pipefail

if ! command -v ngrok >/dev/null 2>&1; then
  echo "ngrok is not installed. Install it with: brew install ngrok" >&2
  echo "Then authenticate once with: ngrok config add-authtoken <your-token>" >&2
  exit 1
fi

echo "Exposing 127.0.0.1:3306 over ngrok. Copy the Forwarding host:port into Render."
exec ngrok tcp 127.0.0.1:3306
