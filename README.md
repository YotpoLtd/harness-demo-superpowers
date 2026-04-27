# Harness Demo — Superpowers Edition

<!-- Badge: uncomment when repo is public (Shields.io can't access private raw files)
![AI Harness Score](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/YotpoLtd/harness-demo-superpowers/main/scorecard-badge.json)
-->

A minimal TypeScript API wrapped in a full harness built on **Superpowers skills + Claude Code hooks**. The app is intentionally trivial — the value is in the orchestration layer around it demonstrating every concept from Harness Engineering.

**The app is not the point. The harness is the point.**

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed
- [Superpowers](https://github.com/claude-plugins-official/superpowers) plugin installed
- Node.js 20+

## Setup

```bash
git clone <this-repo>
cd harness-demo-superpowers
npm install
npm test  # Verify everything works
```

## Try It

### Path 1: Guided Demo (Skip Brainstorming)

Open Claude Code in this repo and run:

```
Implement the spec at specs/add-delete-endpoint.md
```

This enters the pipeline at **writing-plans** (skipping brainstorming since the spec already exists), then:
- Creates a bite-sized implementation plan
- On your approval, runs **subagent-driven-development** (the gen-eval loop)
- Each task: implementer -> spec-reviewer -> code-quality-reviewer -> iterate until approved
- Finishes with **finishing-a-development-branch** (git operations)
- **Stop hooks fire:** test-gate verifies all tests pass, report generates session summary

After the session, inspect `reports/` to see the full audit trail.

### Path 2: Full Pipeline (From Scratch)

```
Add a PATCH /todos/:id endpoint that updates a todo's title and completed status
```

This enters the full pipeline:
1. **Brainstorming** — clarifies requirements, produces a design spec
2. **Writing Plans** — creates implementation plan from the spec
3. **Subagent-Driven Development** — executes with gen-eval loop
4. **Finishing** — git operations
5. **Stop hooks** — test-gate + report generation

## What's in the Harness

### Mechanical Enforcement (Hooks)

| Hook | Event | What It Does |
|------|-------|-------------|
| `permission-guard.sh` | PreToolUse (Bash) | Blocks `--force`, `--no-verify`, `rm -rf` |
| `lint-gate.sh` | PostToolUse (Write\|Edit) | ESLint -> JSON, blocks on errors |
| `subagent-capture.sh` | PostToolUse (Agent) | Saves subagent output to `reports/reviews/` |
| `audit-log.sh` | PostToolUse (*) | Logs all tool calls to `reports/audit.jsonl` |
| `test-gate.sh` | Stop | Vitest -> JSON, blocks on failures |
| `report.sh` | Stop | Generates `reports/session-report.md` |

### Context Engineering

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Workflow rules, progressive disclosure map (~100 lines) |
| `ARCHITECTURE.md` | Module boundaries, data flow, dependency rules |
| `PROGRESS.md` | Agent session handoff file |
| `.claude/rules/` | Scoped coding standards (common + TypeScript) |
| `docs/adrs/` | Architecture Decision Records (why, not what) |

### The Gen-Eval Loop

The `subagent-driven-development` Superpowers skill orchestrates:

```
Per task:
  Implementer subagent (fresh context, TDD)
      -> Spec reviewer subagent (fresh context, grades against spec)
      -> Code quality reviewer subagent (fresh context, grades against rules)
      -> If rejected: implementer fixes, re-review
      -> If approved: next task
```

Maximum 5 iterations per task. All reviewer verdicts saved to `reports/reviews/`.

## Reports

After any session, check `reports/`:

```
reports/
├── audit.jsonl              # Every tool call logged
├── lint-errors.json         # Last ESLint run
├── test-results.json        # Final test results
├── session-report.md        # Human-readable summary
└── reviews/                 # Subagent reviewer verdicts
    ├── 2026-04-27T10-30-00-spec-review-task1.md
    └── ...
```

## Scorecard

The [AI Harness Scorecard](https://github.com/markmishaev76/ai-harness-scorecard) runs on every push to main via GitHub Actions. It grades the repo across 31 deterministic checks in 5 categories:

| Category | Weight |
|----------|--------|
| Architectural Documentation | 20% |
| Mechanical Constraints | 25% |
| Testing & Stability | 25% |
| Review & Drift Prevention | 15% |
| AI-Specific Safeguards | 15% |

Results are committed as `scorecard-badge.json` and `scorecard-report.md` at the repo root. See [ADR-004](docs/adrs/004-harness-scorecard.md) for the decision rationale.

## What This Proves

| Harness Engineering Concept | How It's Demonstrated |
|---|---|
| Mechanical Enforcement | Hooks block bad code deterministically — no LLM judgment |
| Generator-Evaluator Pattern | SDD skill: implementer -> spec-reviewer -> quality-reviewer loop |
| Context Engineering | CLAUDE.md + scoped rules + ADRs + ARCHITECTURE.md |
| Progressive Disclosure | CLAUDE.md is the map, deep docs are fetched on demand |
| Machine-Readable Output | ESLint/Vitest -> JSON files, agents parse and fix |
| Observability | Audit log + subagent capture + session report |
| Entropy Management | Stop hooks enforce quality gates before session ends |
