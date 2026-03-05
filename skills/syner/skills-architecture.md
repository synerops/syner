# Skill Architecture

This document describes how skills are organized in syner. **Read this before creating or modifying skills.**

## Directory Structure

```
.claude/skills → ../skills  (SYMLINK - do not touch directly)

skills/
  ├── syner/                 (REAL directory - the main orchestrator)
  │   ├── SKILL.md
  │   ├── skills.md          (this file)
  │   └── ...
  ├── create-syner-app → ../apps/dev/skills/create-syner-app
  ├── vercel-setup → ../apps/bot/skills/vercel-setup
  └── syner-gh-auth → ../packages/github/skills/syner-gh-auth

apps/
  ├── dev/skills/            (development tools)
  │   ├── create-syner-app/
  │   ├── syner-fix-symlinks/
  │   └── ...
  ├── notes/skills/          (note-related skills)
  │   ├── syner-find-ideas/
  │   └── ...
  └── bot/skills/            (bot-specific skills)
      └── vercel-setup/

packages/
  └── github/skills/         (github package skills)
      └── syner-gh-auth/
```

## Key Rules

### 1. `.claude/skills` is a symlink

`.claude/skills` points to `skills/`. They are the **same directory**.

```bash
# These are equivalent:
.claude/skills/syner
skills/syner
```

**Never create symlinks inside `.claude/skills/` directly.** All changes go to `skills/`.

### 2. `skills/syner/` is special

The main orchestrator skill (`syner`) is the **only** skill that lives as a real directory in `skills/`. All other entries in `skills/` are symlinks.

Why? Because `syner` is the core - it doesn't belong to any specific app.

### 3. App skills live in `apps/{app}/skills/`

Skills specific to an app live in that app's directory:

| App | Skills Location | Examples |
|-----|-----------------|----------|
| dev | `apps/dev/skills/` | create-syner-app, syner-fix-symlinks |
| notes | `apps/notes/skills/` | syner-find-ideas, syner-grow-note |
| bot | `apps/bot/skills/` | vercel-setup |

### 4. Package skills live in `packages/{pkg}/skills/`

Skills that belong to a package:

| Package | Skills Location | Examples |
|---------|-----------------|----------|
| github | `packages/github/skills/` | syner-gh-auth |

### 5. Symlinks in `skills/` point outward

Symlinks in `skills/` always point to `apps/` or `packages/`:

```bash
# CORRECT
skills/create-syner-app → ../apps/dev/skills/create-syner-app

# WRONG (circular!)
skills/foo → ../skills/foo
```

**Never create a symlink in `skills/` that points to `skills/` itself.**

## Creating a New Skill

### App-specific skill

```bash
# 1. Create the skill
mkdir -p apps/dev/skills/my-skill
# Add SKILL.md

# 2. Create symlink in skills/
cd skills
ln -s ../apps/dev/skills/my-skill my-skill

# 3. Verify
file skills/my-skill  # Should show "directory"
```

### Package skill

```bash
# 1. Create the skill
mkdir -p packages/github/skills/my-skill
# Add SKILL.md

# 2. Create symlink in skills/
cd skills
ln -s ../packages/github/skills/my-skill my-skill
```

### Shared skill (rare)

Only do this for truly shared skills that don't belong to any app. Currently only `syner` is in this category.

```bash
mkdir -p skills/my-shared-skill
# Add SKILL.md directly
```

## Common Mistakes

### Circular symlinks

```bash
# From skills/, this creates a loop:
ln -s ../skills/foo foo
# foo → ../skills/foo → ../skills/foo → ...
```

### Creating symlink when target exists

```bash
# If skills/foo exists (even as broken symlink):
ln -s ../apps/dev/skills/foo foo
# Creates skills/foo/foo instead of replacing!

# Always remove first:
rm -f skills/foo
ln -s ../apps/dev/skills/foo foo
```

### Modifying .claude/skills directly

```bash
# WRONG - .claude/skills is a symlink
cd .claude/skills
ln -s ../apps/dev/skills/foo foo  # Creates skills/../apps/... (wrong path!)

# CORRECT - always work in skills/
cd skills
ln -s ../apps/dev/skills/foo foo
```

## Verification

Check all symlinks are healthy:

```bash
file skills/*
# All should show "directory" (resolved symlink) or be real directories
# None should show "broken symbolic link"
```

If something is broken, use `/syner-fix-symlinks` to repair.
