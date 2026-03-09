---
name: syner-fix-symlinks
description: Fix skill and agent symlinks. Use when symlinks are broken, skills/agents not showing up, or after creating new ones.
agent: dev
metadata:
  author: syner
  version: "0.2.0"
tools: [Glob, Bash]
---

# Fix Symlinks

> Part of **Dev** — the Ecosystem Builder mutation of Syner.

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
  ├── {name}.md (real file)        ← root agents (syner, dev, bot, design, etc.)
  └── {name}.md → ../apps/.../...  ← symlink to app-specific agent
```

## Rules

### Skills
1. `.claude/skills` IS `skills/` (symlink) - work in `skills/` only
2. Symlinks point to `../apps/{app}/skills/{name}` or `../packages/{pkg}/skills/{name}`
3. Never symlink to `../skills/...` (circular)

### Agents
1. `.claude/agents` IS `agents/` (symlink) - work in `agents/` only
2. Root agents are **real files** in `agents/` (not symlinks)
3. App-specific agents symlink to `../apps/{app}/agents/{name}.md`
4. Never symlink to `../../agents/...` from within `agents/` (circular)

### Both
- Always `rm -f` before `ln -s` (prevents creating link inside existing dir)

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
ls agents/*.md apps/*/agents/*.md 2>/dev/null

# 2. Check current state in agents/
file agents/*.md

# 3. Verify:
#    - Root agents (syner, dev, bot, design, etc.) = real files
#    - App agents (notes) = symlinks to ../apps/*/agents/
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
# For app-specific agents only:
rm -f {name}.md
ln -s ../apps/{app}/agents/{name}.md {name}.md
# Root agents should be real files, not symlinks
```

Output: `| Type | Name | Source | Action | Status |`

## Boundaries

Validate against `/syner-boundaries`:
- **Self-Verification** — Verify symlinks work after fixing
- **Observable Work** — Report what was fixed
- **Suggest, Don't Enforce** — Check-only by default, fix requires --fix flag
