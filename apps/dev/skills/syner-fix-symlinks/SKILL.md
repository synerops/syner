---
name: syner-fix-symlinks
description: Fix skill symlinks in skills/. Use when symlinks are broken, skills not showing up, or after creating new skills.
metadata:
  author: syner
  version: "0.0.5"
tools: [Glob, Bash]
---

# Fix Symlinks

Sync `skills/` with skill sources in `apps/*/skills/` and `packages/*/skills/`.

## Usage

- `/syner-fix-symlinks` - check only (safe, no changes)
- `/syner-fix-symlinks --fix` - fix issues found

## Architecture

```
.claude/skills → ../skills  (symlink - never touch directly)

skills/
  ├── {name}/ (real dir)     ← shared skill (only syner currently)
  └── {name} → ../apps/...   ← symlink to app/package skill
```

## Rules

1. `.claude/skills` IS `skills/` (symlink) - work in `skills/` only
2. Symlinks point to `../apps/{app}/skills/{name}` or `../packages/{pkg}/skills/{name}`
3. Never symlink to `../skills/...` (circular)
4. Always `rm -f` before `ln -s` (prevents creating link inside existing dir)

## Process

### Check (default)

```bash
# 1. Find all skill sources
ls apps/*/skills/*/SKILL.md packages/*/skills/*/SKILL.md 2>/dev/null

# 2. Check current state
file skills/*

# 3. Compare and report discrepancies
```

Output: `| Skill | Source | Status |` (missing, broken, ok)

### Fix (with --fix)

```bash
cd skills
rm -f {name}
ln -s ../apps/{app}/skills/{name} {name}
file {name}  # verify shows "directory"
```

Output: `| Skill | Source | Action | Status |`
