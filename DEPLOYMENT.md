# OrtoDynamic deployment

The repository supports two independent deployment targets:

- **Hosted production:** React static files and Django/Passenger on cPanel,
  connected directly to the existing MySQL database.
- **Temporary demo:** GitHub Pages, Render/Gunicorn, and the existing ngrok MySQL
  tunnel. Its runbook remains in [`scripts/demo/README.md`](scripts/demo/README.md).

The temporary services are not involved in the hosted production request path.

## 1. Hosting prerequisites

Confirm that the cPanel account provides:

- Application Manager or Setup Python App with Phusion Passenger;
- Python 3.10 or newer, `pip`, virtual environments, and shell/Terminal access;
- Node.js 20 or newer for server-side frontend builds, or a separate system on
  which to run `npm ci && npm run build`;
- a dedicated frontend document root and an API subdomain;
- access from the Passenger process to the existing MySQL database.

Recommended public layout:

```text
https://management.example.it       React document root
https://api-management.example.it   Passenger application rooted at backend/
localhost:3306                      existing MySQL database
```

Keep the Git checkout and the Django source outside every public document root.
Only `frontend/dist/` belongs in the frontend document root.

## 2. First hosted installation

Clone the repository through cPanel Git Version Control or SSH. From its root,
prepare a release with real public URLs:

```bash
CPANEL_FRONTEND_DEPLOY_PATH=/home/ACCOUNT/public_html/management \
VITE_API_BASE_URL=https://api-management.example.it/api/v1 \
VITE_BASE_PATH=/ \
./scripts/deploy/cpanel.sh
```

Use a dedicated, initially empty document root. The script deliberately copies
the new static bundle without deleting existing files; the legacy PHP system
must be archived or moved during the controlled cutover rather than erased by an
automated deployment.

In Application Manager, register `backend/` as the application root and
`passenger_wsgi.py` as its startup file. Select `backend/.venv/bin/python` as the
application interpreter when the interface supports it. Otherwise add:

```text
DJANGO_PYTHON_EXECUTABLE=/home/ACCOUNT/path/to/OrtoDynamic/backend/.venv/bin/python
```

The repository includes `deployment/cpanel/.cpanel.yml.example` for optional
cPanel Git deployments. Copy it to `.cpanel.yml`, replace its account paths and
domains, commit it, and deploy only after the manual installation works.

## 3. Django production environment

Set these in Application Manager. Do not put secrets in `.cpanel.yml`, `.env`,
the frontend bundle, or the Git repository.

```text
DJANGO_SETTINGS_MODULE=config.settings.production
DJANGO_SECRET_KEY=<long random secret unique to production>
DJANGO_TIME_ZONE=Europe/Rome
DJANGO_ALLOWED_HOSTS=api-management.example.it
DJANGO_CORS_ALLOWED_ORIGINS=https://management.example.it
DJANGO_ADMIN_ENABLED=False
DJANGO_LOG_LEVEL=INFO

DJANGO_DB_ENGINE=django.db.backends.mysql
DJANGO_DB_NAME=<existing database name>
DJANGO_DB_USER=<dedicated application database user>
DJANGO_DB_PASSWORD=<database password>
DJANGO_DB_HOST=localhost
DJANGO_DB_PORT=3306
DJANGO_DB_CONN_MAX_AGE=60
```

For a remote managed database, also set the provider-supplied certificate paths
as needed:

```text
DJANGO_DB_SSL_CA=/absolute/path/to/ca.pem
DJANGO_DB_SSL_CERT=/absolute/path/to/client-cert.pem
DJANGO_DB_SSL_KEY=/absolute/path/to/client-key.pem
```

The domain models are unmanaged mappings of the existing business schema. Do
not run migrations expecting Django to create or upgrade those tables.

## 4. Verification

After Passenger starts, verify:

```text
GET https://api-management.example.it/health/live/   -> 200 {"status":"ok"}
GET https://api-management.example.it/health/ready/  -> 200 {"status":"ok"}
```

The readiness endpoint returns 503 without database error details when MySQL is
not usable. Then test login, representative reads and writes, status changes,
and every generated PDF from the hosted frontend.

Enable AutoSSL for both public hosts. Keep `DEBUG=False`, do not expose MySQL to
the public internet, and configure hosting-level backups, resource monitoring,
log retention, and availability alerts.

## 5. Production cutover and rollback

1. Validate the complete application on staging against a recent database copy.
2. Back up the live database and the PHP application files.
3. Put the PHP application into maintenance/read-only mode.
4. Point the production Passenger app at the live local database.
5. Move the PHP document root to a non-public rollback location and publish the
   React bundle at the existing management URL.
6. Run login, read, reversible write, and PDF smoke tests.
7. Monitor Passenger's `stderr.log`, Apache logs, and `/health/ready/`.

Do not allow the PHP and Django applications to accept writes concurrently until
their business behaviour has been proven equivalent. Rollback consists of
disabling Passenger, restoring the PHP document root, and reviewing any records
written by Django during the cutover window before reopening PHP writes.

## 6. Temporary demo deployment

The Render blueprint still starts Django through Gunicorn and checks
`/health/live/`. The GitHub Pages workflow still builds with `/OrtoDynamic/` and
defaults to the existing Render API URL. Set the GitHub Actions repository
variable `VITE_API_BASE_URL` to change that API URL without editing source.

The demo's database readiness is visible at `/health/ready/`; liveness remains
independent so Render can start even when the local ngrok tunnel is offline.
