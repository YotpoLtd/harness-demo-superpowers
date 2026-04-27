#!/bin/bash
# PostToolUse hook for Write|Edit — runs ESLint with JSON output

cd "$(git rev-parse --show-toplevel)" || exit 0

REPORT_DIR="reports"
mkdir -p "$REPORT_DIR"

npx eslint src/ tests/ --format json --output-file "$REPORT_DIR/lint-errors.json" 2>/dev/null

ESLINT_EXIT=$?

if [ $ESLINT_EXIT -ne 0 ]; then
  echo "LINT GATE FAILED"
  echo "Errors written to $REPORT_DIR/lint-errors.json"
  echo "Read the JSON file to find exact file, line, and rule for each error."
  cat "$REPORT_DIR/lint-errors.json"
  exit 2
fi

exit 0
