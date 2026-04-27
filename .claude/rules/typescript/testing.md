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

## Running Tests

```bash
npm test              # Standard output
npm run test:json     # JSON output to reports/test-results.json
```
