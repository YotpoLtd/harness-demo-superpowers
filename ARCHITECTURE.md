# Architecture

## Overview

A minimal Express REST API for managing todo items, with in-memory storage.
The application is intentionally trivial — the harness around it is the point.

## Module Boundaries

```
src/
├── index.ts          # App factory + server bootstrap (serves static + API)
├── routes/todos.ts   # Todo CRUD handlers (owns todo state)
└── types.ts          # Shared type definitions (no logic)

public/
└── index.html        # Static todo UI (vanilla HTML/CSS/JS, no framework)

e2e/
└── todos.spec.ts     # Playwright E2E tests against running server
```

### Dependency Rules

- `routes/todos.ts` depends on `types.ts` — NEVER the reverse
- `index.ts` depends on `routes/todos.ts` — mounts the router
- `types.ts` has ZERO dependencies — pure type definitions
- No circular dependencies between any modules

### Forbidden Dependencies

These constraints define what must NOT happen — violations break module isolation:

- `types.ts` MUST NOT import any other module (it is a leaf dependency)
- `routes/todos.ts` MUST NOT import `index.ts` (routes must not depend on the app bootstrap)
- No module in `src/` MUST NOT import from `tests/` (production code never depends on test code)
- No module MUST NOT import directly from `node_modules` paths — use package names only
- `index.ts` MUST NOT contain business logic — it is purely app assembly and server bootstrap

### Data Flow

```
Browser (public/index.html)
    → fetch("/todos", ...)
    → Express middleware (JSON parsing, static serving)
    → Router (routes/todos.ts)
    → In-memory array (immutable updates)
    → JSON response
    → UI re-renders
```

### Storage

In-memory array. No database. State resets on restart. This is deliberate (see ADR-001).

The todo array is owned by `createTodoRouter()` — it is not a global. Each call to `createApp()` gets isolated state. This enables test isolation without cleanup.

### Testing Strategy

Two layers:

| Layer | Tool | Runs against | Purpose |
|-------|------|-------------|---------|
| Unit/Integration | Vitest + Supertest | In-memory app (`createApp()`) | Fast, isolated API logic tests |
| E2E | Playwright | Real server (`npm run dev`) | Full browser UI flows with video recording |

- Each Vitest test creates its own app instance — full isolation, no shared state
- Playwright tests launch the dev server, open Chromium, interact with the UI
- Video recordings saved to `test-results/` for debugging and demo purposes
- Both suites must pass before PR creation (enforced by test-gate hook + CI)

### Extension Points

When adding new endpoints:
1. Add handler in `routes/todos.ts` (if todo-related)
2. Add new router file in `routes/` (if new domain)
3. Mount in `index.ts`
4. Add types in `types.ts`
5. Add tests in `tests/`

When adding UI features:
1. Update `public/index.html` — add elements with `data-testid` attributes
2. Add Playwright E2E tests in `e2e/` covering the new interactions
3. Run `npm run test:e2e` to verify
