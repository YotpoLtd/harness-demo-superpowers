# Design-Before-Code Process

This project requires a design document before implementation of significant changes. The process is enforced through the Superpowers skill chain.

## Workflow

1. **Brainstorming** — collaborative dialogue to understand the problem, explore approaches, and produce a design spec
2. **Spec** — written to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
3. **Plan** — implementation plan produced from the spec, saved to `docs/superpowers/plans/YYYY-MM-DD-<topic>.md`
4. **Implementation** — plan executed task-by-task with the gen-eval loop

## When to Write a Design Doc

- New endpoints or features
- Architectural changes
- Changes affecting multiple modules
- New dependencies or tooling

## When You Can Skip

- Bug fixes with obvious root cause
- Single-file config changes
- Documentation updates

## Artifacts

- **Specs:** `docs/superpowers/specs/`
- **Plans:** `docs/superpowers/plans/`
- **ADRs:** `docs/adr/` (for architectural decisions)
