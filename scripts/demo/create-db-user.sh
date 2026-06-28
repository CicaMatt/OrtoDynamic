#!/usr/bin/env bash
#
# Creates a dedicated, least-privilege MySQL account for the temporary client
# demo and prints the credentials to paste into the Render service. Run once.
#
# The Render backend reaches this database through the ngrok tunnel
# (tunnel.sh), which forwards to 127.0.0.1 — so the account only needs
# to be reachable from localhost. The account has data-only privileges (no DDL,
# no GRANT) on a single schema. Drop it after the demo:
#
#     mysql -u root -p -e "DROP USER 'ortodynamic_demo'@'127.0.0.1';"
#
# Usage: ./scripts/demo/create-db-user.sh [DB_NAME]   (DB_NAME defaults to ORTODYNAMIC)
set -euo pipefail

DB_NAME="${1:-ORTODYNAMIC}"
DB_USER="ortodynamic_demo"
# 32 alphanumeric characters from a CSPRNG.
DB_PASS="$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32)"

echo "Creating MySQL user '${DB_USER}' with data privileges on '${DB_NAME}'."
echo "Enter the local MySQL root password when prompted."

mysql -u root -p <<SQL
CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';
ALTER USER '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';
GRANT SELECT, INSERT, UPDATE, DELETE ON \`${DB_NAME}\`.* TO '${DB_USER}'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL

cat <<INFO

Done. Set these in the Render dashboard (ortodynamic-api → Environment):

  DJANGO_DB_NAME      = ${DB_NAME}
  DJANGO_DB_USER      = ${DB_USER}
  DJANGO_DB_PASSWORD  = ${DB_PASS}
  DJANGO_DB_HOST      = <ngrok host, e.g. 0.tcp.eu.ngrok.io>   (from tunnel.sh)
  DJANGO_DB_PORT      = <ngrok port, e.g. 12345>               (from tunnel.sh)

This password is shown only once. Re-run this script to rotate it.
INFO
