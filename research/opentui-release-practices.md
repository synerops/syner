# OpenTUI Release Practices Research

**Date:** 2026-03-28
**Repo:** anomalyco/opentui (9.7k stars, TypeScript TUI library)
**Release Manager:** Sebastian Herrlinger (@hasta84)
**Use case:** Learn practices for one-shot releases (like Stripe's minions articles)

---

## Who is Sebastian Herrlinger

- GitHub: hasta84 / email: hasta84@gmail.com
- **Sole release manager** of OpenTUI. Every single "prepare release" commit is his.
- Also the top contributor by far -- writes core features (Plugins/Slots, Markdown rendering, renderer backdrop, etc.) while also managing the release process.
- Acts as a benevolent dictator: merges community PRs, batches them, and cuts releases.

## Release Cadence (last 3 months)

| Metric | Value |
|--------|-------|
| Total releases (Dec 28 - Mar 28) | **28 releases** |
| Average gap between releases | **3.3 days** |
| Min gap | 0 days (same-day) |
| Max gap | 9 days |
| Same-day double releases | 5 times |
| Releases per week (avg) | **2.2** |

### Monthly breakdown

| Month | Releases |
|-------|----------|
| Dec 2025 | 4 |
| Jan 2026 | 8 |
| Feb 2026 | 9 |
| Mar 2026 | 7 |

## Release Pattern: "Batch and Ship"

Sebastian follows a clear pattern:

1. **Accumulate 2-14 community PRs** over a few days
2. **Run `bun scripts/prepare-release.ts '*'`** which auto-increments the patch version across all packages (core, react, solid)
3. **Commit as "prepare release vX.Y.Z"** directly to main
4. **Push tag `vX.Y.Z`** which triggers the full CI pipeline
5. **CI handles everything**: validate versions, build native binaries (6 platforms), build examples, publish to npm, create GitHub Release with auto-generated release notes

### What goes into a typical release

Example: v0.1.87 -> v0.1.88 (8 days, 14 commits):
- 5 bug fixes from community (Windows support, hitGrid resize, link tracker, word wrap, Kitty keys)
- 2 docs fixes
- 4 core improvements (paste handling, scrollbox, renderer timers, palette tests)
- 1 major feature from Sebastian (Plugins/Slots)
- 1 chore (NodeNext module resolution)

**Key insight:** He doesn't wait for "enough" features. He ships when there's a meaningful batch of fixes/features, even if it's just 2 commits (v0.1.89 -> v0.1.90).

## Release Automation

### The Pipeline (tag-triggered)

```
git tag v0.1.91 && git push --tags
  |
  v
release.yml (tag: v*)
  |
  +-- prepare: extract version, detect dry-run
  +-- validate-version: verify all package.json match tag
  +-- build-native: cross-compile for 6 platforms (darwin/linux/windows x x64/arm64)
  +-- build-examples: compile example executables
  +-- npm-publish: publish @opentui/core, @opentui/react, @opentui/solid
  +-- github-release: create release with binaries + auto-generated notes
```

### Dry Run Support

Tags with `-dry.N` suffix (e.g., `v0.1.91-dry.1`) trigger the full pipeline but:
- npm publishes with `--dry-run`
- GitHub Release is marked as prerelease
- Everything else runs normally (builds, validation)

### Snapshot Releases

Tags with `snapshot` trigger a separate workflow:
- Generates version like `0.0.0-20260328-abcd1234`
- Publishes to npm as a snapshot
- Useful for testing unreleased changes

### The prepare-release Script

```typescript
bun scripts/prepare-release.ts '*'   // auto-increment patch
bun scripts/prepare-release.ts 0.2.0 // explicit version
```

Does:
1. Reads current version from core/package.json
2. Increments patch (or uses explicit version)
3. Updates ALL package.json files (core, react, solid + internal deps)
4. Runs `bun install` to update lockfile
5. Prints next steps (review, build, commit, publish)

## What Makes This Work

### 1. Single person owns the release
No coordination overhead. Sebastian decides when to cut, does it, moves on. No release meetings, no approval gates.

### 2. Extremely low ceremony
The entire release is: run a script, commit, tag, push. ~2 minutes of manual work. CI does the rest.

### 3. Small, frequent batches
2-14 commits per release. Never a massive changelog. Easy to bisect if something breaks.

### 4. Version auto-increment
`prepare-release '*'` means he never thinks about version numbers. Just bump patch, always.

### 5. Tag-triggered CI
No manual npm publish. No manual binary uploads. Push tag = release happens.

### 6. Monorepo version lock
All packages (core, react, solid) always share the same version. No diamond dependency problems.

### 7. Auto-generated release notes
GitHub's `generate_release_notes: true` means the release notes are just the commit list since last tag. Zero writing effort.

---

## Lessons for Syner (One-Shot Release Style)

For your use case of one-shot releases (like Stripe's minions articles), here's what to adopt:

### Adopt These

1. **Tag-triggered releases** - Push a tag, CI does everything. No manual steps after the tag.

2. **Version auto-increment script** - A `prepare-release` script that bumps all packages atomically. You have a monorepo too; keep versions in sync.

3. **Dry-run releases** - Test the full pipeline before shipping. OpenTUI's `-dry.N` pattern is elegant.

4. **Small batch cadence** - Don't accumulate. Ship when there's value, even if small. 2-3 day cadence is healthy.

5. **Auto-generated changelogs** - Use GitHub's release note generation or a tool like changesets. Don't hand-write release notes for one-shots.

### Adapt for One-Shots

Since your releases are "one-shot" (a complete feature lands, you ship it), vs OpenTUI's continuous stream:

| OpenTUI Pattern | Your Adaptation |
|-----------------|-----------------|
| Always patch bumps | Use minor/major when the one-shot warrants it |
| 2-3 day cadence | Release when the feature is done, not on a schedule |
| Batch community PRs | Your one-shot IS the batch -- one PR = one release |
| No changelog writing | Write a short "what's new" for your one-shots since they're bigger |
| Single release manager | Keep it. One person owns the release = no coordination tax |

### Release Checklist for One-Shots

```
1. Feature branch complete, PR merged to main
2. Run prepare-release script (version bump all packages)
3. Commit: "prepare release vX.Y.Z"
4. Tag: git tag vX.Y.Z
5. Push: git push && git push --tags
6. CI: validates, builds, publishes
7. Verify: check npm, check GitHub Release
8. Announce: post the one-shot (blog, social, etc.)
```

### What NOT to Copy

- **28 releases in 3 months** is too many for one-shots. That cadence makes sense for a library with active community PRs.
- **Zero changelog** works for small patches but not for one-shots that need a narrative.
- **Always-patch versioning** -- your one-shots might deserve minor bumps.
