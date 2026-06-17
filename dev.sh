#!/usr/bin/env bash
# Start backend (Django :8000) and frontend (Vite :5173). Ctrl-C stops both.
set -e
cd "$(dirname "$0")"
trap 'kill 0' EXIT
/opt/anaconda3/envs/ortodynamic/bin/python backend/manage.py runserver &
npm --prefix frontend run dev &
wait
