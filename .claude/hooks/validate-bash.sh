#!/bin/bash
# Blocks dangerous shell commands before they run.
# Reads PreToolUse JSON from stdin, outputs JSON to control Claude Code.

INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

REASON=""

if echo "$CMD" | grep -qE 'rm\s+-rf\s+(/|~|\*)'; then
  REASON="rm -rf on root/home/wildcard is irreversible"
elif echo "$CMD" | grep -qE 'git\s+push\s+(.*\s)?--force(\s|$)' && echo "$CMD" | grep -qE '(main|master)'; then
  REASON="force-push to main/master — use a feature branch"
elif echo "$CMD" | grep -qE 'git\s+reset\s+--hard'; then
  REASON="git reset --hard discards uncommitted work"
elif echo "$CMD" | grep -qiE '\bDROP\s+(TABLE|DATABASE|SCHEMA)\b'; then
  REASON="destructive SQL — verify intent before running"
elif echo "$CMD" | grep -qE 'chmod\s+-R\s+777'; then
  REASON="chmod -R 777 opens broad permissions"
fi

if [ -n "$REASON" ]; then
  MSG="Blocked: $REASON. Confirm with the user before proceeding."
  echo "{\"continue\": false, \"stopReason\": $(echo "$MSG" | jq -Rs .)}"
fi

exit 0
