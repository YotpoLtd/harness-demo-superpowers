# Scorecard Easy Wins Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise the AI Harness Scorecard from 25/100 to ~67/100 by adding CI enforcement, GitHub config files, and documentation improvements.

**Architecture:** Single `ci.yml` workflow with parallel jobs mirrors the existing Claude Code hooks as a second enforcement gate. New tooling (Prettier, commitlint) added as devDependencies with minimal config files. Documentation updates fill scorecard detection gaps without changing app behavior.

**Tech Stack:** GitHub Actions, ESLint, Prettier, Vitest coverage (v8 provider), commitlint, CodelyTV/pr-size-labeler

---

## File Structure

| File | Responsibility |
|------|---------------|
| `.github/workflows/ci.yml` | CI enforcement: lint, format, test+coverage, audit, commitlint |
| `.github/workflows/pr-size.yml` | PR size labeling (separate workflow, runs on PR only) |
| `.prettierrc` | Prettier config (double quotes, trailing commas) |
| `.commitlintrc.json` | Commitlint config (conventional commits) |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR template with summary, test plan, checklist |
| `.github/CODEOWNERS` | Default code ownership |
| `SECURITY.md` | Vulnerability reporting instructions |
| `docs/rfcs/README.md` | Design-before-code process documentation |
| `eslint.config.js` | (modify) Add error handling rules |
| `vitest.config.ts` | (modify) Add coverage config |
| `package.json` | (modify) Add prettier, commitlint deps + format script |
| `ARCHITECTURE.md` | (modify) Add Forbidden Dependencies section |
| `CLAUDE.md` | (modify) Update ADR path, add CI reference |
| `README.md` | (modify) Update ADR path references |
| `docs/adrs/` → `docs/adr/` | (rename) Match adr-tools convention |

---

### Task 1: Add Prettier

**Files:**
- Create: `.prettierrc`
- Modify: `package.json`

- [ ] **Step 1: Install Prettier**

Run:
```bash
npm install --save-dev prettier
```

- [ ] **Step 2: Create `.prettierrc`**

```json
{
  "trailingComma": "all",
  "semi": true,
  "printWidth": 100
}
```

Note: `singleQuote` defaults to `false` (double quotes), which matches the existing code style.

- [ ] **Step 3: Add format scripts to `package.json`**

Add to the `"scripts"` section:
```json
"format": "prettier --write src/ tests/",
"format:check": "prettier --check src/ tests/"
```

- [ ] **Step 4: Run Prettier check to verify existing code passes**

Run:
```bash
npx prettier --check src/ tests/
```

Expected: All files pass (existing code already uses double quotes, semicolons, and lines under 100 chars). If any files fail, run `npx prettier --write src/ tests/` to fix them.

- [ ] **Step 5: Commit**

```bash
git add .prettierrc package.json package-lock.json
git commit -m "chore: add Prettier formatter with config"
```

---

### Task 2: Add commitlint

**Files:**
- Create: `.commitlintrc.json`
- Modify: `package.json`

- [ ] **Step 1: Install commitlint**

Run:
```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

- [ ] **Step 2: Create `.commitlintrc.json`**

```json
{
  "extends": ["@commitlint/config-conventional"]
}
```

- [ ] **Step 3: Verify commitlint works on the last commit**

Run:
```bash
npx commitlint --from HEAD~1 --to HEAD
```

Expected: PASS (existing commits use conventional format like `feat:`, `fix:`, `ci:`, `docs:`, `chore:`).

- [ ] **Step 4: Commit**

```bash
git add .commitlintrc.json package.json package-lock.json
git commit -m "chore: add commitlint with conventional commits config"
```

---

### Task 3: Add Vitest coverage

**Files:**
- Modify: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install coverage provider**

Run:
```bash
npm install --save-dev @vitest/coverage-v8
```

- [ ] **Step 2: Update `vitest.config.ts` to enable coverage**

Replace the full file content with:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/**/*.ts"],
      exclude: ["src/index.ts"],
    },
  },
});
```

Note: `src/index.ts` is excluded because the `startServer()` / `isDirectRun` block is not testable via supertest.

- [ ] **Step 3: Add coverage script to `package.json`**

Add to the `"scripts"` section:
```json
"test:coverage": "vitest run --coverage"
```

- [ ] **Step 4: Run coverage to verify it works**

Run:
```bash
npx vitest run --coverage
```

Expected: Tests pass with coverage output. `src/routes/todos.ts` and `src/types.ts` should have high coverage.

- [ ] **Step 5: Add `coverage/` to `.gitignore`**

