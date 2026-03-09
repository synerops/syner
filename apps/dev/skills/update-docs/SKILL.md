# update-docs

Update documentation to reflect the current state of the codebase.

## Arguments

Parse the user's input after `/update-docs`:

| Input | Action |
|-------|--------|
| (none) | Update everything |
| `readme` | Only README.md files |
| `agents` | Only AGENTS.md files |
| `<path>` | Only that app/package (e.g., `apps/bot`) |

Examples:
```
/update-docs                  → all docs
/update-docs readme           → only READMEs
/update-docs agents           → only AGENTS.md
/update-docs apps/bot         → only apps/bot/
/update-docs readme apps/bot  → only apps/bot/README.md
```

## Two types of docs

### README.md (for humans)

**Audience:** Users, potential contributors, people browsing GitHub

**Content:**
- What is this?
- Why would I use it?
- How do I get started?
- Skills available (auto-generated)

**Tone:** Marketing + onboarding. Clear, concise, inviting.

### AGENTS.md (for coding agents)

**Audience:** Claude Code, Cursor, Copilot, any AI coding assistant

**Content:**
- Project structure with explanations
- File conventions (where to put what)
- How to add features (step by step)
- Patterns used in this codebase
- What NOT to do

**Tone:** Technical, precise, actionable. Like a senior dev explaining the codebase.

## What to document

**Concepts (manual, stable):**
- Philosophy, architecture, design decisions
- These change rarely and need human voice

**Lists (auto-generated):**
- Skills available
- Agents available
- Tools available

## What NOT to document

Dynamic lists should either be:
1. **Auto-generated** by this skill
2. **Discovered** by the user via filesystem

```bash
# Users can always discover:
ls agents/                    # What agents exist
ls .claude/skills/            # What skills exist
```

Never manually maintain lists. They will drift.

## Instructions

### 1. Determine scope

Parse arguments to determine what to update:
- No args → all apps and packages
- `readme` → only README.md
- `agents` → only AGENTS.md
- Path → only that location

### 2. Scan the codebase

```bash
# Skills per app
find apps/*/skills/*/SKILL.md

# Agents
find agents/*.md

# Tools
ls packages/vercel/src/tools/
```

### 3. For README.md updates

1. Read current README.md
2. Find `<!-- auto:skills -->` markers
3. Generate skill table from SKILL.md frontmatter
4. Replace content between markers
5. Preserve everything outside markers

### 4. For AGENTS.md updates

1. Read current file structure
2. Generate/update structure tree
3. Verify conventions section matches reality
4. Update "how to add" sections if patterns changed

### 5. Report

```markdown
## Updated

- apps/bot/README.md - 1 skill
- apps/dev/README.md - 16 skills
- apps/dev/AGENTS.md - structure refreshed

## Skipped

- apps/design/ - no changes detected
```

## Markers

Use HTML comments for auto-generated sections:

```markdown
<!-- auto:skills -->
| Skill | Description |
...
<!-- /auto:skills -->

<!-- auto:structure -->
```
apps/bot/
├── app/api/
...
```
<!-- /auto:structure -->
```

## AGENTS.md template

When creating a new AGENTS.md, use this structure:

```markdown
# {app-name}

{One-line description of what this app does}

## Structure

<!-- auto:structure -->
{generated tree}
<!-- /auto:structure -->

## Conventions

- {where handlers go}
- {where utilities go}
- {naming patterns}

## Adding a new {primary-thing}

1. {step}
2. {step}
3. {step}

## What NOT to do

- {anti-pattern}
- {anti-pattern}
```
