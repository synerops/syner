<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="96"/>
  </picture>
</p>

# Syner

Agent orchestrator that understands your personal context through markdown notes.

## How it works

Everything starts with your notes. Write markdown in `apps/notes/vaults/` — any structure, no schemas, no config. Your notes become the shared context that powers everything else.

Skills read that context and act on it. You invoke them directly or let the orchestrator route for you.

```
/syner anything new worth exploring?
```

## Apps

| App | What it is |
|-----|------------|
| [syner.md](apps/notes/) | Personal knowledge management — your notes as agent context |
| [syner.bot](apps/bot/) | Integration platform — GitHub, Slack, webhooks |
| [syner.dev](apps/dev/) | Developer portal — skills for building and maintaining |
| [syner.design](apps/design/) | Agentic design system — components agents understand |

## Agents

<!-- auto:agents -->
| Agent | Role |
|-------|------|
| `syner` | Main orchestrator |
| `notes` | Context engineer — vault understanding |
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
