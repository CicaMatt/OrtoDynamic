#!/usr/bin/env bash
# Stop the demo's local backing services started by scripts/demo/start.sh.
#
# Closes the ngrok tunnel (the only thing this project opens). MySQL is left
# running because it's your shared local database; pass --with-mysql to stop it
# too. The Render service and the demo DB account are untouched — drop the
# account separately when the demo is fully over (see scripts/demo/README.md).
set -uo pipefail

with_mysql=0
[ "${1:-}" = "--with-mysql" ] && with_mysql=1

# Match exactly the tunnel this project opens (start.sh / tunnel.sh both run it).
pids="$(pgrep -f 'ngrok tcp 127.0.0.1:3306' 2>/dev/null || true)"
if [ -n "$pids" ]; then
  # shellcheck disable=SC2086
  kill $pids 2>/dev/null || true
  echo "✓ closed the ngrok tunnel"
else
  echo "• ngrok tunnel not running"
fi

if [ "$with_mysql" = "1" ]; then
  if command -v brew >/dev/null; then
    brew services stop mysql >/dev/null && echo "✓ stopped MySQL" || echo "! could not stop MySQL"
  else
    echo "! Homebrew not available — stop MySQL manually"
  fi
else
  echo "• MySQL left running (pass --with-mysql to stop it too)"
fi
