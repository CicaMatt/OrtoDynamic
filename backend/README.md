# OrtoDynamic backend

The backend is a Django 5 and Django REST Framework API for the OrtoDynamic
management application. It exposes the existing operational database through a
versioned JSON API, enforces business rules around quotes and work orders, and
generates the PDFs used during delivery, privacy, and testing workflows.

## Quick reference

| Topic             | Value                                                   |
| ----------------- | ------------------------------------------------------- |
| Runtime           | Python 3.12, Django 5, Django REST Framework            |
| API prefix        | `/api/v1/`                                              |
| Local URL         | `http://127.0.0.1:8000`                                 |
| Authentication    | Stateless signed bearer tokens                          |
| Database model    | Existing SQL schema mapped with unmanaged Django models |
| Main entry points | `manage.py`, `config/urls.py`, `config/settings/`       |
| Tests             | pytest and pytest-django                                |
| Production        | Gunicorn, Passenger, or Docker                          |

## Contents

- [Features and module map](#features-and-module-map)
- [Architecture](#architecture)
  - [Request lifecycle](#request-lifecycle)
  - [Source map](#source-map)
  - [Where to make changes](#where-to-make-changes)
  - [Data ownership](#data-ownership)
  - [API conventions](#api-conventions)
- [Business rules](#business-rules)
- [API reference](#api-reference)
  - [Platform and authentication](#platform-and-authentication)
  - [Registry and reference data](#registry-and-reference-data)
  - [Quotes and work orders](#quotes-and-work-orders)
- [Local development](#local-development)
  - [Setup and run](#setup-and-run)
  - [Environment variables](#environment-variables)
- [Tests and quality checks](#tests-and-quality-checks)
- [Deployment](#deployment)

## Features and module map

### Responsibilities

- Authenticate active records from the legacy `tb_users` table, including PHP
  `$2y$` bcrypt password hashes, and issue signed bearer tokens.
- Provide create, read, update, and delete operations for clients, doctors, health
  companies, products, and quotes.
- Store both general and orthopedic client data and generate privacy consent forms.
- Manage quote items using the active nomenclatore edition, snapshot catalogue
  prices, apply quantity and discount rules, and recalculate quote totals.
- Validate quote status changes against the shared `stato` and `stato_check` rules.
- Create a work order and its lines when a quote enters a working state, without
  creating duplicates if the operation is retried.
- Track work-order lifecycle, trials, technical assistance, production, item status,
  and delivery or cancellation dates.
- Generate delivery forms, DDTs, project sheets, and risk-assessment/testing sheets
  as inline PDFs.
- Supply dashboard counters, municipality lookups, employee lists, workflow
  configuration, liveness checks, and database readiness checks.

### Domain modules

| Module             | Responsibility                                                                             | Main API prefix                       |
| ------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------- |
| `accounts`         | Login, token authentication, session restoration, and read-only employee accounts          | `/api/v1/auth/`, `/api/v1/employees/` |
| `clients`          | Client identity, address and contact data, orthopedic measurements, and privacy forms      | `/api/v1/clients/`                    |
| `doctors`          | Doctor registry                                                                            | `/api/v1/doctors/`                    |
| `health_companies` | Regional and local health-company registry                                                 | `/api/v1/health-companies/`           |
| `municipalities`   | Read-only municipality, province, and postal-code lookup                                   | `/api/v1/municipalities/`             |
| `products`         | Nomenclatore catalogue maintenance and quote-line product search                           | `/api/v1/products/`                   |
| `quotes`           | Quotes, items, totals, deadlines, workflow, dashboard metrics, and quote documents         | `/api/v1/quotes/`                     |
| `work_orders`      | Work orders derived from quotes, production lines, after-sales data, and testing documents | `/api/v1/work-orders/`                |
| `statuses`         | Read-only states and permitted transitions scoped by legacy table name                     | `/api/v1/statuses/`                   |
| `common`           | Shared serializers, API views, errors, database locks, health checks, and PDF utilities    | Shared infrastructure                 |

## Architecture

### Request lifecycle

```text
URL → view → serializer → selector/service → unmanaged model → existing database
```

- Views own HTTP concerns and stay thin.
- Serializers define the camelCase request and response contracts.
- Selectors assemble related read data in batches and keep queries out of views.
- Services own multi-record writes and domain invariants.
- Models map the externally owned database tables.

### Source map

```text
backend/
├── manage.py
├── config/
│   ├── settings/
│   │   ├── base.py             # shared environment-driven settings
│   │   ├── development.py      # local defaults and relaxed security
│   │   └── production.py       # hosted security and proxy settings
│   ├── urls.py                 # health routes and the /api/v1 namespace
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── common/
│   │   ├── api/                # reusable DRF serializers and view bases
│   │   ├── documents/          # PDF layout, formatting, and template helpers
│   │   ├── database.py         # cross-worker update locking
│   │   ├── exceptions.py       # common API error envelope
│   │   └── health.py           # liveness and readiness probes
│   └── <domain>/
│       ├── api/
│       │   ├── serializers.py  # request and response contracts
│       │   ├── views.py        # thin HTTP layer
│       │   └── urls.py
│       ├── models.py           # mappings to legacy tables
│       ├── selectors.py        # composed and batched reads, where needed
│       ├── services.py         # writes and domain rules, where needed
│       ├── documents/          # domain PDF preparation and rendering
│       └── tests/
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
├── Dockerfile                 # Gunicorn production image
├── gunicorn.conf.py
├── passenger_wsgi.py          # cPanel/Passenger entry point
└── pytest.ini
```

### Where to make changes

| Task                                           | Primary location                                       |
| ---------------------------------------------- | ------------------------------------------------------ |
| Add or change an endpoint                      | `apps/<domain>/api/urls.py` and `views.py`             |
| Change an API field or validation rule         | `apps/<domain>/api/serializers.py`                     |
| Map another legacy column or table             | `apps/<domain>/models.py`                              |
| Add a composed read                            | `apps/<domain>/selectors.py`                           |
| Add a business operation                       | `apps/<domain>/services.py`                            |
| Add or change a PDF                            | `apps/<domain>/documents/` or `apps/common/documents/` |
| Change application configuration               | `config/settings/`                                     |
| Change shared errors, locking, or DRF behavior | `apps/common/`                                         |

### Data ownership

The business database predates this project. Domain models inherit from
`UnmanagedModel` and use `managed = False`, so Django can read and write rows but
does not create, alter, or migrate the business schema. Relationships in the
legacy schema are often plain integer columns rather than Django foreign keys;
selectors resolve them explicitly and services clean up dependent graphs when
required.

`manage.py migrate` is therefore not part of the business-schema setup. A
compatible, populated schema must already exist.

### API conventions

All application routes are mounted below `/api/v1/`. Collection responses are
currently unpaginated; filtering, searching, and pagination of management tables
are performed by the frontend.

#### Authentication

A successful `POST /api/v1/auth/login/` returns a signed token and the authenticated
user. Clients send it on subsequent requests as:

```http
Authorization: Bearer <token>
```

Tokens contain the user id, are signed with `DJANGO_SECRET_KEY`, and expire after
`DJANGO_AUTH_TOKEN_TTL_SECONDS` seconds (12 hours by default). They are stateless,
so logout discards the client copy rather than revoking server-side state. Every
application endpoint requires authentication by default; login and session
bootstrap explicitly allow anonymous requests.

#### Responses and errors

Read serializers expose frontend-facing camelCase fields. Nullable legacy values
are normally returned as empty strings so forms and tables can consume a stable
shape.

Expected service failures and standard DRF validation failures share one envelope:

```json
{
  "error": {
    "message": "Controlla i campi evidenziati.",
    "fields": {
      "quantity": ["La quantità deve essere maggiore di zero."]
    }
  }
}
```

The `fields` member is included only when field-specific validation details are
available.

#### Concurrent updates

Detail updates are serialized per database row. Transactional engines use
`SELECT FOR UPDATE`; MySQL additionally uses a named advisory lock so legacy
MyISAM tables receive equivalent protection. A lock timeout becomes an HTTP 409
conflict instead of silently overwriting another edit.

## Business rules

### Catalogue selection and quote totals

The quote product picker follows these rules:

- A new quote item displays and accepts only products from the active 2025
  nomenclatore.
- When editing an item already linked to a 2024 product, that saved 2024 product is
  displayed alongside matching 2025 products. The rest of the 2024 catalogue does
  not become selectable.
- Keeping the 2024 product preserves the line's saved price. Replacing it with a
  2025 product stores a new price snapshot from that product.

The active edition comes from `NOMENCLATORE_ACTIVE_YEAR`, currently configured as
`2025` in `config/settings/base.py`.

The server derives each amount from unit price, quantity, and percentage discount,
rounds it to cents, and recalculates the quote total after every item create, update,
or deletion. Neither line price nor quote total is trusted from client input.

### Quote workflow and work-order creation

Quotes start in `INSERITO`. Permitted next states come from the database rather than
hard-coded transitions. Moving to `IN LAVORAZIONE` or
`IN LAVORAZIONE SENZA AUTORIZZAZIONE` creates one work order with a copied line for
each quote item. The quote's doctor name is also copied into the work order's
`Firma Medico` field when available. The operation is idempotent and explicitly
removes partial rows if legacy non-transactional tables fail during creation.

Work-order states are a separate fixed set and may be chosen freely. Item status and
production values are constrained; a cancellation date is required only for
`ANNULLATO`, and a delivery date only for `CONSEGNATO`.

### PDF generation

The document layer separates database selection, pure data preparation, and PDF
rendering. ReportLab draws document content and `pypdf` overlays generated content
onto pre-printed templates where required. Assets live beside the owning document
module under `documents/assets/`; the asset README in each directory documents its
source and role.

Generated endpoints return `application/pdf` with an inline filename. Missing
required templates are converted to the standard API error format.

## API reference

### Platform and authentication

| Route                   | Behavior                                            |
| ----------------------- | --------------------------------------------------- |
| `/health/live/`         | Unauthenticated process liveness check              |
| `/health/ready/`        | Unauthenticated database connectivity check         |
| `/api/v1/auth/login/`   | Authenticate by username or email and issue a token |
| `/api/v1/auth/logout/`  | End the current client session                      |
| `/api/v1/auth/session/` | Restore the authenticated user from a saved token   |
| `/api/v1/employees/`    | Read-only list of legacy employee accounts          |

### Registry and reference data

| Route                       | Behavior                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| `/api/v1/clients/`          | List and create clients; detail routes update/delete, expose orthopedic data, and render a privacy PDF |
| `/api/v1/doctors/`          | List/create doctors and retrieve/update/delete individual records                                      |
| `/api/v1/health-companies/` | List/create health companies and retrieve/update/delete individual records                             |
| `/api/v1/municipalities/`   | List reference municipalities used by autocomplete fields                                              |
| `/api/v1/products/`         | Maintain nomenclatore rows; `/search/` returns quote-selectable products                               |
| `/api/v1/statuses/`         | Read states or transitions for the required `table` query parameter                                    |

### Quotes and work orders

| Route                                             | Behavior                                                                               |
| ------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `/api/v1/quotes/`                                 | List/create quotes, return dashboard metrics, and retrieve/update/delete a quote graph |
| `/api/v1/quotes/<id>/items/`                      | List/create quote items; nested detail routes update or delete a line                  |
| `/api/v1/quotes/<id>/status-transitions/`         | Return permitted next states and whether each creates a work order                     |
| `/api/v1/quotes/<id>/status/`                     | Apply a guarded state change and return any linked work-order id                       |
| `/api/v1/quotes/<id>/{delivery-form,ddt,scheda}/` | Stream the corresponding quote PDF                                                     |
| `/api/v1/work-orders/`                            | List work orders created from quote transitions                                        |
| `/api/v1/work-orders/<id>/`                       | Retrieve/update a work order; deletion also removes its source quote graph             |
| `/api/v1/work-orders/<id>/items/`                 | List work-order lines; nested detail routes update status, production, and dates       |
| `/api/v1/work-orders/<id>/status/`                | Choose one of the fixed work-order states                                              |
| `/api/v1/work-orders/<id>/collaudi/`              | Stream the risk-assessment and testing PDF                                             |

## Local development

### Prerequisites

- Python 3.12
- Access to an existing OrtoDynamic database schema
- A database driver supported by the configured Django backend. PyMySQL is bundled
  for MySQL/MariaDB; another engine requires its corresponding Python driver.

### Setup and run

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements/development.txt
cp .env.example .env
```

Edit `.env` with real database credentials and a non-placeholder secret, then run:

```bash
python manage.py runserver
```

The development server listens on `http://127.0.0.1:8000`; the API root is
`http://127.0.0.1:8000/api/v1/`.

### Environment variables

#### Application and security

| Variable                        | Purpose                                     |
| ------------------------------- | ------------------------------------------- |
| `DJANGO_SECRET_KEY`             | Signs authentication tokens and Django data |
| `DJANGO_DEBUG`                  | Enables development diagnostics             |
| `DJANGO_ALLOWED_HOSTS`          | Comma-separated accepted hostnames          |
| `DJANGO_TIME_ZONE`              | Application timezone                        |
| `DJANGO_ADMIN_ENABLED`          | Opts the Django admin route in or out       |
| `DJANGO_LOG_LEVEL`              | Root process log level                      |
| `DJANGO_AUTH_TOKEN_TTL_SECONDS` | Bearer-token lifetime                       |
| `DJANGO_SECURE_SSL_REDIRECT`    | Controls the production HTTPS redirect      |
| `DJANGO_SECURE_HSTS_SECONDS`    | Sets the production HSTS lifetime           |

#### Database

| Variable                                                      | Purpose                           |
| ------------------------------------------------------------- | --------------------------------- |
| `DJANGO_DB_ENGINE`                                            | Django database backend           |
| `DJANGO_DB_NAME`, `DJANGO_DB_USER`, `DJANGO_DB_PASSWORD`      | Database identity and credentials |
| `DJANGO_DB_HOST`, `DJANGO_DB_PORT`                            | Database network location         |
| `DJANGO_DB_CONN_MAX_AGE`                                      | Persistent connection lifetime    |
| `DJANGO_DB_SSL_CA`, `DJANGO_DB_SSL_CERT`, `DJANGO_DB_SSL_KEY` | Optional database TLS files       |

#### Browser and process integration

| Variable                                        | Purpose                                            |
| ----------------------------------------------- | -------------------------------------------------- |
| `DJANGO_CORS_ALLOWED_ORIGINS`                   | Comma-separated frontend origins                   |
| `DJANGO_CORS_ALLOWED_ORIGIN_REGEXES`            | Optional development-origin patterns               |
| `PORT`                                          | Gunicorn listening port                            |
| `GUNICORN_WORKERS`, `GUNICORN_THREADS`          | Gunicorn concurrency                               |
| `GUNICORN_TIMEOUT`, `GUNICORN_GRACEFUL_TIMEOUT` | Gunicorn request and shutdown timeouts             |
| `RENDER_EXTERNAL_HOSTNAME`                      | Optional Render-provided allowed hostname          |
| `DJANGO_PYTHON_EXECUTABLE`                      | Optional Passenger virtual-environment interpreter |

See `.env.example` for development-ready keys and formats.

## Tests and quality checks

From `backend/` with the virtual environment active:

```bash
python -m ruff check .
python -m pytest
python -m pytest --cov=apps --cov-branch --cov-report=term-missing --cov-report=html
```

Tests are colocated with their domain modules. They cover authentication, shared
API contracts and locks, quote orchestration and pricing, selectors, status-driven
work-order creation, and generated document contents.

To run the complete backend and frontend verification suite, use
`./scripts/check.sh` from the repository root with the backend virtual environment
active.

## Deployment

The backend can run behind Gunicorn from `Dockerfile`, under cPanel/Passenger via
`passenger_wsgi.py`, or as part of the Aruba VPS stack. Environment-specific
installation, health checks, database migration planning, backups, cutover, and
rollback are documented in [`../DEPLOYMENT.md`](../DEPLOYMENT.md).
