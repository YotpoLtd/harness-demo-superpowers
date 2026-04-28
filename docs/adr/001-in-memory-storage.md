# ADR-001: In-Memory Storage

## Status

Accepted

## Context

This demo needs a data storage mechanism for todo items. Options: PostgreSQL, SQLite, file-based, or in-memory array.

## Decision

Use an in-memory array with immutable updates. No database.

## Rationale

- The app is intentionally trivial — the harness is the point, not the app
- In-memory storage means zero setup: `git clone` and `npm install` is all you need
- Factory function pattern (`createTodoRouter()`) gives each test its own isolated state
- Adding a database is a planned future extension (after the harness is proven)

## Consequences

- State resets on server restart
- No persistence across sessions
- Cannot demonstrate database migration harness patterns (yet)
