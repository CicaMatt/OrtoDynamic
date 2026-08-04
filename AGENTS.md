# OrtoDynamic agent guide

This file applies to the entire repository. Use it as the development policy for
all future changes.

## Start with the documentation

Do not duplicate application details here. Read the relevant README before changing
code:

- [`README.md`](README.md) explains the application, its end-to-end workflow,
  repository layout, local startup, verification, and deployment entry points.
- [`frontend/README.md`](frontend/README.md) explains frontend features, source
  ownership, navigation, editing, API integration, commands, and tests.
- [`backend/README.md`](backend/README.md) explains backend modules, request flow,
  business rules, API routes, legacy database constraints, configuration, and tests.
- [`DEPLOYMENT.md`](DEPLOYMENT.md) is the operational reference for hosted
  environments. Read it only when a change affects deployment or infrastructure.

When documentation and implementation disagree, inspect the current code and tests
before acting. Update the relevant README if the intended behavior or structure has
changed.

## Primary engineering direction

Every change must primarily promote:

1. **Minimalism** — implement only what is required for the current behavior.
2. **Slimness** — keep the dependency graph, public surface, state, and number of
   concepts as small as practical.
3. **Simplicity** — prefer direct, unsurprising solutions over clever or highly
   configurable ones.
4. **Readability** — make ownership, naming, and control flow obvious to the next
   reader.

The goal is a codebase that can be understood by following a short, visible path
from the user action to the database and back.

Minimalism does not mean compressing code or hiding behavior. A few explicit lines
are better than a dense abstraction. Slimness does not mean placing unrelated logic
in one large file. Keep units cohesive without fragmenting a simple operation across
many tiny indirections.

## Development rules

### Make the smallest coherent change

- Solve the requested problem without adding speculative extension points.
- Avoid unrelated refactors, broad renames, or opportunistic rewrites.
- Extend an established local pattern before introducing a competing one.
- Remove obsolete branches when a new path fully replaces them; do not preserve
  dead compatibility layers without a demonstrated need.
- Keep the diff easy to review. Each changed file should have a clear reason to be
  part of the task.

### Keep code flows direct

The expected backend flow is:

```text
URL → view → serializer → selector/service → model → existing database
```

The expected frontend flow is:

```text
view/component → feature hook or feature API → shared HTTP client → backend
```

Do not skip layers in a way that obscures ownership. Do not add layers that merely
forward arguments without clarifying a real boundary.

### Prefer clear ownership

- Put domain-specific behavior in the domain or feature that owns it.
- Keep backend views focused on HTTP concerns, serializers focused on contracts and
  validation, selectors focused on reads, and services focused on business writes.
- Keep frontend views focused on composition and interaction. Put endpoint calls in
  the owning feature's `api/` folder and shared UI behavior in `src/shared/` only
  when it is genuinely shared.
- Maintain one source of truth for each rule. Backend validation and services are
  authoritative for persisted business rules; frontend validation exists for
  immediate user guidance.
- Prefer local state. Promote state to a context or shared abstraction only when
  multiple independent consumers truly need the same lifecycle.

### Use restrained abstractions

- Do not create a reusable abstraction for a single trivial use.
- Extract code when it removes meaningful duplication, names a domain concept, or
  isolates a genuine boundary.
- Prefer small, descriptive functions with a single purpose.
- Avoid generic frameworks, registries, factories, configuration layers, or helper
  wrappers when ordinary functions and data structures are sufficient.
- Avoid Boolean-heavy interfaces and hidden side effects. Make important choices
  explicit at the call site.
- Favor composition over inheritance unless an existing framework convention makes
  inheritance the clearer option.

### Optimize for reading

- Use domain language and descriptive names. Avoid unexplained abbreviations.
- Keep the happy path visually obvious and return early for exceptional cases.
- Keep related code close together and order functions from public behavior toward
  implementation detail.
