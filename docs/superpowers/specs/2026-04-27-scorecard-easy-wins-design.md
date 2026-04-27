# Spec: Scorecard Easy Wins — Hooks + CI

## Why

The AI Harness Scorecard grades the repo at 25/100 (Grade F) despite having comprehensive agent-time enforcement via Claude Code hooks. The scorecard only inspects CI config and repo files — it can't see hooks. Adding CI as a second enforcement gate closes this blind spot (catches commits that bypass Claude Code) and raises the score to ~67/100.

## What Changes

- Add `ci.yml` workflow with parallel jobs: lint, format, test+coverage, audit, conventional commits, PR size labeler
- Add Prettier as formatter (config + devDependency)
- Add commitlint for commit message validation (config + devDependency)
- Add coverage reporting to Vitest config
- Add stricter ESLint rules for error handling
- Add GitHub config files: PR template, CODEOWNERS, SECURITY.md
- Rename `docs/adrs/` to `docs/adr/` to match adr-tools convention
- Add forbidden dependency constraints to ARCHITECTURE.md
- Add `docs/rfcs/` directory documenting design-before-code process
- Update all references (CLAUDE.md, README.md) to reflect changes

## Functional Requirements

1. The CI workflow SHALL run on every push to main and on pull requests
2. The lint job SHALL run `eslint src/ tests/` and fail on any errors
3. The format job SHALL run `prettier --check src/ tests/` and fail on unformatted files
4. The test job SHALL run `vitest run` with coverage enabled and fail on test failures
5. The audit job SHALL run `npm audit --audit-level=moderate` and fail on vulnerabilities
6. The commitlint step SHALL validate the most recent commit message against conventional commit format
7. ESLint config SHALL include `no-throw-literal`, `@typescript-eslint/no-floating-promises`, and `@typescript-eslint/strict-boolean-expressions` rules
8. Prettier config SHALL use consistent defaults (double quotes, trailing commas, 100 char print width to match existing code style)
9. The PR size labeler (`CodelyTV/pr-size-labeler`) SHALL label PRs by diff size (informational, non-blocking)
10. The `docs/adr/` directory SHALL contain all existing ADRs with no broken references
11. ARCHITECTURE.md SHALL include an explicit "Forbidden Dependencies" section with negative constraints
12. `docs/rfcs/README.md` SHALL document the design-before-code process and point to Superpowers specs/plans directories

## Acceptance Criteria

1. Given a push to main, when CI runs, then lint, format, test, and audit jobs all execute in parallel
2. Given an ESLint error exists, when the lint job runs, then CI fails
3. Given an unformatted file exists, when the format job runs, then CI fails
4. Given a test failure exists, when the test job runs, then CI fails
5. Given a known vulnerability exists, when the audit job runs, then CI fails
6. Given a non-conventional commit message, when commitlint runs, then the check fails
7. Given a PR is opened, when the size labeler runs, then the PR is labeled with its size category
8. Given the existing codebase, when `npx prettier --check src/ tests/` runs locally, then all files pass (no formatting drift introduced)
9. Given the existing codebase, when the new ESLint rules are applied, then all files pass (no new lint errors introduced)
10. Given the ADR rename, when any file references `docs/adrs/`, then it has been updated to `docs/adr/`
11. Given the ARCHITECTURE.md update, when the scorecard checks for module boundaries, then the "Forbidden Dependencies" section satisfies the check
12. All existing tests continue to pass

## Affected Files

- Create: `.github/workflows/ci.yml`
- Create: `.prettierrc`
- Create: `.commitlintrc.json`
- Create: `.github/PULL_REQUEST_TEMPLATE.md`
- Create: `.github/CODEOWNERS`
- Create: `SECURITY.md`
- Create: `docs/rfcs/README.md`
- Modify: `package.json` — add prettier, commitlint devDependencies
- Modify: `vitest.config.ts` — add coverage config
- Modify: `eslint.config.js` — add error handling rules
- Modify: `ARCHITECTURE.md` — add Forbidden Dependencies section
- Modify: `CLAUDE.md` — update ADR path, add CI reference
- Modify: `README.md` — update ADR path references
- Rename: `docs/adrs/` to `docs/adr/`

## Out of Scope

- Branch protection settings (requires GitHub admin UI, not files)
- Mutation testing, fuzz testing, property-based testing, contract tests (expensive, overkill for demo)
- Feature matrix testing (single environment is sufficient for demo)
- Automated code review tools like CodeRabbit (external service integration)
- Stale documentation detection / doc sync checks (low ROI for demo)
- API documentation / OpenAPI specs (the API is intentionally trivial)
- Husky git hooks (commitlint runs in CI only, avoiding local hook complexity)
