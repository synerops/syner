<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="96"/>
  </picture>
</p>

<h1 align="center">Syner</h1>

<p align="center">Syner OS give agents to your knowledge system.</p>

<p align="center">
  Your markdown notes become the filesystem. AI skills are the actions.<br/>
  Describe what you want. Syner figures out the rest.
</p>

---

## What you can do

| | |
|---|---|
| `/syner` | Talk to the orchestrator. It routes everything. |
| `/find-ideas` | Discover ideas buried across your vaults |
| `/find-links` | Connect two domains you've been circling |
| `/grow-note` | Graduate a thought into a real document |
| `/whats-next` | Figure out what to work on today |
| `/backlog-hygiene` | Clean stale issues and duplicates |
| `/create-syner-app` | Scaffold a new app |
| `/create-syner-skill` | Create a new skill |
| `/create-syner-agent` | Define a new agent |
| `/syner-skill-reviewer` | Audit skill quality |
| `/syner-gh-auth` | Authenticate GitHub via App tokens |

[All 31 skills](skills/) are available via Claude Code.

## Apps

| App | Domain |
|-----|--------|
| Vaults | **syner.md** -- browse your thinking |
| Dev | **syner.dev** -- docs, specs, changelog |
| Bot | **syner.bot** -- Slack, GitHub integrations |
| Design | **syner.design** -- components, tokens |

## Agents

<!-- auto:agents -->
| Agent | Role |
|-------|------|
| `syner` | Main orchestrator |
| `vaults` | Context engineer |
| `bot` | Integration bridge |
| `dev` | Ecosystem builder |
| `design` | Design lead |
| `syner-worker` | Execution with verification |
| `syner-researcher` | Research from any source |
| `code-reviewer` | Code quality and security |
| `release-manager` | Release coordination |
<!-- /auto:agents -->

## Getting started

```bash
bun install
bun run dev
```

[Philosophy](PHILOSOPHY.md) · [Technical Reference](CLAUDE.md)