Check if `.gitignore` exists. If not, create it. Add:
```
coverage/
```

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts package.json package-lock.json .gitignore
git commit -m "chore: add Vitest coverage with v8 provider"
```

---

### Task 4: Add ESLint error handling rules

**Files:**
- Modify: `eslint.config.js`

- [ ] **Step 1: Add error handling rules to `eslint.config.js`**

In the rules object (inside the second config entry that has `languageOptions`), add these three rules after the existing `@typescript-eslint/no-explicit-any` rule:

```javascript
"no-throw-literal": "error",
"@typescript-eslint/no-floating-promises": "error",
"@typescript-eslint/strict-boolean-expressions": "warn",
```

The full rules section should look like:

```javascript
rules: {
  "@typescript-eslint/no-unused-vars": [
    "error",
    { argsIgnorePattern: "^_" },
  ],
  "@typescript-eslint/explicit-function-return-type": "error",
  "@typescript-eslint/no-explicit-any": "error",
  "no-throw-literal": "error",
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/strict-boolean-expressions": "warn",
},
```

- [ ] **Step 2: Run ESLint to verify no existing violations**

Run:
```bash
npx eslint src/ tests/
```

Expected: PASS with no errors. If `strict-boolean-expressions` triggers warnings on existing code (e.g., the `isDirectRun` check in `src/index.ts`), fix the code or adjust the rule. The `isDirectRun` variable is already typed as `boolean | ""` which may trigger. If it does, wrap it: `if (Boolean(isDirectRun))` or `if (isDirectRun === true)`.

- [ ] **Step 3: Commit**

```bash
git add eslint.config.js
git commit -m "feat: add ESLint error handling rules"
```

If source files needed fixing:
```bash
git add eslint.config.js src/
git commit -m "feat: add ESLint error handling rules and fix violations"
```

---

### Task 5: Create CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx eslint src/ tests/

  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx prettier --check src/ tests/

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx vitest run --coverage

  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm audit --audit-level=moderate

  commitlint:
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx commitlint --from HEAD~1 --to HEAD
```

- [ ] **Step 2: Validate YAML syntax**

Run:
```bash
python3 -c "
with open('.github/workflows/ci.yml') as f:
    content = f.read()
for key in ['name:', 'on:', 'jobs:']:
    assert key in content, f'Missing {key}'
print('Structure valid')
"
```

Expected: "Structure valid"

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add CI workflow with lint, format, test, audit, commitlint"
```

---

### Task 6: Create PR size labeler workflow

**Files:**
- Create: `.github/workflows/pr-size.yml`

- [ ] **Step 1: Create `.github/workflows/pr-size.yml`**

```yaml
name: PR Size Labeler

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  label:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: codelytv/pr-size-labeler@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          xs_label: "size/XS"
          xs_max_size: 10
          s_label: "size/S"
          s_max_size: 100
          m_label: "size/M"
          m_max_size: 500
          l_label: "size/L"
          l_max_size: 1000
          xl_label: "size/XL"
          fail_if_xl: false
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/pr-size.yml
git commit -m "ci: add PR size labeler workflow"
```

---

### Task 7: Add GitHub config files

**Files:**
- Create: `.github/PULL_REQUEST_TEMPLATE.md`
- Create: `.github/CODEOWNERS`
- Create: `SECURITY.md`

- [ ] **Step 1: Create `.github/PULL_REQUEST_TEMPLATE.md`**

```markdown
## Summary

<!-- What does this PR do? 1-3 bullet points. -->

-

## Test Plan

<!-- How was this tested? -->

- [ ] Tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Format passes (`npm run format:check`)

## Checklist

- [ ] Changes match the spec/plan (if applicable)
- [ ] No secrets or credentials committed
- [ ] ADRs updated (if architectural decision changed)
```

- [ ] **Step 2: Create `.github/CODEOWNERS`**

```
* @RonBarabash
```

- [ ] **Step 3: Create `SECURITY.md`**

```markdown
# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

1. **Do NOT open a public issue**
2. Use [GitHub Security Advisories](../../security/advisories/new) to report privately
3. Include steps to reproduce the vulnerability
4. Allow time for a fix before public disclosure

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Security Practices

This project enforces security through:
- ESLint rules against dangerous patterns (`no-throw-literal`, `no-floating-promises`)
- Dependency auditing in CI (`npm audit`)
- Claude Code hooks that block force pushes and destructive commands
- TypeScript strict mode with no `any` types
```

- [ ] **Step 4: Commit**

```bash
git add .github/PULL_REQUEST_TEMPLATE.md .github/CODEOWNERS SECURITY.md
git commit -m "docs: add PR template, CODEOWNERS, and SECURITY.md"
```

---

### Task 8: Rename `docs/adrs/` to `docs/adr/`

**Files:**
- Rename: `docs/adrs/` → `docs/adr/`
- Modify: `CLAUDE.md`
- Modify: `README.md`
- Modify: `ARCHITECTURE.md` (if it references the path)

- [ ] **Step 1: Rename the directory**

```bash
git mv docs/adrs docs/adr
```

- [ ] **Step 2: Update `CLAUDE.md`**

Replace all occurrences of `docs/adrs/` with `docs/adr/`:
- In the ADRs section: `Architecture Decision Records in \`docs/adr/\`.`

