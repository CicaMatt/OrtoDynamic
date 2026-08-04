# OrtoDynamic

OrtoDynamic is a web management application for the operational cycle of an
orthopedic business. It brings client and clinical records, the product
nomenclatore, quotes, production work, reference data, and printable documents
into one authenticated interface while continuing to use the company's existing
database.

The interface is in Italian and is designed for staff who move a case through this
workflow:

```text
Client and clinical data
        ↓
Quote with nomenclatore items and calculated totals
        ↓
Database-controlled quote status transition
        ↓
Work order with production, trial, delivery, and assistance data
        ↓
Privacy, delivery, DDT, project, risk-assessment, and testing documents
```

Alongside that main flow, the application maintains doctors, health companies, and
catalogue entries; exposes municipality lookups; shows quote workload on a
dashboard; and provides read-only views of employees and workflow configuration.

## Architecture at a glance

OrtoDynamic is split into two independently deployable modules:

- [`frontend/`](frontend/README.md) is a React and TypeScript single-page
  application. It owns the responsive user experience, client-side tables,
  navigation, guarded editing, and document presentation.
- [`backend/`](backend/README.md) is a Django REST API. It owns authentication,
  validation, business orchestration, concurrent-write protection, database
  access, and PDF generation.

The API maps a legacy SQL schema through unmanaged Django models. The application
can update operational rows, but it does not own or migrate those tables. This is
an important deployment constraint: a compatible, populated database must be
available before the application starts.

## Repository structure

```text
OrtoDynamic/
├── frontend/                 # React/Vite application and frontend tests
├── backend/                  # Django API, domain modules, and backend tests
├── scripts/
│   ├── dev/                  # start and stop both local servers
│   ├── demo/                 # temporary demo lifecycle
│   ├── deploy/               # hosted deployment helper
│   ├── check.sh              # complete project verification
│   └── coverage.sh           # frontend and backend coverage
├── deployment/aruba/         # VPS/Coolify stack and runbook
├── render.yaml               # temporary backend demo service
└── DEPLOYMENT.md             # deployment index and operational procedures
```

## Local setup

You need Python 3.12, Node.js 20, npm, and credentials for an existing OrtoDynamic
database.

Prepare both modules:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements/development.txt
cp .env.example .env

cd ../frontend
npm ci
cp .env.example .env.local

cd ..
./scripts/dev/start.sh
```

Before starting, fill `backend/.env` with the real database connection and a secure
Django secret. The example frontend configuration already targets the local API.

The launcher starts:

- Django on `http://127.0.0.1:8000`;
- Vite on `http://localhost:5173`.

Press Ctrl-C to stop both processes. If a terminal is lost, run
`./scripts/dev/stop.sh` to stop listeners left on ports 8000 and 5173.

Module-specific setup, configuration, architecture, and commands live in the
backend and frontend READMEs linked above.

## Verification

With the backend virtual environment active, run the complete project suite from
the repository root:

```bash
./scripts/check.sh
```

It runs frontend tests, linting, formatting checks, and a production build, followed
by backend Ruff checks and pytest. Generate coverage for both modules with:

```bash
./scripts/coverage.sh
```

## Deployment and operations

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for the deployment overview, production
environment, verification, cutover, rollback, and temporary demo. The dedicated
[`deployment/aruba/README.md`](deployment/aruba/README.md) covers the Aruba VPS and
Coolify stack, database migration rehearsal, backups, domain transfer, and routine
operations.

Do not commit real `.env` files, database credentials, private TLS material, or
production signing secrets.
