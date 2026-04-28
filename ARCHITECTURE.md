# Architecture

## Overview

A minimal Express REST API for managing todo items, with in-memory storage.
The application is intentionally trivial — the harness around it is the point.

## Module Boundaries

```
src/
├── index.ts          # App factory + server bootstrap
├── routes/todos.ts   # Todo CRUD handlers (owns todo state)
└── types.ts          # Shared type definitions (no logic)
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
Client Request
    → Express middleware (JSON parsing)
    → Router (routes/todos.ts)
    → In-memory array (immutable updates)
    → JSON response
```

### Storage

In-memory array. No database. State resets on restart. This is deliberate (see ADR-001).

The todo array is owned by `createTodoRouter()` — it is not a global. Each call to `createApp()` gets isolated state. This enables test isolation without cleanup.

### Testing Strategy

- Supertest for HTTP-level integration tests
- Each test creates its own app instance via `createApp()` — full isolation
- Vitest with JSON reporter for machine-readable output
- No mocks — the app is simple enough to test end-to-end

### Extension Points

When adding new endpoints:
1. Add handler in `routes/todos.ts` (if todo-related)
2. Add new router file in `routes/` (if new domain)
3. Mount in `index.ts`
4. Add types in `types.ts`
5. Add tests in `tests/`
