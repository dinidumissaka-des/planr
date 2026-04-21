#!/bin/bash
# After Claude edits a .ts/.tsx file, runs tsc and feeds any errors
# for that specific file back into the model context so Claude self-corrects.

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')

# Only act on TypeScript files
if ! echo "$FILE" | grep -qE '\.(ts|tsx)$'; then
  exit 0
fi

cd /home/user/planr || exit 0

BASENAME=$(basename "$FILE")
# Run tsc, filter to lines mentioning this file only, cap at 15 lines
ERRORS=$(npx --yes tsc --noEmit 2>&1 | grep "$BASENAME" | grep "error TS" | head -15)

if [ -n "$ERRORS" ]; then
  CONTEXT="TypeScript errors in $BASENAME after last edit — fix before moving on:\n$ERRORS"
  echo "{\"hookSpecificOutput\": {\"hookEventName\": \"PostToolUse\", \"additionalContext\": $(printf '%s' "$CONTEXT" | jq -Rs .)}}"
fi

exit 0
