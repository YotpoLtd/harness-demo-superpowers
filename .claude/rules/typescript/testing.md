# Testing Standards

## Framework

Vitest with supertest for HTTP testing. JSON reporter for machine-readable output.

## Test Structure

- One test file per source module: `tests/<module>.test.ts`
- Use `describe` blocks grouped by endpoint or feature
- Each test creates its own `createApp()` instance — full isolation
- No shared state between tests

## TDD Workflow

MANDATORY:
1. Write the failing test first
2. Run it — verify it fails for the right reason
3. Write minimal implementation to pass
4. Run it — verify it passes
5. Refactor if needed
6. Commit

## What to Test

- Happy path for every endpoint
- Validation errors (missing fields, wrong types)
- Edge cases (empty strings, very long strings)
- State changes (POST then GET to verify persistence)

## E2E Testing (Playwright)

Every feature that touches the UI MUST include corresponding Playwright E2E tests in `e2e/`.

### Two-Layer Testing Strategy

| Layer | Tool | Target | When to use |
|-------|------|--------|-------------|
| Unit/Integration | Vitest + Supertest | In-memory app | API logic, validation, edge cases |
| E2E | Playwright | Built/running server | UI flows, full-stack user interactions |

### E2E Test Structure

- Tests live in `e2e/` directory (separate from Vitest `tests/`)
- Use `data-testid` attributes for stable selectors — never rely on text content or CSS classes
- Playwright auto-starts the dev server via `webServer` config
- Video recording is enabled — recordings saved to `test-results/`
- `slowMo: 500` makes videos watchable for demo purposes

### When to Write E2E Tests

- Any new UI interaction (button, form, navigation)
- Any change to how the UI communicates with the API
- Any visual state change (loading, error, empty state)

## Running Tests

```bash
npm test              # Unit/integration (Vitest)
npm run test:json     # JSON output to reports/test-results.json
npm run test:e2e      # E2E (Playwright, headless)
npm run test:e2e:headed  # E2E (visible browser for debugging)
```

Both `npm test` AND `npm run test:e2e` must pass before a branch is complete.
