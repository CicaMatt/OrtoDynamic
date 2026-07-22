#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_PYTHON="${BACKEND_PYTHON:-python}"

npm --prefix "$ROOT_DIR/frontend" run test:coverage

cd "$ROOT_DIR/backend"
"$BACKEND_PYTHON" -m pytest \
  --cov=apps \
  --cov-branch \
  --cov-report=term-missing \
  --cov-report=html
