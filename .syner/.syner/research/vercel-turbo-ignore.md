# Research: Vercel Deploy Cost & turbo-ignore Behavior

**Date:** 2025-03-10
**Status:** Complete
**Related observation:** `vercel-deploy-cost-turbo-ignore`

---

## Problem Statement

Vercel deploys all 4 apps (`notes`, `bot`, `dev`, `design`) on every PR, even when changes don't affect app code. `turbo-ignore` is configured but behavior is inconsistent.

## Current Configuration

### turbo.json (root)
```json
{
  "tasks": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**"]
      // No "inputs" specified → uses defaults
    }
  }
}
```

### Each app's vercel.json
```json
{
  "ignoreCommand": "npx turbo-ignore"
}
```

## Root Cause Analysis

### 1. Skills are tracked as build inputs

Turbo's default behavior: **all git-tracked files in the workspace are inputs**.

**Evidence from `turbo build --dry=json`:**

| App | Input Files | Includes |
|-----|-------------|----------|
| `notes` | 39 files | `skills/**/*.md`, `vaults/**/*.md` |
| `bot` | 36 files | `skills/**/*.md` |

Skills are Claude Code configuration, NOT Next.js build inputs. But turbo treats them as such.

### 2. Vaults are partially tracked

```
apps/notes/vaults/syner/*.md  → tracked in git
apps/*/vaults/*               → gitignored (except syner/)
```

The `syner/` vault IS tracked, so vault edits trigger `notes` rebuilds.

### 3. New branch behavior

From [turborepo/discussions/7455](https://github.com/vercel/turborepo/discussions/7455):

> When a branch has never been deployed before, there's no previous deployment to compare against. We opt for the safe approach of deploying just in case.

**Result:** First commit on any new branch → deploys ALL apps.

### 4. No `--fallback` configured

`turbo-ignore` without `--fallback` has no reference point on new branches. Solution: `npx turbo-ignore --fallback=origin/main`

## Input Files Breakdown

### notes (39 inputs)
```
Source code:        ~10 files (app/, lib/, components/)
Config:             ~5 files (tsconfig, next.config, etc.)
Skills:             ~18 files (skills/**/*.md)
Vaults:             ~6 files (vaults/syner/**/*.md)
```

### bot (36 inputs)
```
Source code:        ~18 files (app/, lib/)
Config:             ~5 files
Skills:             ~8 files (skills/**/*.md)
Agents:             ~1 file (agents/bot.md)
```

## Solutions

### Option A: Exclude non-build files from inputs (Recommended)

Add to each app's `turbo.json`:

```json
// apps/notes/turbo.json
{
  "extends": ["//"],
  "tasks": {
    "build": {
      "inputs": [
        "$TURBO_DEFAULT$",
        "!skills/**",
        "!vaults/**",
        "!agents/**",
        "!*.md"
      ]
    }
  }
}
```

**Pros:**
- Precise control over what triggers builds
- Works with existing turbo-ignore
- No custom scripts needed

**Cons:**
- Need to maintain in each app
- Must remember to update when structure changes

### Option B: Add --fallback to turbo-ignore

Update all `vercel.json`:

```json
{
  "ignoreCommand": "npx turbo-ignore --fallback=origin/main"
}
```

**Pros:**
- Fixes new branch behavior
- Simple change

**Cons:**
- Doesn't fix the skills/vaults input issue
- Still rebuilds on .md changes in the app

### Option C: Use Vercel's automatic skip (July 2024)

From [Vercel changelog](https://vercel.com/changelog/automatically-skip-unnecessary-deployments-in-monorepos):

> Projects without changes in their source code (or the source code of internal dependencies) will be skipped.

**How:** Remove `ignoreCommand` entirely. Vercel has native support.

**Pros:**
- Zero configuration
- Maintained by Vercel
- Works with workspace dependencies

**Cons:**
- Less control
- May still track .md files as changes
- Black box behavior

### Option D: Custom ignore script

Create `scripts/vercel-ignore.sh`:

```bash
#!/bin/bash
# Skip if only .md files changed
CHANGED=$(git diff --name-only HEAD^ -- . | grep -v '\.md$')
if [ -z "$CHANGED" ]; then
  echo "Only .md files changed, skipping build"
  exit 0
fi
npx turbo-ignore --fallback=origin/main
```

**Pros:**
- Full control
- Understands syner's structure
- Can add complex logic

**Cons:**
- Custom code to maintain
- Git diff on shallow clones can be tricky

## Recommendation

**Implement A + B together:**

1. **Exclude non-build inputs** in each app's turbo.json
2. **Add --fallback** to handle new branches

This combination:
- Prevents .md edits from triggering builds
- Handles new branch edge case
- Uses standard turbo features (no custom scripts)
- Is transparent and maintainable

## Implementation Plan

### Step 1: Create app-level turbo.json files

```bash
# apps/notes/turbo.json
# apps/bot/turbo.json
# apps/dev/turbo.json
# apps/design/turbo.json
```

Each with:
```json
{
  "extends": ["//"],
  "tasks": {
    "build": {
      "inputs": [
        "$TURBO_DEFAULT$",
        "!skills/**",
        "!vaults/**",
        "!agents/**",
        "!*.md",
        "!AGENTS.md",
        "!README.md",
        "!CHANGELOG.md"
      ]
    }
  }
}
```

### Step 2: Update vercel.json files

```json
{
  "ignoreCommand": "npx turbo-ignore --fallback=origin/main"
}
```

### Step 3: Test locally

```bash
# Verify inputs are reduced
npx turbo build --filter=notes --dry=json | jq '.tasks[0].inputs'

# Should NOT include:
# - skills/**
# - vaults/**
# - *.md files
```

### Step 4: Test on PR

Create a PR that only modifies `.md` files. Verify:
- Apps with no code changes are skipped
- Apps with code changes still build

## Metrics to Track

| Metric | Before | After (Expected) |
|--------|--------|------------------|
| Deploys per .md-only PR | 4 | 0 |
| Deploys per new branch | 4 | 0-1 |
| Build minutes/month | High | ~75% reduction |

## Sources

- [turbo.json configuration](https://turbo.build/repo/docs/reference/configuration)
- [turbo-ignore new branch issue](https://github.com/vercel/turborepo/discussions/7455)
- [Vercel automatic skip feature](https://vercel.com/changelog/automatically-skip-unnecessary-deployments-in-monorepos)
- [Excluding files with negative globs](https://github.com/vercel/turborepo/discussions/8041)

---

## Next Steps

1. [ ] Implement Option A + B
2. [ ] Test on a .md-only PR
3. [ ] Monitor Vercel usage for 1 week
4. [ ] Consider `ops-deploy-optimizer` specialist if pattern recurs
