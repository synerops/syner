---
name: syner-fix-symlinks
description: Fix skill and agent symlinks. Use when symlinks are broken, skills/agents not showing up, or after creating new ones.
agent: dev
metadata:
  author: syner
  version: "0.2.1"
tools: [Glob, Bash]
---

# Fix Symlinks

Sync `skills/` and `.claude/agents/` with their sources.

This is a maintenance skill. Run after creating skills/agents or when they aren't showing up.

## Usage

- `/syner-fix-symlinks` - check only (safe, no changes)
- `/syner-fix-symlinks --fix` - fix issues found
- `/syner-fix-symlinks --agents` - check agents only
- `/syner-fix-symlinks --skills` - check skills only

## Architecture

### Skills

```
.claude/skills → ../skills  (symlink - never touch directly)

skills/
  ├── {name}/ (real dir)     ← shared skill (only syner currently)
  └── {name} → ../apps/...   ← symlink to app/package skill
```

### Agents

```
.claude/agents → ../agents  (symlink - never touch directly)

agents/
  ├── {name}.md (real file)        ← shared agents (syner, syner-*, code-reviewer, release-manager)
  └── {name}.md → ../apps/.../...  ← lead agents symlink to their app
```

**Lead agents live in their apps:**
- `agents/dev.md` → `../apps/dev/agents/dev.md`
- `agents/bot.md` → `../apps/bot/agents/bot.md`
- `agents/design.md` → `../apps/design/agents/design.md`
- `agents/wiki.md` → `../apps/wiki/agents/wiki.md`

**Shared agents are real files:**
- `agents/syner.md` (orchestrator)
- `agents/syner-worker.md`, `syner-researcher.md`
- `agents/code-reviewer.md`, `release-manager.md`

## Rules

### Skills
1. `.claude/skills` IS `skills/` (symlink) - work in `skills/` only
2. Symlinks point to `../apps/{app}/skills/{name}` or `../packages/{pkg}/skills/{name}`
3. Never symlink to `../skills/...` (circular)

### Agents
1. `.claude/agents` IS `agents/` (symlink) - work in `agents/` only
2. Lead agents (dev, bot, design, wiki) symlink to `../apps/{app}/agents/{name}.md`
3. Shared agents (syner, syner-worker, syner-researcher, code-reviewer, release-manager) are real files
4. Never symlink to `../../agents/...` from within `agents/` (circular)

### Both
- Always `rm -f` before `ln -s` (prevents creating link inside existing dir)

## Issue Classification

When checking symlinks, classify each into one of these states:

| Status | Meaning | Action |
|--------|---------|--------|
| `ok` | Symlink exists with correct relative path | None |
| `missing` | Source exists but no symlink | Create symlink |
| `malformed` | Symlink exists but path has wrong depth (for example `../../../apps/...` instead of `../apps/...`) | Recreate with correct path |
| `broken` | Symlink exists but target doesn't exist | Remove or recreate if source found |
| `orphan` | Symlink exists but no matching source in apps/packages | Remove (confirm first) |

### Path Validation

A symlink path is valid if it matches one of these patterns:

```
../apps/{app}/skills/{name}
../packages/{pkg}/skills/{name}
../apps/{app}/agents/{name}.md
```

Invalid patterns to detect and fix:

- `../../../apps/...` — too many levels up (malformed)
- `../../apps/...` — wrong depth (malformed)
- `apps/...` — missing `../` prefix (malformed)
- Absolute paths — should always be relative (malformed)

## Process

### 0. Anchor to project root

Before running any commands, ensure cwd is the project root:

```bash
[ -d apps ] && [ -d skills ] && [ -d .claude ] || echo "ERROR: not at project root"
```

### Check Skills (default)

```bash
# 1. Find all skill sources
ls apps/*/skills/*/SKILL.md packages/*/skills/*/SKILL.md 2>/dev/null

# 2. Check current state
file skills/*

# 3. Compare and report
```

### Check Agents

```bash
# 1. Find all agent sources
ls apps/*/agents/*.md 2>/dev/null  # lead agents in apps
ls agents/*.md 2>/dev/null          # shared agents + symlinks

# 2. Check current state
file agents/*.md

# 3. Verify:
#    - Lead agents (dev, bot, design, wiki) = symlinks to ../apps/*/agents/
#    - Shared agents (syner, syner-*, code-reviewer, release-manager) = real files
```

### Fix (with --fix)

**Skills:**
```bash
cd skills
rm -f {name}
ln -s ../apps/{app}/skills/{name} {name}
```

**Agents:**
```bash
cd agents

# For lead agents (dev, bot, design, wiki):
rm -f {name}.md
ln -s ../apps/{app}/agents/{name}.md {name}.md

# Shared agents should remain as real files in agents/
```

Output: `| Type | Name | Source | Action | Status |`

## Boundaries

Validate against `/syner-boundaries`:
- **Self-Verification** — Verify symlinks work after fixing
- **Observable Work** — Report what was fixed
- **Suggest, Don't Enforce** — Check-only by default, fix requires --fix flag
