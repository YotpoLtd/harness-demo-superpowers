#!/bin/bash
# Stop hook — generates session-report.md from audit log
# Always exits 0 (non-blocking)

cd "$(git rev-parse --show-toplevel)" || exit 0

REPORT_DIR="reports"
AUDIT_LOG="$REPORT_DIR/audit.jsonl"
REPORT_FILE="$REPORT_DIR/session-report.md"

if [ ! -f "$AUDIT_LOG" ]; then
  exit 0
fi

TOOL_COUNT=$(wc -l < "$AUDIT_LOG" | tr -d ' ')
AGENT_CALLS=$(grep -c '"Agent"' "$AUDIT_LOG" 2>/dev/null || echo 0)
EDITS=$(grep -cE '"Edit"|"Write"' "$AUDIT_LOG" 2>/dev/null || echo 0)
BASH_CALLS=$(grep -c '"Bash"' "$AUDIT_LOG" 2>/dev/null || echo 0)
READ_CALLS=$(grep -c '"Read"' "$AUDIT_LOG" 2>/dev/null || echo 0)

TEST_RESULT="unknown"
if [ -f "$REPORT_DIR/test-results.json" ]; then
  TEST_RESULT=$(python3 -c "
import json, sys
try:
    d = json.load(open('$REPORT_DIR/test-results.json'))
    print(f\"{d.get('numPassedTests',0)} passed, {d.get('numFailedTests',0)} failed\")
except:
    print('parse error')
" 2>/dev/null || echo "parse error")
fi

LINT_RESULT="unknown"
if [ -f "$REPORT_DIR/lint-errors.json" ]; then
  LINT_RESULT=$(python3 -c "
import json, sys
try:
    d = json.load(open('$REPORT_DIR/lint-errors.json'))
    errors = sum(r.get('errorCount', 0) for r in d)
    warnings = sum(r.get('warningCount', 0) for r in d)
    print(f\"{errors} errors, {warnings} warnings\")
except:
    print('parse error')
" 2>/dev/null || echo "parse error")
fi

REVIEW_COUNT=0
if [ -d "$REPORT_DIR/reviews" ]; then
  REVIEW_COUNT=$(find "$REPORT_DIR/reviews" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
fi

cat > "$REPORT_FILE" << REPORT_EOF
# Session Report

## Summary
- **Total tool calls:** $TOOL_COUNT
- **Subagent dispatches:** $AGENT_CALLS
- **File modifications (Write/Edit):** $EDITS
- **Bash commands:** $BASH_CALLS
- **File reads:** $READ_CALLS

## Quality Gates
- **Test results:** $TEST_RESULT
- **Lint results:** $LINT_RESULT

## Review Trail
- **Subagent reviews captured:** $REVIEW_COUNT
- **Review files:** \`reports/reviews/\`

## Artifacts
- Full audit trail: \`reports/audit.jsonl\`
- Test results: \`reports/test-results.json\`
- Lint results: \`reports/lint-errors.json\`
REPORT_EOF

echo "Session report generated at $REPORT_FILE"
exit 0
