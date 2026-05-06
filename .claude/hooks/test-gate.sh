#!/bin/bash
# Stop hook — runs full test suite before session can end

cd "$(git rev-parse --show-toplevel)" || exit 0

if [ ! -f "package.json" ]; then
  exit 0
fi

if ! grep -q '"vitest"' package.json 2>/dev/null; then
  exit 0
fi

REPORT_DIR="reports"
mkdir -p "$REPORT_DIR"

npx vitest run --reporter=json --outputFile="$REPORT_DIR/test-results.json" 2>/dev/null

TEST_EXIT=$?

if [ $TEST_EXIT -ne 0 ]; then
  echo "TEST GATE FAILED — unit/integration tests failed."
  echo "Results written to $REPORT_DIR/test-results.json"
  echo "Read the JSON file to find failing tests, then fix them."
  if [ -f "$REPORT_DIR/test-results.json" ]; then
    cat "$REPORT_DIR/test-results.json"
  fi
  exit 1
fi

# E2E tests (Playwright) — only run if playwright is installed and e2e/ exists
if [ -d "e2e" ] && grep -q '"@playwright/test"' package.json 2>/dev/null; then
  npx playwright test 2>/dev/null
  E2E_EXIT=$?

  if [ $E2E_EXIT -ne 0 ]; then
    echo "TEST GATE FAILED — Playwright E2E tests failed."
    echo "Run 'npm run test:e2e' to see details."
    exit 1
  fi
fi

echo "TEST GATE PASSED — all tests green (unit + E2E)."
exit 0
