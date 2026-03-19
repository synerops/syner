# syner.md

> Personal knowledge management meets AI orchestration. Human developers use this to run PKM skills against local vaults. Agents use this as the context layer — reading vault files to inform other agents.

## Quick Start

```bash
# Run locally
bun run dev --filter=vaults
# → http://localhost:3000

# Use the PKM skills (the real value today)
/find-ideas
/grow-note .syner/vaults/dev/projects/my-idea.md
/find-links dev design
/track-idea
/load-all
```

Vault files live in `.syner/vaults/` — gitignored and local to your machine. No schema required. Organize however you want.

---

## For Developers

### Setup

No env vars required for local use. The app reads from `.syner/vaults/` via the filesystem.

```bash
bun install
bun run dev --filter=vaults
```

Prerequisites:
- Local `.syner/vaults/` directory with markdown notes (optional — skills work without it, they just find nothing)
- Claude Code for skill invocation

### Vault structure

```
.syner/vaults/          # All vaults — discovery root
  vaults/               # syner.md app context
  dev/                  # syner.dev app context
  bot/                  # syner.bot app context
  design/               # syner.design app context
```

App-specific vaults: `.syner/vaults/vaults/**/*.md`
Full discovery: `.syner/vaults/**/*.md`

Files or folders prefixed with `_` are always ignored. Use them for private content you never want agents to read.

### Skills

Six PKM skills ship with this app. Invoke them via Claude Code:

| Skill | What it does |
|-------|-------------|
| `/find-ideas` | Mine vaults for startup, project, and life ideas; assesses maturity and routes to next step |
| `/find-links` | Bridge two domains — surfaces connections across notes you haven't consciously made |
| `/grow-note` | Graduate raw thoughts into polished documents, or fragment dense files into structure |
| `/track-idea` | Trace how a concept evolved over time using git history and note mentions |
| `/load-all` | Load full context across all vaults — use when synthesis across domains is needed |
| `/vaults-grow-specialist` | Evolve PKM specialists from friction observations via a maturity-level system |

### Content pipeline

Private thinking → published documentation follows a one-way path:

```
.syner/vaults/          (private, gitignored, local)
  → /grow-note          (graduation skill)
    → apps/vaults/content/decks/   (committed, rendered by Fumadocs)
```

Decks render at `/decks/[slug]`. Per-slide OG images at `/decks/[slug]/[slide]/og`.

### Deck format

A deck is a markdown file in `content/decks/` with slides separated by `---`:

```markdown
---
title: My Deck
---

---
template: title
heading: Q1 Review
subtitle: syner.ops
---

---
template: metrics
heading: Velocity
content: "PRs merged: 12"
---
```

Available templates: `title`, `metrics`, `highlights`, `outlook`, `custom`. Rendered via `@syner/ui/slides/registry`.

### Architecture

```
.syner/vaults/          (local markdown notes)
       |
   PKM skills           (Claude Code invocation)
       |
   synthesized context
       |
   /grow-note
       |
apps/vaults/content/    (committed docs)
       |
   Fumadocs             (Next.js rendering)
       |
   /decks/[slug]        (web surface)
```

### Status

| Feature | State |
|---------|-------|
| Landing page (`/`) | Placeholder — "coming soon" |
| PKM skills (6 skills) | Working locally via Claude Code |
| Deck viewer (`/decks/[slug]`) | Working — MDX rendered via Fumadocs |
| Deck OG images (`/decks/[slug]/[slide]/og`) | Working — `@syner/ui/slides/registry` via `next/og` |
| OG images load real deck data | Not yet — returns placeholder slide |
| Vault dashboard (browse/search/edit notes in browser) | Not yet — the future web surface |
| Agent-facing vault API | Not yet — app is statically generated |

The skills are the working product today. The web dashboard is the future product.

### Troubleshooting

**Skills find nothing**

Your `.syner/vaults/` directory is empty or doesn't exist. Create it and add markdown files. The skills work against whatever is there — no schema needed.

**`bun run dev --filter=vaults` fails**

Run `bun install` from the monorepo root first. The `--filter=vaults` flag requires Turbo to resolve workspace dependencies.

**Deck not rendering**

Check that the file is in `apps/vaults/content/decks/` and run `bunx fumadocs-mdx` (or `bun run postinstall` inside the vaults app) to regenerate the content index.
