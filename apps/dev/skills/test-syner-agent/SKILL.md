---
name: test-syner-agent
description: Test syner agents using output-first methodology. Use when testing an agent, validating behavior, or debugging agent output.
agent: dev
tools: [Task, Edit, Read]
metadata:
  author: syner
  version: "0.2.0"
---

# Test Syner Agent

Test agents by comparing actual output against expected output.

This is a testing skill. Use it during agent development to verify behavior matches instructions.

## Core Principle: Output-First

Get the expected output BEFORE running tests. Then compare.

```
Golden (expected) → Run agent → Actual → Diff → Fix → Repeat
```

## Process

### 1. Get Golden Output

Ask user: "What's the expected output?"

If user describes instead of pasting:
```
"Paste the raw output. Summaries introduce artifacts."
```

### 2. Get Actual Output

Run the agent:
```
Task(
  prompt="[test input]",
  subagent_type="[agent-name]"
)
```

Or ask user to paste actual output from their test.

### 3. Compare

Check:
- [ ] Working with raw output (not summarized)
- [ ] Output format matches instructions
- [ ] All required fields present
- [ ] No extra content when "ONLY X" specified
- [ ] JSON valid if JSON expected

### 4. Diagnose Discrepancies

| Symptom | Likely Cause |
|---------|--------------|
| No file created | Agent needs Write tool but `tools: []` |
| Extra text around JSON | Instructions say "ONLY JSON" but agent adds explanation |
| Missing fields | Instructions don't specify required fields |
| Wrong format | Instructions are ambiguous |
| Works sometimes | Instructions have implicit assumptions |
| Timeout | Model too small for task, or task too broad |
| Caller did work itself | Read agent file instead of Task() invocation |
| Schema drift | Caller extended schema beyond agent spec |

### 4.5. Tools vs Responsibilities Check

Before testing, verify tools match responsibilities:

```
Agent says "write to X" → needs Write tool
Agent says "edit X" → needs Edit tool
Agent says "run command" → needs Bash tool
Agent says "delegate to" → needs Task tool
```

If tools don't match responsibilities, flag BEFORE testing.

### 5. Fix

Two options:
1. **Fix instructions** - if agent behavior is wrong
2. **Fix expectations** - if golden was incorrect

Update the agent file in real-time. Don't batch fixes.

**One fix at a time.** Change one thing, test, verify. Don't batch multiple fixes.

### 5.5. Suggest Re-Test Prompt

After fixing, **give the user a ready-to-paste prompt**.

Keep it natural, not technical:

```
# Good - natural, output-first implicit
"working on [agent], gonna give you success output, help me fix bugs"

# Bad - over-engineered
"Run X on Y, then send using Task(subagent_type=...) verifying that..."
```

The prompt should feel like talking to a colleague, not invoking an API.

### 6. Retest

Run again with same input. Compare. Repeat until match.

## Critical Rules

**Always work with raw output, never summaries.**
Summaries introduce artifacts. Ask for raw version before drawing conclusions.

**One fix at a time.**
Change one thing, test, verify. Don't batch multiple fixes.

**Instructions must match output exactly.**
If instructions say "Return ONLY JSON", agent must return ONLY JSON. No exceptions, no "helpful" additions.

## Common Anti-Patterns

| Anti-Pattern | Fix |
|--------------|-----|
| Caller did the work itself | Used Read instead of Task() invocation |
| "ONLY X" but returns X + explanation | Add "No explanation, no commentary" |
| Format varies between runs | Add explicit template in instructions |
| Agent "interprets" instructions | Be more explicit, less abstract |
| Works in isolation, fails in chain | Test with real upstream input |
| Schema drift | Caller extended schema beyond agent spec |
| Sequential reads (22 responses) | Should be parallel (1 response, 22 calls) |

## Delegation Check

When testing "send X to agent Y", verify:

1. **Task tool was used** - Look for `Task(subagent_type: "agent-name")`
2. **Agent ran in its own context** - Not caller reading agent file and doing work itself
3. **Output matches agent spec** - Not extended schema invented by caller

If caller did the work itself, it's treating the agent as "instructions to follow" instead of "process to delegate to".

## Performance Check

When agent reads multiple files, verify it's parallel:

```
✓ 1 response with 22 Read tool calls (parallel)
✗ 22 responses with 1 Read each (sequential, 22x slower)
```

If sequential, add explicit instruction to agent: "Read ALL files in parallel (single response, multiple Read calls)"

---

## Advanced

### Chaining Test

When testing agents that consume other agents' output:

1. Run producer agent, capture output
2. Feed output to consumer agent
3. Verify the handoff works

Example: `skill-reviewer → wolf`
- skill-reviewer produces text report with issues
- wolf consumes it, executes fixes
- Verify worker can parse reviewer's output format

### Search Guide

When agent needs to find skills, use these patterns:

```bash
# Skills (SKILL.md - always uppercase)
apps/*/skills/*/SKILL.md
skills/*/SKILL.md

# Agents
agents/*.md

# Symlinks (don't edit these)
.claude/skills/
```

## Boundaries

Validate against `/syner-boundaries`:
- **Self-Verification** — Compare actual vs expected output
- **Concrete Output** — Fix agent files, not just report findings
- **Observable Work** — Document what was tested and fixed