Also update the scorecard section reference from `docs/adrs/004-harness-scorecard.md` to `docs/adr/004-harness-scorecard.md` if present.

- [ ] **Step 3: Update `README.md`**

Replace all occurrences of `docs/adrs/` with `docs/adr/`:
- The ADR link in the scorecard section: `[ADR-004](docs/adr/004-harness-scorecard.md)`

- [ ] **Step 4: Check ARCHITECTURE.md for ADR references**

Search for `adrs` in `ARCHITECTURE.md`. If found, update to `adr`. (Currently references `ADR-001` by name but not the directory path — verify and update if needed.)

- [ ] **Step 5: Verify no broken references**

Run:
```bash
grep -r "docs/adrs" . --include="*.md" --include="*.ts" --include="*.json" --include="*.yml"
```

Expected: No results (all references updated).

- [ ] **Step 6: Commit**

```bash
git add docs/adr/ docs/adrs/ CLAUDE.md README.md ARCHITECTURE.md
git commit -m "refactor: rename docs/adrs to docs/adr to match adr-tools convention"
```

---

### Task 9: Update ARCHITECTURE.md with forbidden dependencies

**Files:**
- Modify: `ARCHITECTURE.md`

- [ ] **Step 1: Add Forbidden Dependencies section**

After the existing "Dependency Rules" subsection (which ends with "No circular dependencies between any modules"), add a new subsection:

```markdown
### Forbidden Dependencies

These constraints define what must NOT happen — violations break module isolation:

- `types.ts` MUST NOT import any other module (it is a leaf dependency)
- `routes/todos.ts` MUST NOT import `index.ts` (routes must not depend on the app bootstrap)
- No module in `src/` MUST NOT import from `tests/` (production code never depends on test code)
- No module MUST NOT import directly from `node_modules` paths — use package names only
- `index.ts` MUST NOT contain business logic — it is purely app assembly and server bootstrap
```

- [ ] **Step 2: Verify the new section reads correctly**

Read the full file and confirm the new section is placed logically after the Dependency Rules.

- [ ] **Step 3: Commit**

```bash
git add ARCHITECTURE.md
git commit -m "docs: add forbidden dependency constraints to ARCHITECTURE.md"
```

---

### Task 10: Add design-before-code documentation

**Files:**
- Create: `docs/rfcs/README.md`

- [ ] **Step 1: Create `docs/rfcs/` directory and `README.md`**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/rfcs/README.md
git commit -m "docs: add design-before-code process documentation"
```

---

### Task 11: Update CLAUDE.md and README.md

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`

- [ ] **Step 1: Add CI reference to CLAUDE.md**

After the Scorecard section in `CLAUDE.md`, add:

```markdown
## CI

GitHub Actions workflow (`.github/workflows/ci.yml`) enforces on every push and PR:
- ESLint (same rules as lint-gate hook)
- Prettier format check
- Vitest with coverage
- npm audit
- commitlint (conventional commits)

CI is the second enforcement gate — hooks catch issues during agent work, CI catches everything else.
```

- [ ] **Step 2: Update README.md to mention CI**

In the "What's in the Harness" section, after the "Mechanical Enforcement (Hooks)" table, add a new subsection:

```markdown
### CI Enforcement (GitHub Actions)

| Job | What It Checks | Scorecard Category |
|-----|---------------|-------------------|
| `lint` | ESLint strict TypeScript rules | Mechanical Constraints |
| `format` | Prettier formatting consistency | Mechanical Constraints |
| `test` | Vitest with coverage reporting | Testing & Stability |
| `audit` | npm dependency vulnerabilities | Mechanical Constraints |
| `commitlint` | Conventional commit messages | Mechanical Constraints |
| `pr-size` | PR diff size labeling | AI-Specific Safeguards |
```

- [ ] **Step 3: Verify all changes**

Run:
```bash
npm run lint:fix
npm test
```

Expected: Both pass with no errors.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md README.md
git commit -m "docs: add CI enforcement references to CLAUDE.md and README.md"
```

---

### Task 12: Final verification

- [ ] **Step 1: Run all quality checks**

```bash
npx eslint src/ tests/
npx prettier --check src/ tests/
npx vitest run --coverage
npm audit --audit-level=moderate
npx commitlint --from HEAD~5 --to HEAD
```

Expected: All pass.

- [ ] **Step 2: Verify no broken references**

```bash
grep -r "docs/adrs" . --include="*.md" --include="*.ts" --include="*.json" --include="*.yml" | grep -v node_modules | grep -v .git
```

Expected: No results.

- [ ] **Step 3: Verify file structure**

```bash
ls -la .github/workflows/
ls -la .github/PULL_REQUEST_TEMPLATE.md .github/CODEOWNERS SECURITY.md
ls -la docs/adr/
ls -la docs/rfcs/README.md
ls -la .prettierrc .commitlintrc.json
```

Expected: All files exist.

- [ ] **Step 4: Push to remote**

```bash
git push origin main
```
