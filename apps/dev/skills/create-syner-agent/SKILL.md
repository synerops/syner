---
name: create-syner-agent
description: Create syner agents. Use when creating new agents, or when user says "crear agente", "new agent", "subagent".
agent: dev
tools: [Read, Write, Bash, Task]
metadata:
  author: syner
  version: "0.2.0"
---

# Create Syner Agent

Create agents for the syner ecosystem. Agents are invoked via Task tool and run in their own context.

## Core Principles

### 1. Write in Real-Time
Start writing the agent file IMMEDIATELY. Don't wait for all info.
User should NEVER have to say "ve escribiendo".

### 2. Output-First Testing
Get expected output FIRST, then compare actual vs expected.

### 3. Verify Output == Instructions
When testing, check that the agent's actual output matches what the instructions say it should produce. Discrepancies = bugs.

## Critical Concept

Agents are **invoked via Task tool**, not read and followed.

```javascript
// CORRECT - delegate to the agent
Task(subagent_type: "syner-planner", prompt: "...")

// WRONG - read agent file and do the work yourself
Read("agents/syner-planner.md")
// then manually follow the instructions
```

The agent file defines behavior for when the agent runs in its own context, not instructions for the caller to follow.

## Process

### 0. Anchor to Project Root

Before reading `agents/`, verify cwd is the project root (the directory containing both `apps/` and `agents/`):

```bash
[ -d apps ] && [ -d agents ] || echo "ERROR: not at project root — cd to the directory containing apps/ and agents/ first"
```

If not at project root, stop and instruct the user to run the skill from the project root directory.

### 1. Gather Context (Silent + Parallel)

While user talks:
- Read existing agents in `agents/*.md`
- Search notes for context
- Identify patterns

DO NOT ask a questionnaire. Listen, search, write.

### 2. Scaffold

Location: `agents/{name}.md`

```markdown
---
name: {name}
description: {description}
tools: [{tools}]
model: {model}
---

# {Name}

{Purpose and instructions}

## Input

{What the agent receives}

## Process

{Step by step}

## Output

{Exact format - be specific}

## Rules

- {Rule 1}
- {Rule 2}
```

### 3. Model Selection

| Model | When |
|-------|------|
| `haiku` | Fast, simple tasks, structured output |
| `sonnet` | Complex reasoning, multi-step |
| `opus` | Orchestration, high judgment |

### 4. Tool Selection

Principle: **minimum necessary tools, but ALL necessary tools**

| Need | Tools |
|------|-------|
| Read files | Read, Glob, Grep |
| Write files | + Write |
| Edit files | + Edit |
| System commands | + Bash |
| Delegation | + Task |

**Common mistake**: Defining output responsibilities without granting the tool.

```markdown
# BAD - agent should write plan.json but has no Write tool
tools: []

## Output
Write plan to `.syner/plan.json`
```

**Verify**: If instructions say "write X" → needs Write. If "edit X" → needs Edit.

### 5. Test Loop (Expect Iteration)

**One-shot is the exception, not the rule.** Plan for multiple iterations.

```
1. User provides expected output (golden)
2. Invoke agent via Task tool
3. Compare actual vs golden
4. If mismatch: check if instructions match expected behavior
5. Fix instructions OR fix expectations
6. Repeat until match
```

Normal flow:
- First run: discover obvious bugs (missing tools, wrong format)
- Second run: find edge cases
- Third+ run: refine until solid

**Critical: Always work with raw output, never summaries.**

If user describes output instead of pasting it, ask for raw version. Summaries introduce artifacts that lead to wrong conclusions.

Key verification:
- Does output format match what instructions say?
- Does agent follow the process described?
- Are there implicit assumptions not written down?

## Conventions

- Frontmatter: `name`, `description`, `tools`, `model`
- Optional: `memory`, `skills`
- Voice: imperative, not first-person
- Output: prefer structured JSON when possible
- Instructions: explicit > implicit

## Anti-Patterns

- "ONLY return X" but agent returns X + extra → fix instructions or add parsing
- Vague output format → agent invents format each time
- Tools not listed in frontmatter but used in instructions
- Sequential reads when parallel possible → 22x slower

## Performance: Parallel Tool Calls

When agent needs to read multiple files, design for parallel:

```
✓ Read 22 files in parallel (1 response, 22 tool calls)
✗ Read 22 files sequentially (22 responses, 22 tool calls)
```

In agent instructions, be explicit:
```markdown
## Process
1. Discover files with Glob
2. Read ALL files in parallel (single response, multiple Read calls)
3. Process results
```

---

## Reference

### Project Conventions

| Asset | Location | Naming |
|-------|----------|--------|
| Agents | `agents/` | `{name}.md` |
| Skills | `apps/{app}/skills/` or `skills/` | `SKILL.md` (always uppercase) |
| Symlinks | `.claude/skills/` | auto-generated |

### Checklist

- [ ] Name follows pattern: `syner-{function}` or `{domain}-{function}`
- [ ] Description is routing-friendly (Task tool uses it)
- [ ] Tools list matches responsibilities
- [ ] Input/Output clearly defined
- [ ] Model matches complexity
- [ ] Parallel reads if multiple files needed

## Boundaries

Validate against `/syner-boundaries`:
- **Concrete Output** — Create actual agent file, not proposal
- **Self-Verification** — Test agent works via Task tool
- **Observable Work** — Agent instructions are explicit and readable
