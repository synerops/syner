---
name: create-syner-skill
description: Create syner skills. Use when creating new skills, or when user says "crear skill", "new skill", "add capability".
metadata:
  author: syner
  version: "0.0.1"
tools:
  - Read
  - Glob
  - Write
  - Bash
---

# Create Syner Skill

Create skills for the syner ecosystem.

## Core Principles

### 1. Write in Real-Time
Start writing the skill file IMMEDIATELY. Don't wait for all info.
User should NEVER have to say "ve escribiendo".

### 2. Output-First Testing
Get expected output FIRST, then compare actual vs expected.

### 3. Verify Output == Instructions
When testing, check that the skill's actual behavior matches what the instructions say it should do. Discrepancies = bugs.

## Critical Concept

Skills are **invoked with /name**, not read and followed.

```javascript
// CORRECT - user invokes the skill
/my-skill [args]

// WRONG - read skill file and do the work yourself
Read("apps/dev/skills/my-skill/SKILL.md")
// then manually follow the instructions
```

The skill file defines behavior for when the skill is invoked, not instructions for the model to follow manually.

## Process

### 0. Detect Golden Output

If user mentions they have output/example/reference:
- "tengo el output..."
- "I have the output..."
- "here's what worked..."

**Ask for it BEFORE writing.** That output is the golden reference.

```
User: "tengo el output del agente que lo logró"
You: "Comparte el output, lo uso como referencia para el skill"
```

Don't skip this. Writing without the golden = guessing.

### 1. Gather Context (Silent + Parallel)

While user talks:
- Read existing skills in `apps/*/skills/*/SKILL.md`
- Search notes for context
- Identify patterns

DO NOT ask a questionnaire. Listen, search, write.

### 2. Determine Location

| Scope | Location |
|-------|----------|
| App-specific | `apps/{app}/skills/{name}/SKILL.md` |
| Shared | `skills/{name}/SKILL.md` |

Ask only if unclear: "Is this skill specific to an app or shared?"

### 3. Scaffold

```markdown
---
name: {name}
description: {description}. Use when {triggers}.
metadata:
  author: syner
  version: "0.0.1"
---

# {Name}

{Purpose - one line}

## Process

{Step by step instructions - imperative voice}

### 1. {First Step}

{Details}

### 2. {Second Step}

{Details}

## Output

{Exact format - be specific}

## Testing

To test this skill:
1. {test case}

Cleanup: {cleanup commands if needed}
```

### 4. Description Triggers

The `description` field determines when the skill auto-triggers. Include:
- What it does
- Keywords that should trigger it
- Natural phrases users might say

```yaml
# Good - specific triggers
description: Create syner skills. Use when user says "crear skill", "new skill", "add capability".

# Bad - vague
description: Creates skills.
```

### 5. Voice: Imperative, Not First-Person

```markdown
# Bad - first person creates identity confusion
## What I Do
I analyze the code and find bugs.

# Good - imperative, clear instructions
## Process
Analyze the code for bugs. Report findings in a table.
```

### 6. Tool Selection

If skill needs tools, declare in frontmatter:

```yaml
---
name: my-skill
tools: [Read, Glob, Grep, Bash]
---
```

Common combinations:
| Need | Tools |
|------|-------|
| Read files | Read, Glob, Grep |
| Write files | + Write |
| Edit files | + Edit |
| System commands | + Bash |
| Delegation | + Task, + Skill |

**Verify**: If instructions say "write X" → needs Write. If "run command" → needs Bash.

### 7. Test Loop (Expect Iteration)

**One-shot is the exception, not the rule.** Plan for multiple iterations.

```
1. User provides expected output (golden)
2. Invoke skill with /name
3. Compare actual vs golden
4. If mismatch: check if instructions match expected behavior
5. Fix instructions OR fix expectations
6. Repeat until match
```

Normal flow:
- First run: discover obvious bugs (wrong output format, missing steps)
- Second run: find edge cases
- Third+ run: refine until solid

**Critical: Always work with raw output, never summaries.**

## Conventions

- Filename: `SKILL.md` (uppercase)
- Frontmatter: `name`, `description`, `metadata.version`
- Optional: `tools`, `context`, `skills`
- Voice: imperative, not first-person
- Version starts at 0.0.1
- Include Testing section

## Anti-Patterns

| Anti-Pattern | Fix |
|--------------|-----|
| First-person voice ("I will...") | Imperative ("Analyze the...") |
| Vague description | Add trigger phrases |
| "ONLY return X" but returns extra | Add "No explanation, no commentary" |
| Tools used but not declared | Add to frontmatter |
| No testing section | Add test cases |
| Headings like "What I Do" | Use "Process" or "Capabilities" |

## Performance: Parallel Tool Calls

When skill needs to read multiple files, design for parallel:

```markdown
## Process
1. Discover files with Glob
2. Read ALL files in parallel (single response, multiple Read calls)
3. Process results
```

## Skill References

When referencing other skills, use the name not the path:

```markdown
# Good
Delegate to `/syner-worker` for execution.

# Bad
Read `../syner-worker/SKILL.md` and follow instructions.
```

## Symlinks

After creating, skill needs symlink to `.claude/skills/`:

```bash
ln -s apps/{app}/skills/{name} .claude/skills/{name}
```

Or for shared skills:
```bash
ln -s skills/{name} .claude/skills/{name}
```
