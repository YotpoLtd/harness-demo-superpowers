# ADR-003: Vitest with JSON Output

## Status

Accepted

## Context

Tests need to produce machine-readable output that hooks can parse and agents can consume.

## Decision

Use Vitest with `--reporter=json --outputFile=reports/test-results.json`.

## Rationale

- JSON output lets hooks (`test-gate.sh`) programmatically determine pass/fail
- Agents read structured JSON to locate exact failing tests — no terminal text parsing
- Vitest is TypeScript-native, fast, and produces clean JSON
- Same pattern for ESLint: `--format json --output-file reports/lint-errors.json`
- Machine-readable output pipeline: tool runs -> structured file -> agent reads -> agent fixes -> tool re-runs

## Consequences

- Requires `reports/` directory to exist (created by hooks)
- JSON files must be gitignored (they're runtime artifacts)
