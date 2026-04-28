# ADR-004: AI Harness Scorecard

## Status

Accepted

## Context

The demo repo needs a way to prove its harness is comprehensive. Subjective claims ("we have good guardrails") are not convincing. We need a deterministic, reproducible grade.

## Decision

Integrate the [AI Harness Scorecard](https://github.com/markmishaev76/ai-harness-scorecard) as a GitHub Actions workflow that runs on every push to main and weekly.

## Rationale

- 31 deterministic checks across 5 categories — no LLM dependency
- Produces a machine-readable badge (JSON) and human-readable report (Markdown)
- Completes the demo's "before/after" story: bare repo = Grade F, harnessed repo = Grade B+
- Categories align with Harness Engineering pillars: Architectural Documentation (20%), Mechanical Constraints (25%), Testing & Stability (25%), Review & Drift Prevention (15%), AI-Specific Safeguards (15%)
- Auto-commits results so the grade is always visible in the repo

## Consequences

- `scorecard-badge.json` and `scorecard-report.md` are committed to repo root (not gitignored — they're part of the visibility story)
- Requires a GitHub remote and Actions enabled to actually run
- Badge in README references raw GitHub URL — works once remote is configured
