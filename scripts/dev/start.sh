#!/usr/bin/env bash
# Start backend (Django :8000) and frontend (Vite :5173) for local development.
# Ctrl-C stops both; scripts/dev/stop.sh cleans up any left running.
set -e
cd "$(dirname "${BASH_SOURCE[0]}")/../.."
trap 'kill 0' EXIT
/opt/anaconda3/envs/ortodynamic/bin/python backend/manage.py runserver &
npm --prefix frontend run dev &
wait
