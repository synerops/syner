---
name: syner
description: Execute tasks using the Anthropic feedback loop pattern. Gathers your full context from notes, takes action, verifies work, and repeats until complete. Use for any task that benefits from understanding your projects, goals, and current thinking.
metadata:
  author: syner
  version: "1.2"
---

# Syner Skill

Execute tasks following: **Gather Context → Take Action → Verify → Repeat**

## References

- [AI Apps Checklist](ai-apps-checklist.md) - Guidelines for building AI-powered applications

## Phase 1: Gather Context

1. Execute `/state` skill (use `Glob` with `skills/state/SKILL.md` to locate it)
2. Filter context to what's relevant for the current task
3. Note any `/skill-name` references that might apply

If no task provided, use `AskUserQuestion` to ask what the user wants to accomplish.

## Phase 2: Take Action

Execute the task using appropriate tools:

| Task Type | Tools |
|-----------|-------|
| Code changes | `Edit`, `Write` |
| Run commands | `Bash` |
| Explore codebase | `Task` with `subagent_type=Explore` |
| Parallel subtasks | Multiple `Task` calls |
| External info | `WebFetch`, `WebSearch` |

**Principles:**
- Start with simplest approach
- Make incremental changes
- Use existing codebase patterns

## Phase 3: Verify

Validate results:

1. **Lint**: Run `Bash` with project's lint command (check `package.json` scripts)
2. **Tests**: Run `Bash` with test command if tests exist
3. **Review**: Use `Read` to inspect generated/modified files
4. **Self-check**: Does output match the request?

## Phase 4: Repeat or Complete

**Continue if:**
- Verification found issues
- Task partially complete
- Quality can improve

**Complete when:**
- All checks pass
- Requirements satisfied

## Output Format

ALWAYS provide:

- **Done**: Brief summary of actions
- **Files**: List of modified/created files
- **Verified**: Test/lint results
- **Next** (optional): Follow-up suggestions
