# Harness Demo — Superpowers Edition

A minimal TypeScript API wrapped in a full harness built on Superpowers skills + Claude Code hooks.
The app is intentionally trivial — the value is in the orchestration layer around it.

## Quick Reference

- **Build:** `npm run build`
- **Test:** `npm test`
- **Test (JSON):** `npm run test:json`
- **Lint:** `npm run lint`
- **Dev server:** `npm run dev`

## Workflow

ALL implementation requests follow this pipeline — no exceptions, no shortcuts:

1. Invoke `superpowers:brainstorming` — explore intent, clarify, produce spec
2. Invoke `superpowers:writing-plans` — create plan from spec, get approval
3. On plan approval -> invoke `superpowers:subagent-driven-development` — execute all tasks with gen-eval loop
4. On completion -> invoke `superpowers:finishing-a-development-branch` — handle git
5. After finishing -> Stop hook fires test-gate and report generation

"Approved" or "Go" on the plan means: execute ALL tasks without pausing between them.
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
- **test-gate.sh** — Stop: Vitest -> `reports/test-results.json`, blocks on failure
- **report.sh** — Stop: generates `reports/session-report.md`

## Specs and Plans (The Lifecycle)

The Superpowers skill chain produces artifacts at each stage:

1. **Brainstorming** produces a spec -> `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
2. **Writing Plans** reads the spec, produces a plan -> `docs/superpowers/plans/YYYY-MM-DD-<topic>.md`
3. **SDD** executes the plan task by task with the gen-eval loop
4. **Finishing** handles git operations

Pre-written specs for guided demo (shortcutting brainstorming): `specs/`

## ADRs

Architecture Decision Records in `docs/adrs/`. Read these before proposing changes to:
- Storage mechanism (ADR-001)
- Framework choice (ADR-002)
- Testing/reporting approach (ADR-003)
