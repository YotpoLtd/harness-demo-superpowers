#!/bin/bash
# PostToolUse hook for Agent — captures subagent output to reports/reviews/
# Always exits 0 (non-blocking)

cd "$(git rev-parse --show-toplevel)" || exit 0

REPORT_DIR="reports/reviews"
mkdir -p "$REPORT_DIR"

TOOL_NAME="${CLAUDE_TOOL_USE_NAME:-}"
if [ "$TOOL_NAME" != "Agent" ]; then
  exit 0
fi

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S")
SAFE_TIMESTAMP=$(echo "$TIMESTAMP" | tr ':' '-')

DESCRIPTION=$(echo "${CLAUDE_TOOL_USE_INPUT:-}" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('description', 'unknown'))
except:
    print('unknown')
" 2>/dev/null || echo "unknown")

SAFE_DESC=$(echo "$DESCRIPTION" | tr ' /' '-' | tr -cd '[:alnum:]-' | head -c 50)

FILENAME="${SAFE_TIMESTAMP}-${SAFE_DESC}.md"

OUTPUT="${CLAUDE_TOOL_USE_OUTPUT:-No output captured}"

cat > "$REPORT_DIR/$FILENAME" << REPORT_EOF
# Subagent Report: $DESCRIPTION

**Timestamp:** $TIMESTAMP
**Tool:** Agent

## Input

\`\`\`
$(echo "${CLAUDE_TOOL_USE_INPUT:-}" | head -c 2000)
\`\`\`

## Output

$OUTPUT
REPORT_EOF

exit 0
