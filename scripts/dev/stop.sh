#!/usr/bin/env bash
# Stop the local dev servers started by scripts/dev/start.sh — Django runserver
# (:8000) and the Vite dev server (:5173). Safe to run when they're already down.
# start.sh stops both on Ctrl-C; this is for orphans left after a lost terminal.
set -uo pipefail

stop_port() {
  local name=$1 port=$2 pids
  pids="$(lsof -ti "tcp:$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [ -z "$pids" ]; then
    printf '• %s (:%s) not running\n' "$name" "$port"
    return
  fi
  # shellcheck disable=SC2086
  kill $pids 2>/dev/null || true
  printf '✓ stopped %s (:%s)\n' "$name" "$port"
}

stop_port "backend (Django)" 8000
stop_port "frontend (Vite)" 5173
