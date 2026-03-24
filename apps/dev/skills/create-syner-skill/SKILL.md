---
name: create-syner-skill
description: Create skills for the syner ecosystem. Scaffolds the file, sets up symlinks, and iterates until the skill works when invoked.
metadata:
  author: syner
  version: "0.1.0"
  agent: dev
allowed-tools:
  - Read
  - Glob
  - Write
  - Bash
---

# Create Syner Skill

Create skills for the syner ecosystem. Skills are invoked with /name and extend agent capabilities.

## Core Principles

### 1. Write in Real-Time
Start writing the skill file IMMEDIATELY. Don't wait for all info.
User should NEVER have to say "ve escribiendo".

### 2. Output-First Testing
Get expected output FIRST, then compare actual vs expected.

### 3. Verify Output == Instructions
When testing, check that the skill's actual behavior matches what the instructions say it should do. Discrepancies = bugs.

### 4. Think, Don't Template
Skills should describe **how to think**, not what fields to fill. A skill with fixed headers and bullet counts produces generic output regardless of context.

The evolution (learned from save-bookmark):
- **v1 (template):** Fixed structure, field extraction, regex triggers → output reads like a form
- **v2 (template + context):** Same structure but with project references injected → still a form, just with better fill
- **v3 (thinking process):** No fixed structure — skill describes questions to ask, connections to make, decisions to weigh → output matches what the content actually needs

**The test:** If you swap the input and the body still makes sense, the skill wrote a template. If you remove the user's context and the body still reads fine, the skill didn't personalize. Both mean: rewrite the skill instructions.

When scaffolding: prefer "## How to Think" over "## Output" with a fixed format. The output section should describe *qualities* (honest, connected to context, specific) not *structure* (3-5 bullets, H2 for Why, H2 for Takeaways).

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

The frontmatter is fixed. Everything below it depends on what the skill needs.

```yaml
---
name: {name}
description: {what it does — in terms of value, not trigger phrases}
metadata:
  author: syner
  version: "0.0.1"
  agent: {app}
allowed-tools:
  - {tools the skill actually uses}
---
```

Below the frontmatter, write what the skill needs. Some skills need step-by-step processes. Others need a thinking framework. Don't default to numbered steps if the skill is about judgment.

**Always include:**
- How the skill thinks (process or thinking framework)
- Testing section (how to verify it works)
- Boundaries (constraints)

**Include only if the skill needs it:**
- Output format (only if structure matters — e.g., a report, a file with frontmatter)
- Edge cases (only if non-obvious)

**Avoid:**
- Fixed output templates with placeholder fields — these produce form-fill output
- Numbered bullet counts ("3-5 bullets") — let content decide length
- Headers that become mandatory structure ("## Why", "## Key Ideas") — the skill will fill them even when they add nothing

### 4. Description

The `description` field explains what the skill does and when it's useful. Write it as a sentence a human would say, not a list of trigger phrases.

```yaml
# Good - describes value and context
description: Save a URL as a markdown bookmark that connects to what you're building and thinking about.

# Bad - regex trigger list
description: Save URLs. Use when "save bookmark", "guardar link", "bookmark this", "save this url".

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
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
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
- Optional: `allowed-tools`, `license`, `compatibility`, `metadata.*`
- Syner extensions go inside `metadata`: `agent`, `context`, `skills`
- Voice: imperative, not first-person
- Version starts at 0.0.1
- Include Testing section

## Anti-Patterns

| Anti-Pattern | Fix |
|--------------|-----|
| First-person voice ("I will...") | Imperative ("Analyze the...") |
| Description as regex trigger list | Describe value in a human sentence |
| Fixed output template with placeholders | Describe output qualities, not structure |
| Numbered bullet counts ("3-5 bullets") | Let content decide length |
| "ONLY return X" but returns extra | Add "No explanation, no commentary" |
| Tools used but not declared | Add to frontmatter |
| No testing section | Add test cases |
| Headings like "What I Do" | Use "Process" or "How to Think" |

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
Self-execute using the execution contract.

# Bad
Read another skill's SKILL.md and follow instructions inline.
```

## Symlinks

After creating, skill needs symlink to `.claude/skills/`:

> **Run from project root** (symlinks use relative paths):

```bash
ln -s apps/{app}/skills/{name} .claude/skills/{name}
```

Or for shared skills:

> **Run from project root** (symlinks use relative paths):

```bash
ln -s skills/{name} .claude/skills/{name}
```

## Boundaries

Validate against `/syner-boundaries`:
- **Concrete Output** — Create actual skill file, not proposal
- **Self-Verification** — Test skill works when invoked
- **Observable Work** — Skill instructions are explicit and readable
