# OrtoDynamic — Backend

Thin Django + Django REST Framework API over the **already-existing** OrtoDynamic
SQL database. Its only job: expose read queries, inserts, updates, deletions, and
state changes to the React frontend through a versioned REST API. No business
domain is owned here that the database doesn't already own.

## Layout

```
backend/
├── manage.py
├── .env.example            # documented environment variables (copy to .env)
├── requirements/
│   ├── base.txt            # runtime deps
│   ├── development.txt      # + test/lint tooling
│   └── production.txt       # + gunicorn
├── config/                  # project configuration (not a domain app)
│   ├── settings/
│   │   ├── base.py          # shared, env-driven settings
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py              # mounts every app under /api/v1/
│   ├── wsgi.py
│   └── asgi.py
└── apps/
    ├── common/              # shared base models, pagination, error handling
    └── <domain>/            # one app per cohesive area of the database
```

## Adding a domain app

One Django app per cohesive area of the existing database (e.g. `clients`,
`employees`, `work_orders`). Each app follows the same modular layout:

```
apps/<domain>/
├── __init__.py
├── apps.py
├── models.py        # models mapping existing tables (managed = False)
├── serializers.py   # request/response shapes — the API contract
├── services.py      # write/business logic: inserts, updates, state changes
├── selectors.py     # read/query logic (optional; split from services when it grows)
├── views.py         # thin DRF views/viewsets — no business logic
├── urls.py          # registered into config/urls.py under api/v1/
└── tests/
```

Rules of the road (see the root `CLAUDE.md` for the full standard):

- **Models** map existing tables and are declared `managed = False` (subclass
  `apps.common.models.UnmanagedModel`). Use `db_table` / `db_column` to bind to
  the real schema. Run `python manage.py inspectdb` to bootstrap them once the
  schema is known, then hand-clean the result.
- **Views are thin.** They parse/validate input via serializers and delegate to
  `services` / `selectors`. No ORM queries or business rules inline in a view.
- **Services raise `ServiceError`** (see `apps/common/exceptions.py`) for expected
  client-facing failures; the shared handler turns them into a consistent
  `{"error": {...}}` JSON envelope.
- **Validation is enforced here**, on the backend — it is the source of truth.

## Local development

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements/development.txt
cp .env.example .env          # then fill in real database credentials
python manage.py runserver
```

Settings default to `config.settings.development` (see `manage.py`). The database
connection points at the existing SQL database via the `DJANGO_DB_*` variables —
this project does not create the business schema.
