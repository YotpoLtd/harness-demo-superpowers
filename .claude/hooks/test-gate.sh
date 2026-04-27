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
  echo "TEST GATE FAILED — agent cannot stop until all tests pass."
  echo "Results written to $REPORT_DIR/test-results.json"
  echo "Read the JSON file to find failing tests, then fix them."
  if [ -f "$REPORT_DIR/test-results.json" ]; then
    cat "$REPORT_DIR/test-results.json"
  fi
  exit 1
fi

echo "TEST GATE PASSED — all tests green."
exit 0
