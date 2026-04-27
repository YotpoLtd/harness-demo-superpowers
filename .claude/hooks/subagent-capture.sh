#!/bin/bash
# PostToolUse hook for Agent — captures subagent output to reports/reviews/
# Always exits 0 (non-blocking)

cd "$(git rev-parse --show-toplevel)" || exit 0

REPORT_DIR="reports/reviews"
mkdir -p "$REPORT_DIR"

HOOK_DATA=$(cat)
TOOL_NAME=$(echo "$HOOK_DATA" | jq -r '.tool_name // empty')
if [ "$TOOL_NAME" != "Agent" ]; then
  exit 0
fi

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S")
SAFE_TIMESTAMP=$(echo "$TIMESTAMP" | tr ':' '-')

DESCRIPTION=$(echo "$HOOK_DATA" | jq -r '.tool_input.description // "unknown"')
SAFE_DESC=$(echo "$DESCRIPTION" | tr ' /' '-' | tr -cd '[:alnum:]-' | head -c 50)

FILENAME="${SAFE_TIMESTAMP}-${SAFE_DESC}.md"

INPUT_TEXT=$(echo "$HOOK_DATA" | jq -r '.tool_input // empty' | head -c 2000)
OUTPUT=$(echo "$HOOK_DATA" | jq -r '.tool_output // "No output captured"')

cat > "$REPORT_DIR/$FILENAME" << REPORT_EOF
# Subagent Report: $DESCRIPTION

**Timestamp:** $TIMESTAMP
**Tool:** Agent

## Input

\`\`\`
$INPUT_TEXT
\`\`\`

## Output

$OUTPUT
REPORT_EOF

exit 0
