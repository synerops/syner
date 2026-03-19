---
name: build-skill-manifest
description: Build the static skills index.json from all skill directories and verify the SkillLoader pipeline.
---

# Build Skill Manifest

Scans all skill directories, generates `public/.well-known/skills/index.json`, and verifies the full SkillLoader pipeline.

## Usage

```bash
bun packages/vercel/skills/build-skill-manifest/scripts/run.ts
```

## What it does

1. Scans skill directories with `buildSkillsManifest` from `@syner/sdk`
2. Writes `index.json` to `public/.well-known/skills/`
3. Verifies `SkillLoader` reads the index correctly
4. Tests `has()`, `loadContent()`, `preprocessPrompt()`, `createPrepareStep()`

## When to run

- After adding, renaming, or removing skills
- Before deploying (ensures index.json is up to date)
- To verify the skill injection pipeline works end-to-end
