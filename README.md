<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="96"/>
  </picture>
</p>

# Syner

Agent orchestrator that understands your personal context through markdown notes.

## How it works

Two layers: **vaults** (private thinking) and **content** (published documentation).

Vaults live in `.syner/vaults/` — your notes, any structure, no schemas. They're gitignored. Your machine has life context; the repo has project context. Skills synthesize both.

When a thought matures, `/grow-note` graduates it into `apps/*/content/`, where Fumadocs renders it as official documentation.

```
.syner/vaults/ (thinking)
  → /grow-note (graduation)
    → apps/*/content/ (published)
```

Skills read vault context and act on it. Invoke them directly or let the orchestrator route:

```
/syner anything new worth exploring?
```

## Structure

```
.syner/                  # OS brain (gitignored operations)
  vaults/                # Centralized vaults (all personal context)
    vaults/              # syner.md app vaults
    dev/                 # syner.dev app vaults
    bot/                 # syner.bot app vaults
    design/              # syner.design app vaults
  ops/                   # Grow specialist observations
  plans/                 # Plans per epic
  research/              # Research artifacts
  system/                # Environment config
apps/                    # Applications (Next.js)
  vaults/                # syner.md — vault dashboard
  bot/                   # syner.bot — integration platform
  dev/                   # syner.dev — developer portal
  design/                # syner.design — design system
packages/                # Shared packages
  syner/                 # Core orchestrator package
  github/                # GitHub App integration
  vercel/                # AI SDK tools (Sandbox)
  slack/                 # Slack integration
  ui/                    # Shared UI components
skills/                  # Skill symlinks (→ apps/*/skills/)
agents/                  # Agent symlinks (→ apps/*/agents/)
```

## Apps

| App | What it is | Content |
|-----|------------|---------|
| [syner.md](apps/vaults/) | Vault dashboard — your notes as agent context | `apps/vaults/content/` |
| [syner.bot](apps/bot/) | Integration platform — GitHub, Slack, webhooks | `apps/bot/content/` |
| [syner.dev](apps/dev/) | Developer portal — docs, specs, changelog | `apps/dev/content/` |
| [syner.design](apps/design/) | Design system — components agents understand | `apps/design/content/` |

Each app owns its published content via [Fumadocs](https://fumadocs.dev) (headless). Vaults are centralized in `.syner/vaults/`.

## Agents

<!-- auto:agents -->
| Agent | Role |
|-------|------|
| `syner` | Main orchestrator |
| `vaults` | Context engineer — vault understanding |
| `bot` | Integration bridge — external systems |
| `dev` | Ecosystem builder — create and maintain |
| `design` | Design lead — UI/UX and accessibility |
| `syner-worker` | Execution with verification loops |
| `syner-researcher` | Research from any source |
| `code-reviewer` | Code quality and security |
| `release-manager` | Release coordination |
<!-- /auto:agents -->

## Quick start

```bash
bun install
bun run dev
```

## References

- [PHILOSOPHY.md](PHILOSOPHY.md) — Design principles
- [CLAUDE.md](CLAUDE.md) — Instructions for Claude Code
