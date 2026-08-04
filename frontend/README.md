# OrtoDynamic frontend

The frontend is a responsive Italian-language management interface built with
React 18, TypeScript, Vite, and Tailwind CSS. It consumes the OrtoDynamic REST API
and presents the complete day-to-day workflow for client records, quotes, work
orders, reference data, and operational documents.

## Quick reference

| Topic              | Value                                           |
| ------------------ | ----------------------------------------------- |
| Runtime            | Node.js 20, React 18, TypeScript                |
| Development server | Vite at `http://localhost:5173`                 |
| Styling            | Tailwind CSS with a project theme               |
| API client         | Native `fetch` through `src/shared/api/http.ts` |
| Application state  | React contexts and feature hooks                |
| Navigation         | Typed in-memory routes                          |
| Tests              | Vitest, jsdom, and Testing Library              |
| Production         | Static bundle served by Nginx                   |

## Contents

- [Feature guide](#feature-guide)
  - [Business modules](#business-modules)
  - [Where each feature lives](#where-each-feature-lives)
- [Shared user experience](#shared-user-experience)
  - [Authentication and application shell](#authentication-and-application-shell)
  - [Dashboard and list tools](#dashboard-and-list-tools)
  - [Editing and unsaved changes](#editing-and-unsaved-changes)
  - [Documents](#documents)
- [Architecture](#architecture)
  - [Application composition](#application-composition)
  - [Source map](#source-map)
  - [Where to make changes](#where-to-make-changes)
  - [Navigation](#navigation)
  - [Editing](#editing)
  - [API client and authentication](#api-client-and-authentication)
  - [UI and styling](#ui-and-styling)
- [Local development](#local-development)
- [Commands](#commands)
- [Testing](#testing)
- [Production build and hosting](#production-build-and-hosting)

## Feature guide

### Business modules

| Feature           | User-facing capabilities                                                                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clients`         | List, create, inspect, edit, and delete clients; switch between general and orthopedic data; select municipalities and doctors; open the privacy form; start a quote for the selected client                        |
| `doctors`         | Maintain doctor identity, contact details, and notes                                                                                                                                                                |
| `healthCompanies` | Maintain municipality, region, company, population, year, and district data                                                                                                                                         |
| `products`        | Maintain nomenclatore codes, descriptions, prices, and catalogue years                                                                                                                                              |
| `quotes`          | Create and edit quotes and line items, search the active catalogue, display historical selections, calculate draft totals, apply allowed status changes, follow linked work orders, and generate delivery documents |
| `workOrders`      | Inspect and edit work-order lifecycle, trials, checks, technical assistance, production lines, conditional delivery/cancellation dates, status, and the testing sheet                                               |
| `configurations`  | Read the quote states and permitted transitions stored in the backend database                                                                                                                                      |
| `employees`       | Search, filter, and export the read-only legacy employee list                                                                                                                                                       |
| `dashboard`       | View quote workload counters and open status-filtered quote lists                                                                                                                                                   |

Work orders are created by a qualifying quote status change; there is deliberately
no manual work-order creation screen. Configuration and employee screens are also
read-only in the current interface.

### Where each feature lives

Most business modules use the same internal organization:

```text
src/features/<feature>/
├── api/             # backend calls and payload types
├── components/      # feature-owned reusable UI
├── views/           # list, create, and detail screens
├── types.ts         # API and view models
├── editing.ts       # validation, diffing, and payload conversion
└── use*Editor.ts    # typed access to the shared edit session
```

Smaller or read-only modules include only the folders they need.

## Shared user experience

### Authentication and application shell

- Username/email and password login against the backend's legacy accounts.
- Bearer-token persistence in `localStorage` and session restoration after reload.
- Automatic return to the login screen when any API request receives HTTP 401.
- Responsive permanent sidebar on large screens and an off-canvas menu on smaller
  viewports.
- Typed navigation with back history and direct links between related clients,
  products, quotes, and work orders.

### Dashboard and list tools

- Dashboard cards for quotes in `INSERITO`, `INVIATO`, and `IN LAVORAZIONE`, with
  one-click navigation to a prefiltered quote list.
- Reusable management tables with loading, error, and empty states.
- Case-insensitive cross-column search, per-column filters, client-side pagination,
  horizontal scrolling controls, and keyboard-accessible rows.
- CSV export of the currently filtered table. Exported files include a UTF-8 BOM
  and neutralize values that spreadsheet programs could interpret as formulas.

### Editing and unsaved changes

The application has one shared edit session rather than unrelated form state in
every screen. It provides a consistent bottom action bar, typed drafts, required
field validation, backend field-error highlighting, and a single save/cancel model.

Quote items and work-order items participate in the same save operation as their
parent record. If navigation would abandon unsaved changes, the user can save and
continue, discard and continue, or stay on the current screen. Duplicate save
requests are coalesced while a request is already in progress.

### Documents

Detail screens request generated PDFs with the same authenticated HTTP layer used
for JSON. The returned blob opens in a new browser tab, while API failures are shown
inside the current detail screen.

Available actions are:

- client privacy form;
- quote delivery form, with an optional delivery date;
- quote DDT, with optional prices;
- quote project sheet;
- work-order risk-assessment and testing sheet.

## Architecture

### Application composition

```text
main.tsx
└── App
    └── AuthProvider
        ├── LoginView                         # unauthenticated
        └── EntityEditProvider                # authenticated
            └── NavigationProvider
                └── AppLayout and active view
```

Authentication gates the private interface. Inside it, editing wraps navigation so
route changes can detect and resolve unsaved data before the active view changes.

### Source map

```text
frontend/
├── src/
│   ├── main.tsx                    # React root
│   ├── App.tsx                     # authentication gate and providers
│   ├── app/
│   │   ├── layout/                 # shell, sidebar, action bar, dialogs
│   │   ├── navigation/             # typed routes, history, navigation guards
│   │   └── editing/                # cross-feature edit session and registry
│   ├── features/                   # business modules and their screens
│   └── shared/
│       ├── api/                    # authenticated fetch client and ApiError
│       ├── entity/                 # tables, cards, fields, list/detail layouts
│       ├── files/                  # PDF blobs and CSV downloads
│       ├── format/                 # dates, money, and display formatting
│       ├── hooks/                  # API data, pagination, filtering, scrolling
│       └── ui/                     # small application-wide controls
├── tests/                          # Vitest suite mirroring src concerns
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── Dockerfile                     # static build served by unprivileged Nginx
└── nginx.conf
```

### Where to make changes

| Task                                             | Primary location                           |
| ------------------------------------------------ | ------------------------------------------ |
| Add or change a screen                           | `src/features/<feature>/views/`            |
| Add a feature API call                           | `src/features/<feature>/api/`              |
| Change a feature's fields or table columns       | Its `components/` or `views/`              |
| Change validation or save payloads               | `src/features/<feature>/editing.ts`        |
| Add an editable entity type                      | `src/app/editing/` and the feature editor  |
| Change routes or back behavior                   | `src/app/navigation/`                      |
| Change the sidebar or page shell                 | `src/app/layout/`                          |
| Change reusable tables, cards, or detail layouts | `src/shared/entity/`                       |
| Change authentication or HTTP errors             | `src/features/auth/` and `src/shared/api/` |
| Change PDF or CSV browser behavior               | `src/shared/files/`                        |
| Change colors, spacing, or typography            | `tailwind.config.js` and `src/index.css`   |

### Navigation

`NavigationContext` is a small typed router tailored to this application. Every
detail route carries its entity id, and the navigation reducer maintains a view
history used by back actions. Navigation is intentionally in memory rather than
URL-based: a full browser refresh restores authentication but starts again at the
dashboard, and individual views are not browser-bookmarkable.

Navigation is aware of the active edit session. A destination is deferred when it
would leave dirty data, then resumed only after the user resolves the unsaved-change
dialog.

### Editing

`EntityEditContext` owns the active entity, mode, original data, draft, invalid
fields, save state, and data version. `editRegistry.ts` connects each entity type to
its feature-owned validation and persistence operations. This keeps domain payload
rules inside the feature while preserving one application-wide editing experience.

Feature hooks such as `useClientEditor`, `useQuoteEditor`, and
`useWorkOrderEditor` provide typed access. Supplemental participants let nested
item tables join the parent save without moving their state into the global layer.

### API client and authentication

`shared/api/http.ts` is the only low-level HTTP entry point. It:

- resolves the API base URL from `VITE_API_BASE_URL`;
- adds the bearer token to every request;
- sends and parses JSON for GET, POST, PATCH, and DELETE helpers;
- retrieves document responses as blobs and extracts server filenames;
- converts the backend error envelope into `ApiError`, including field messages;
- translates network failures into a user-facing connection message; and
- notifies the authentication provider when a token is invalid or expired.

Feature API files contain endpoint paths and request/response types, leaving views
focused on interaction and presentation.

### UI and styling

The UI is implemented with Tailwind utility classes and a project-specific color,
spacing, and typography theme in `tailwind.config.js`. Shared entity components
keep tables, details, actions, dialogs, field editing, loading states, and responsive
horizontal overflow consistent across modules. No third-party component library or
client state-management package is required.

## Local development

### Prerequisites

- Node.js 20
- npm
- A running backend API, normally at `http://127.0.0.1:8000/api/v1`

### Setup and run

```bash
cd frontend
npm ci
cp .env.example .env.local
npm run dev
```

Vite serves the application at `http://localhost:5173` by default.

### Environment variables

| Variable            | Purpose                                           | Development default            |
| ------------------- | ------------------------------------------------- | ------------------------------ |
| `VITE_API_BASE_URL` | Absolute backend API prefix baked into the bundle | `http://127.0.0.1:8000/api/v1` |
| `VITE_BASE_PATH`    | Public path for root or subdirectory hosting      | `/`                            |

Vite variables are public build-time configuration, not secrets. A production
build fails when `VITE_API_BASE_URL` is missing, preventing a bundle from silently
calling the local API.

## Commands

Run these from `frontend/`:

| Command                 | Purpose                                                 |
| ----------------------- | ------------------------------------------------------- |
| `npm run dev`           | Start the Vite development server                       |
| `npm run build`         | Type-check and build the production bundle into `dist/` |
| `npm run preview`       | Serve the built bundle locally                          |
| `npm test`              | Run the Vitest suite once                               |
| `npm run test:watch`    | Run tests in watch mode                                 |
| `npm run test:coverage` | Produce text, HTML, and LCOV coverage reports           |
| `npm run lint`          | Run ESLint with zero warnings allowed                   |
| `npm run format:check`  | Check source formatting with Prettier                   |

## Testing

Tests use Vitest, jsdom, and Testing Library and live under `tests/`, grouped by
the source concern they exercise. Coverage includes:

- authentication and API error handling;
- navigation and unsaved edits;
- entity editing contracts;
- dashboard filtering and shared table behavior;
- quote and work-order item editing;
- CSV safety and document opening.

Use `npm test` for the normal suite or `npm run test:coverage` for text, HTML, and
LCOV coverage reports.

## Production build and hosting

The multi-stage `Dockerfile` builds the TypeScript/Vite bundle with Node 20 and
serves `dist/` from an unprivileged Nginx process on port 8080. `nginx.conf`
includes SPA fallback, a `/healthz` route, and basic response security headers.

The repository also contains a GitHub Pages workflow for the temporary demo.
Production targets, environment configuration, verification, and cutover procedures
are documented in [`../DEPLOYMENT.md`](../DEPLOYMENT.md).
