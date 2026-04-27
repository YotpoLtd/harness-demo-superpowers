#!/bin/bash
# PreToolUse hook for Bash — blocks dangerous commands

INPUT="${CLAUDE_TOOL_USE_INPUT:-}"

DANGEROUS_PATTERNS=(
  "--force"
  "--no-verify"
  "rm -rf /"
  "git push --force"
  "git reset --hard"
  "git clean -fd"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$INPUT" | grep -qF "$pattern"; then
    echo "BLOCKED: Command contains dangerous flag: $pattern"
    echo "Reason: This harness prohibits destructive operations."
    echo "Alternative: Use safe equivalents (e.g., git push without --force)."
    exit 1
  fi
done

exit 0
