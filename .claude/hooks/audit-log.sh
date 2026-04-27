#!/bin/bash
# PostToolUse hook for all tools — appends tool call metadata to audit log
# Always exits 0 (non-blocking)

cd "$(git rev-parse --show-toplevel)" || exit 0

REPORT_DIR="reports"
mkdir -p "$REPORT_DIR"

HOOK_DATA=$(cat)
TOOL_NAME=$(echo "$HOOK_DATA" | jq -r '.tool_name // "unknown"')
SESSION_ID=$(echo "$HOOK_DATA" | jq -r '.session_id // "unknown"')
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

INPUT_PREVIEW=$(echo "$HOOK_DATA" | jq -r '.tool_input // empty' | head -c 500 | tr '\n' ' ')
OUTPUT_PREVIEW=$(echo "$HOOK_DATA" | jq -r '.tool_output // empty' | head -c 500 | tr '\n' ' ')

echo "{\"timestamp\":\"$TIMESTAMP\",\"session\":\"$SESSION_ID\",\"tool\":\"$TOOL_NAME\",\"input_preview\":\"$INPUT_PREVIEW\",\"output_preview\":\"$OUTPUT_PREVIEW\"}" >> "$REPORT_DIR/audit.jsonl"

exit 0