- Comments should explain constraints, historical reasons, or non-obvious decisions.
  Do not narrate code that already explains itself.
- Prefer explicit types and narrow contracts. Avoid `any`, loosely shaped data, and
  overly broad parameters.
- Match the surrounding style instead of introducing personal conventions.

### Keep dependencies and configuration lean

- Prefer the standard library, installed framework capabilities, and existing
  project utilities.
- Add a dependency only when it materially reduces risk or complexity and cannot be
  implemented clearly with what is already available.
- Do not add packages for small formatting, state, routing, or utility needs that
  the current stack already handles.
- Avoid new environment variables and feature flags unless behavior must genuinely
  differ between environments.
- If a dependency or configuration key becomes unused, remove it as part of the
  same coherent change when safe.

## Backend constraints

- The operational database is externally owned. Domain models are unmanaged;
  ordinary feature work must not introduce migrations for legacy business tables.
- Preserve the versioned `/api/v1/` contract and the shared error envelope.
- Preserve camelCase API fields consumed by the frontend unless the task explicitly
  includes a coordinated contract change.
- Keep authentication stateless and maintain the default authenticated endpoint
  policy.
- Use selectors for composed reads and services for multi-record writes or business
  invariants. Plain single-record CRUD does not need ceremonial service wrappers.
- Preserve update locking and explicit cleanup where legacy non-transactional
  tables require it.
- Keep document input selection, data preparation, and PDF rendering separate.

Consult [`backend/README.md`](backend/README.md) before changing catalogue pricing,
quote status transitions, work-order creation, deletion behavior, document assets,
or database configuration.

## Frontend constraints

- Preserve the feature-first structure under `src/features/` and the narrow shared
  layer under `src/shared/`.
- Use the existing authenticated HTTP client instead of calling `fetch` directly in
  views or components.
- Preserve typed in-memory navigation and its unsaved-change guard unless a task
  explicitly replaces the navigation model as a whole.
- Integrate editable entities with the established edit session so save, cancel,
  invalid fields, nested participants, and navigation blocking remain consistent.
- Reuse shared entity and UI components when they already express the required
  interaction. Do not force unique behavior into a generic component solely to
  avoid a small amount of local code.
- Keep domain payload conversion and validation in the owning feature.
- Maintain responsive behavior and keyboard-accessible interaction states.

Consult [`frontend/README.md`](frontend/README.md) for the feature map and the
“Where to make changes” table before adding screens, routes, shared components, or
editing behavior.

## Working process

For every task:

1. Read the relevant README sections.
2. Trace the current behavior from its entry point through the owning modules and
   tests.
3. Identify the smallest set of files that can implement the change cleanly.
4. Follow existing patterns and keep new concepts to a minimum.
5. Add or update focused tests for changed behavior.
6. Run the checks appropriate to the changed module.
7. Review the final diff for unnecessary files, abstractions, dependencies,
   configuration, comments, and duplication.
8. Update documentation only when commands, behavior, structure, contracts, or
   operational requirements changed.

## Verification

Run focused checks during development, then use the repository-wide check when the
change is complete:

```bash
./scripts/check.sh
```

With the backend virtual environment active, this verifies frontend tests, lint,
formatting, and build, followed by backend Ruff and pytest checks. Coverage is
available through:

```bash
./scripts/coverage.sh
```

Do not weaken, skip, or delete a failing check merely to make a change pass. Fix the
cause, or clearly report an external blocker.

## Final review checklist

Before considering a change complete, confirm that:

- the result implements the requested behavior and nothing materially broader;
- the code flow is shorter or at least no harder to follow;
- names and module ownership make the behavior discoverable;
- no unnecessary abstraction, dependency, state, configuration, or compatibility
  path was added;
- backend and frontend rules are not duplicated as competing sources of truth;
- error, loading, empty, and concurrent-edit paths remain understandable;
- tests cover the changed behavior at the narrowest useful level; and
- the relevant README still describes the application accurately.
