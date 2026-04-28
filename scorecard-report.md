# AI Harness Scorecard: harness-demo-superpowers

**Grade: B** (74.6/100) | Good foundation. Some gaps in enforcement or feedback loops.

- **Repository**: `/home/runner/work/harness-demo-superpowers/harness-demo-superpowers`
- **Languages**: javascript, typescript
- **Assessed**: 2026-04-28 05:46 UTC
- **Checks**: 22/31 passed

## Summary

| Category | Weight | Score | Checks |
|----------|--------|-------|--------|
| Architectural Documentation | 20% | 85% [########--] | 4/5 |
| Mechanical Constraints | 25% | 86% [#########-] | 6/7 |
| Testing & Stability | 25% | 48% [#####-----] | 4/8 |
| Review & Drift Prevention | 15% | 60% [######----] | 3/6 |
| AI-Specific Safeguards | 15% | 100% [##########] | 5/5 |

## Architectural Documentation (85%)

### [PASS] Architecture Documentation (5/5)

_matklad ARCHITECTURE.md guide_

**Evidence**: Found: ARCHITECTURE.md

### [PASS] Agent Instructions (5/5)

_OpenAI Harness Engineering (2026)_

**Evidence**: Found: CLAUDE.md

### [PASS] Architecture Decision Records (3/3)

_DORA 2025 Report - AI-accessible documentation_

**Evidence**: Found ADR directory: docs/adr

### [PASS] Module Boundary Documentation (4/4)

_matklad ARCHITECTURE.md - constraints as absences_

**Evidence**: Module boundary constraints found in ARCHITECTURE.md

### [FAIL] API Documentation (0/3)

_DORA 2025 - AI-accessible documentation_

**Evidence**: No API documentation generation or spec files found

**Remediation**: Add doc generation to CI (cargo doc, typedoc, sphinx) or maintain OpenAPI/Swagger specs.


## Mechanical Constraints (86%)

### [PASS] CI Pipeline (3/3)

_DORA 2025 Report_

**Evidence**: CI detected: github, github, github

### [PASS] Linter Enforcement (4/4)

_OpenAI Harness Engineering - mechanical constraints_

**Evidence**: Blocking linter found in CI: eslint

### [PASS] Formatter Enforcement (3/3)

_OpenAI Harness Engineering - mechanical constraints_

**Evidence**: Formatter check found in CI: prettier\s+--check

### [PASS] Type Safety (3/3)

_SlopCodeBench - preventing subtle type errors_

**Evidence**: TypeScript strict mode enabled

### [PASS] Dependency Auditing (4/4)

_Blog: security infrastructure reliability_

**Evidence**: Blocking dependency audit in CI: npm\s+audit

### [PASS] Conventional Commits (2/2)

_DORA 2025 - working in small batches_

**Evidence**: Conventional commit enforcement found in CI

### [FAIL] Unsafe Code Policy (0/3)

_Blog: 80% problem in AI-generated code_

**Evidence**: No explicit policy against unsafe code patterns

**Remediation**: Add unsafe_code = forbid (Rust), security linting (semgrep/bandit), or ESLint rules against dangerous patterns.


## Testing & Stability (48%)

### [PASS] Test Suite (3/3)

_Kent Beck - tests define what correct means_

**Evidence**: Tests present and executed in CI

### [PASS] Feature Matrix Testing (3/3)

_DORA 2025 - stability through comprehensive testing_

**Evidence**: Multiple test jobs in CI: lint, format, test

### [PASS] Code Coverage (4/4)

_DORA 2025 - stability feedback loops_

**Evidence**: Coverage measurement in CI: coverage\.py|pytest-cov|--cov

### [FAIL] Mutation Testing (0/4)

_SlopCodeBench - code that 'appears correct but is unreliable'_

**Evidence**: No mutation testing found

**Remediation**: Add cargo-mutants (Rust), Stryker (JS/TS), mutmut (Python), or PIT (Java). Mutation testing catches tests that pass without verifying behavior.

### [FAIL] Property-Based Testing (0/3)

_Blog: catching edge cases in AI-generated code_

**Evidence**: No property-based testing found

**Remediation**: Add proptest (Rust), hypothesis (Python), fast-check (JS/TS), or jqwik (Java) for testing invariants with random structured inputs.

### [FAIL] Fuzz Testing (0/3)

_Blog: 80% problem - catching what AI misses_

**Evidence**: No fuzz testing found

**Remediation**: Add fuzz targets for parsing-heavy and input-handling code paths.

### [FAIL] Contract / Compatibility Tests (0/3)

_OpenAI Harness Engineering - mechanical constraints_

**Evidence**: No contract or compatibility tests found

**Remediation**: Add contract tests that verify external interface stability (golden fixtures, snapshot tests, wire-format checks).

### [PASS] Tests Block Merge (2/2)

_DORA 2025 - stability metrics_

**Evidence**: All test jobs are blocking: lint, format, test


## Review & Drift Prevention (60%)

### [PASS] Code Review Required (4/4)

_OpenAI Harness Engineering - author/reviewer separation_

**Evidence**: CODEOWNERS file found: .github/CODEOWNERS

### [PASS] Scheduled CI Jobs (3/3)

_OpenAI Harness Engineering - garbage collection agents_

**Evidence**: Scheduled CI pipeline found

### [FAIL] Stale Documentation Detection (0/2)

_OpenAI Harness Engineering - quality drift_

**Evidence**: No stale documentation detection found

**Remediation**: Add TODO/FIXME scanning, link checking (lychee), or prose linting (vale) to CI.

### [PASS] PR/MR Template (2/2)

_DORA 2025 - working in small batches_

**Evidence**: PR/MR template found: .github/PULL_REQUEST_TEMPLATE.md

### [FAIL] Automated Code Review (0/2)

_OpenAI Harness Engineering - separate authoring and reviewing agents_

**Evidence**: No automated review tools found

**Remediation**: Configure CodeRabbit, SonarCloud, Dependabot/Renovate, or equivalent for automated review on every PR/MR.

### [FAIL] Documentation Sync Check (0/2)

_OpenAI Harness Engineering - curated knowledge base_

**Evidence**: No documentation sync checks found in CI

**Remediation**: Add CI jobs that verify related docs stay in sync (e.g. diff AGENTS.md CLAUDE.md, golden fixture checks).


## AI-Specific Safeguards (100%)

### [PASS] AI Usage Norms (4/4)

_DORA 2025 - clear organizational stance on AI use_

**Evidence**: AI usage norms found in CLAUDE.md

### [PASS] Small Batch Enforcement (3/3)

_DORA 2025 - working in small batches_

**Evidence**: PR size check tool found in CI

### [PASS] Design-Before-Code Culture (3/3)

_Blog: cognitive offloading guardrails_

**Evidence**: RFC/design document directory found: docs/rfcs

### [PASS] Error Handling Policy (3/3)

_Blog: AI agents deleting tests, using expect()_

**Evidence**: Error handling ESLint rules configured

### [PASS] Security-Critical Path Marking (2/2)

_Blog: 80% problem in security infrastructure_

**Evidence**: CODEOWNERS found: .github/CODEOWNERS


## References

- Blog: 80% problem - catching what AI misses
- Blog: 80% problem in AI-generated code
- Blog: 80% problem in security infrastructure
- Blog: AI agents deleting tests, using expect()
- Blog: catching edge cases in AI-generated code
- Blog: cognitive offloading guardrails
- Blog: security infrastructure reliability
- DORA 2025 - AI-accessible documentation
- DORA 2025 - clear organizational stance on AI use
- DORA 2025 - stability feedback loops
- DORA 2025 - stability metrics
- DORA 2025 - stability through comprehensive testing
- DORA 2025 - working in small batches
- DORA 2025 Report
- DORA 2025 Report - AI-accessible documentation
- Kent Beck - tests define what correct means
- OpenAI Harness Engineering (2026)
- OpenAI Harness Engineering - author/reviewer separation
- OpenAI Harness Engineering - curated knowledge base
- OpenAI Harness Engineering - garbage collection agents
- OpenAI Harness Engineering - mechanical constraints
- OpenAI Harness Engineering - quality drift
- OpenAI Harness Engineering - separate authoring and reviewing agents
- SlopCodeBench - code that 'appears correct but is unreliable'
- SlopCodeBench - preventing subtle type errors
- matklad ARCHITECTURE.md - constraints as absences
- matklad ARCHITECTURE.md guide

---
*Generated by [ai-harness-scorecard](https://github.com/markmishaev/ai-harness-scorecard)*