# CLAUDE.md

## General Goal
Develop a web app for an orthopedic store that handles their day-to-day workflow.
The stack is a **React** frontend talking to a **Python / Django** backend (Django REST
Framework for the API). This is real software for a real business — every line is written
to **production-level standards**. Treat this as code that will be deployed, maintained,
and extended by others. There is no "throwaway" or "demo" code here.

## Operating standard
You operate at the most serious, professional, production-grade level at all times.
The three pillars, in priority order:

1. **Correctness** — the code does exactly what it should, including edge cases and failure paths.
2. **Modularity** — small, focused units with clear responsibilities and clean boundaries.
3. **Readability** — anyone on the team can understand the code without the author present.

If a fast hack and a correct solution diverge, take the correct solution. If the correct solution is large, surface it and let me decide — never silently ship the hack.

## Working style
- Before coding, restate the goal in one sentence and outline the approach. If anything is ambiguous, ask — do not guess.
- Read the relevant files end-to-end before editing. Understand the surrounding code, not just the target line.
- Make the smallest change that fully solves the problem at production quality. No drive-by refactors, no speculative abstractions.
- One concern per change. Keep edits reviewable.

## Tech stack & conventions
- **Frontend:** React. Function components and hooks only — no class components. Keep components small and presentational where possible; lift state and side effects deliberately. Co-locate component, styles, and tests.
- **Backend:** Python + Django, with Django REST Framework for the API. Follow Django's app-based structure — keep each app cohesive and focused on one domain area.
- **API boundary:** The frontend talks to the backend only through the documented REST API. No business logic in React that belongs on the server; no presentation concerns leaking into Django.
- **Models & migrations:** Business rules live in the Django models/services layer, not in views or serializers. Every schema change ships with its migration. Never edit a migration that has already been applied elsewhere.
- **Validation:** Validate and enforce invariants on the backend (serializers/models) as the source of truth. Frontend validation is for UX, never the security boundary.
- **Style:** Follow PEP 8 and idiomatic Django on the backend; follow the established React/JS(TS) conventions on the frontend. Match the linters/formatters configured in the repo — do not introduce a competing style.
- **Settings & secrets:** Keep Django settings environment-driven. No secrets, API keys, or environment-specific values committed to source.

## Architecture & modularity
- Design in modules with a well-defined responsibility. A function or file that does two unrelated things should be split.
- Keep clear separation of concerns: UI, business logic, data access, and configuration stay in distinct layers. Do not leak one into another.
- Depend on abstractions at layer boundaries, not on concrete implementation details from another layer.
- Keep functions short and composable. If a function needs scrolling to read, it is probably doing too much.
- No duplicated logic — extract a shared, well-named unit once a pattern repeats. But do not generalize before the second real use case appears.
- Public interfaces (exported functions, components, modules) should be minimal and intentional. Hide internals.

## Code quality
- Prioritize correctness, then clarity, then performance. Never trade correctness for brevity.
- Follow the conventions already in the file/module (naming, structure, error handling). Match the existing style.
- Names should explain intent. If a name needs a comment to be understood, rename it.
- Comments explain *why*, not *what*. The code should make the *what* obvious on its own.
- No dead code, no commented-out blocks, no TODOs left behind without a reason written next to them.
- Handle errors explicitly at boundaries; do not swallow exceptions or add empty catches.
- Validate inputs at trust boundaries only — do not add defensive checks for cases that cannot happen.
- Code is consistently formatted and lint-clean. Leave the file better than you found it within the task scope.

## Production readiness
- Assume this runs in production with real users and real data. Account for concurrency, partial failures, and bad input where they genuinely apply.
- Never log, expose, or hardcode secrets. Keep configuration and credentials out of source.
- Consider security and data integrity for anything touching user data, persistence, or external requests.
- Code should be testable. Prefer designs that allow logic to be exercised in isolation; add or update tests when the change warrants it.

## What to avoid
- No suboptimal "just to make it work" implementations. If the right fix is bigger, surface it before applying a shortcut.
- No premature optimization, no premature generalization.
- No new dependencies without a clear reason.
- No silent behavior changes to code outside the task scope.
- No fabricated APIs, types, or file paths — verify before referencing.

## Process
- After a change, explain what changed, why, and what was deliberately left out.
- If a decision has trade-offs, state them briefly so I can confirm.
- If you discover an unrelated bug or smell, report it — do not fix it inline unless I agree.
- When unsure, stop and ask. A clarifying question is always cheaper than a wrong implementation.

## Tone
- Be concise and direct. No filler, no unnecessary recaps.
- Disagree when you have a reason. Do not rubber-stamp my ideas if they are wrong.
