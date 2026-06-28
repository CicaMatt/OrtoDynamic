#!/usr/bin/env bash
#
# One-command launcher for the client-demo's backing services on this machine.
# Render and GitHub Pages deploy themselves from git; the only moving part that
# lives on your Mac is the database and its tunnel, which this script brings up:
#
#   1. ensures the local MySQL server is running
#   2. verifies the dedicated demo account can read the database
#   3. opens (or reuses) the ngrok TCP tunnel to 127.0.0.1:3306
#   4. prints the exact DJANGO_DB_HOST / DJANGO_DB_PORT to set on Render
#      — and sets them automatically if Render API credentials are provided
#
# Usage:
#   ./scripts/demo/start.sh
#
# Optional environment:
#   DEMO_DB_PASSWORD   demo account password (default: read from scripts/demo/.demo-db-password)
#   RENDER_API_KEY     with RENDER_SERVICE_ID, updates Render's DB host/port over the API
#   RENDER_SERVICE_ID  the Render service id (e.g. srv-xxxxxxxxxxxx)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

DB_NAME="ORTODYNAMIC"
DB_USER="ortodynamic_demo"
DB_HOST="127.0.0.1"
DB_PORT="3306"
PASS_FILE="$SCRIPT_DIR/.demo-db-password"
NGROK_API="http://127.0.0.1:4040/api/tunnels"
NGROK_LOG="$(mktemp -t ngrok-demo)"
NGROK_PID=""

log()  { printf '\033[1;34m▶\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[1;31m✗\033[0m %s\n' "$*" >&2; exit 1; }

cleanup() {
  # Only tear the tunnel down if this run is the one that started it.
  [ -n "$NGROK_PID" ] && kill "$NGROK_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

port_open() { (exec 3<>"/dev/tcp/$1/$2") 2>/dev/null; }

# --- 1. Local MySQL ----------------------------------------------------------
log "Checking local MySQL on $DB_HOST:$DB_PORT…"
if ! port_open "$DB_HOST" "$DB_PORT"; then
  command -v brew >/dev/null || die "MySQL isn't running and Homebrew isn't available to start it."
  log "Not running — starting it with Homebrew…"
  brew services start mysql >/dev/null || die "Could not start MySQL via Homebrew."
  for _ in $(seq 1 30); do port_open "$DB_HOST" "$DB_PORT" && break; sleep 1; done
  port_open "$DB_HOST" "$DB_PORT" || die "MySQL did not come up on $DB_HOST:$DB_PORT."
fi
ok "MySQL is up."

# --- 2. Demo account ---------------------------------------------------------
DEMO_DB_PASSWORD="${DEMO_DB_PASSWORD:-$(cat "$PASS_FILE" 2>/dev/null || true)}"
[ -n "$DEMO_DB_PASSWORD" ] || die "No demo DB password. Run ./scripts/demo/create-db-user.sh and save it to $PASS_FILE."

log "Verifying the '$DB_USER' account can read the database…"
MYSQL_PWD="$DEMO_DB_PASSWORD" mysql -u "$DB_USER" -h "$DB_HOST" -P "$DB_PORT" \
  --connect-timeout=5 -N -e "SELECT 1 FROM ${DB_NAME}.tb_users LIMIT 1;" >/dev/null 2>&1 \
  || die "The '$DB_USER' account can't connect. (Re)create it with ./scripts/demo/create-db-user.sh and update $PASS_FILE."
ok "Demo account works."

# --- 3. ngrok tunnel ---------------------------------------------------------
tunnel_address() {
  curl -s --max-time 3 "$NGROK_API" 2>/dev/null | grep -oE 'tcp://[a-zA-Z0-9.-]+:[0-9]+' | head -1
}

if [ -n "$(tunnel_address)" ]; then
  ok "Reusing the ngrok tunnel already running on this machine."
else
  command -v ngrok >/dev/null || die "ngrok isn't installed. Run: brew install ngrok  (then: ngrok config add-authtoken <token>)."
  log "Opening ngrok TCP tunnel to $DB_HOST:$DB_PORT…"
  ngrok tcp "$DB_HOST:$DB_PORT" --log stdout >"$NGROK_LOG" 2>&1 &
  NGROK_PID=$!
  for _ in $(seq 1 20); do [ -n "$(tunnel_address)" ] && break; sleep 1; done
fi

PUBLIC="$(tunnel_address)"
[ -n "$PUBLIC" ] || die "Tunnel did not come up. See $NGROK_LOG."
HOSTPORT="${PUBLIC#tcp://}"
RENDER_DB_HOST="${HOSTPORT%:*}"
RENDER_DB_PORT="${HOSTPORT##*:}"
ok "Tunnel live: $PUBLIC"

# --- 4. Hand the address to Render ------------------------------------------
if [ -n "${RENDER_API_KEY:-}" ] && [ -n "${RENDER_SERVICE_ID:-}" ]; then
  log "Updating Render env vars over the API…"
  render_set() {
    curl -fsS -X PUT "https://api.render.com/v1/services/$RENDER_SERVICE_ID/env-vars/$1" \
      -H "Authorization: Bearer $RENDER_API_KEY" -H "Content-Type: application/json" \
      -d "{\"value\":\"$2\"}" >/dev/null
  }
  if render_set DJANGO_DB_HOST "$RENDER_DB_HOST" && render_set DJANGO_DB_PORT "$RENDER_DB_PORT"; then
    ok "Render updated — it will redeploy with the new address."
  else
    warn "Could not update Render automatically; set the values below by hand."
  fi
fi

cat <<SUMMARY

──────────────────────────────────────────────────────────
  Set these on the Render service → Environment:

      DJANGO_DB_HOST = $RENDER_DB_HOST
      DJANGO_DB_PORT = $RENDER_DB_PORT

  Frontend:  https://cicamatt.github.io/OrtoDynamic/
  Keep this terminal open and the Mac awake during the demo.
  Ctrl-C closes the tunnel.
──────────────────────────────────────────────────────────

SUMMARY

# Stay alive (and hold the tunnel open) only if we started it ourselves.
[ -n "$NGROK_PID" ] && wait "$NGROK_PID"
