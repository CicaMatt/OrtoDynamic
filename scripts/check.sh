#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_PYTHON="${BACKEND_PYTHON:-python}"

npm --prefix "$ROOT_DIR/frontend" test
npm --prefix "$ROOT_DIR/frontend" run lint
npm --prefix "$ROOT_DIR/frontend" run format:check
npm --prefix "$ROOT_DIR/frontend" run build

cd "$ROOT_DIR/backend"
"$BACKEND_PYTHON" -m ruff check .
"$BACKEND_PYTHON" -m pytest
