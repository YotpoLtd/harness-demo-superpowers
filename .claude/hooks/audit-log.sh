#!/bin/bash
# PostToolUse hook for all tools — appends tool call metadata to audit log
# Always exits 0 (non-blocking)

cd "$(git rev-parse --show-toplevel)" || exit 0

REPORT_DIR="reports"
mkdir -p "$REPORT_DIR"

TOOL_NAME="${CLAUDE_TOOL_USE_NAME:-unknown}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"

INPUT_PREVIEW=$(echo "${CLAUDE_TOOL_USE_INPUT:-}" | head -c 500 | tr '\n' ' ')
OUTPUT_PREVIEW=$(echo "${CLAUDE_TOOL_USE_OUTPUT:-}" | head -c 500 | tr '\n' ' ')

echo "{\"timestamp\":\"$TIMESTAMP\",\"session\":\"$SESSION_ID\",\"tool\":\"$TOOL_NAME\",\"input_preview\":\"$INPUT_PREVIEW\",\"output_preview\":\"$OUTPUT_PREVIEW\"}" >> "$REPORT_DIR/audit.jsonl"

exit 0
