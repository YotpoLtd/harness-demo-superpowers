# Harness Demo — Superpowers Edition

A minimal TypeScript API wrapped in a full harness built on Superpowers skills + Claude Code hooks.
The app is intentionally trivial — the value is in the orchestration layer around it.

## Quick Reference

- **Build:** `npm run build`
- **Test (unit/integration):** `npm test`
- **Test (JSON):** `npm run test:json`
- **Test (E2E):** `npm run test:e2e`
- **Test (E2E, visible browser):** `npm run test:e2e:headed`
- **Lint:** `npm run lint`
- **Dev server:** `npm run dev`

## Testing Gates

Both test suites MUST pass before a branch is considered complete or a PR is created:

1. `npm test` — unit/integration tests (Vitest + Supertest, in-memory app)
2. `npm run test:e2e` — end-to-end tests (Playwright against running server with video recording)

The `test-gate.sh` Stop hook enforces both gates mechanically. CI enforces them on the PR.

## Workflow

ALL implementation requests follow this pipeline — no exceptions, no shortcuts:

1. Receive intent from the developer — a short description of what they want built
2. Invoke `superpowers:brainstorming` — explore intent, clarify, produce spec saved to `docs/superpowers/specs/`
3. **PAUSE — developer reviews and approves the spec before proceeding**
4. On spec approval -> invoke `superpowers:writing-plans` — create plan from spec, get approval
5. On plan approval -> invoke `superpowers:subagent-driven-development` — execute all tasks with gen-eval loop
6. On completion -> invoke `superpowers:finishing-a-development-branch` — handle git
7. After finishing -> Stop hook fires test-gate and report generation

"Approved" or "Go" applies at two gates: spec approval (step 3) and plan approval (step 5).
On approval, execute ALL subsequent tasks without pausing.
The only mid-execution pause is if a subagent has a blocking question.

## Gen-Eval Loop

- Maximum iterations per task: 5
- If a task fails 5 review cycles, stop and flag for human intervention
- Spec-reviewer MUST grade against acceptance criteria in the spec — not general vibes
- Code-quality-reviewer MUST check against rules in `.claude/rules/`

## Subagent Reports

- Every reviewer subagent MUST write its verdict to `reports/reviews/`
- Format: pass/fail, specific findings, files reviewed, iteration number
- These persist after the session for human inspection

## Architecture

See `ARCHITECTURE.md` for module boundaries and data flow.

## Rules

Scoped rules live in `.claude/rules/`:
- `common/general.md` — language-agnostic coding standards
- `typescript/conventions.md` — TypeScript patterns and constraints
- `typescript/testing.md` — testing standards

## Hooks (Mechanical Enforcement)

All hooks in `.claude/hooks/` fire automatically via `.claude/settings.json`:
- **permission-guard.sh** — PreToolUse on Bash: blocks `--force`, `--no-verify`, `rm -rf`
- **lint-gate.sh** — PostToolUse on Write|Edit: ESLint -> `reports/lint-errors.json`
- **subagent-capture.sh** — PostToolUse on Agent: saves output -> `reports/reviews/`
- **audit-log.sh** — PostToolUse on all: appends to `reports/audit.jsonl`
- **test-gate.sh** — Stop: Vitest + Playwright E2E -> `reports/test-results.json`, blocks on failure
- **report.sh** — Stop: generates `reports/session-report.md`

## Specs and Plans (The Lifecycle)

The Superpowers skill chain produces artifacts at each stage:

1. **Brainstorming** produces a spec -> `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
2. **Developer reviews and approves the spec**
3. **Writing Plans** reads the approved spec, produces a plan -> `docs/superpowers/plans/YYYY-MM-DD-<topic>.md`
4. **SDD** executes the plan task by task with the gen-eval loop
5. **Finishing** handles git operations

## CI

GitHub Actions workflow (`.github/workflows/ci.yml`) enforces on every push and PR:
- ESLint (same rules as lint-gate hook)
- Prettier format check
- Vitest with coverage
- Playwright E2E tests
- npm audit
- commitlint (conventional commits)

CI is the second enforcement gate — hooks catch issues during agent work, CI catches everything else.


## ADRs

Architecture Decision Records in `docs/adr/`. Read these before proposing changes to:
- Storage mechanism (ADR-001)
- Framework choice (ADR-002)
- Testing/reporting approach (ADR-003)
