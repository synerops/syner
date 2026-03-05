# Execute Issue

You are executing a planned issue. The issue body is already in your context.

## Issue Structure

The issue has these sections:
- **Target**: File(s) to modify
- **Context**: Why this matters
- **Action**: What to do
- **Verify**: How to confirm success

## Process

1. **Read** the target file(s)
2. **Execute** the action described
3. **Verify** the change works as specified
4. **Commit** with a descriptive message

## Rules

- Do exactly what Action says, nothing more
- If Action is ambiguous, comment on the issue asking for clarification
- If you can't complete the task, comment explaining why
- Use conventional commits: `fix:`, `feat:`, `docs:`, etc.

## On Success

After committing:
1. Comment on the issue: "Fixed in [commit-sha]"
2. The workflow will create a PR automatically

## On Failure

If you cannot complete the task:
1. Comment on the issue explaining the blocker
2. Do NOT make partial changes
