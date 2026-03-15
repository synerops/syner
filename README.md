<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="96"/>
  </picture>
</p>

<h1 align="center">Syner</h1>

<p align="center">
  <strong>Your notes become agents.</strong><br/>
  Describe what you want. Syner figures out the rest.
</p>

<p align="center">
  <a href="https://syner.dev">Docs</a> · <a href="#getting-started">Get Started</a> · <a href="PHILOSOPHY.md">Philosophy</a>
</p>

---

## What is Syner?

Syner turns your markdown notes into an operating system for AI agents.

You write notes the way you always have — no schemas, no databases, no enforced structure. Syner reads them for context, routes your intent to focused skills, and delivers concrete output: PRs, reports, documents, decisions.

**You supervise. Agents execute.**

```
You (intent)
  ↓
Syner (orchestrator)
  ↓
Skills (31 focused capabilities)
  ↓
Your notes (context)
  ↓
Output (PRs, reports, documents)
```

---

## Why Syner?

| Problem | Syner's answer |
|---------|---------------|
| AI agents don't know your context | Your notes are the context — no setup required |
| One monolithic agent fails at everything | 31 skills that each do one thing well |
| Chat disappears after the session | Agents produce PRs, issues, documents — artifacts that persist |
| You have to babysit every step | Background agents work while you do other things |
| Every tool wants you to change your workflow | Syner reads your existing notes as-is |

---

## What you can do

### Think

| Skill | What it does |
|-------|-------------|
| `/find-ideas` | Surface ideas buried across your notes |
| `/find-links` | Connect two domains you've been circling |
| `/grow-note` | Graduate a thought into a real document |
| `/track-idea` | See how an idea evolved over time |
| `/load-all` | Load your full context in one shot |

### Build

| Skill | What it does |
|-------|-------------|
| `/create-syner-app` | Scaffold a new app |
| `/create-syner-skill` | Create a new skill |
| `/create-syner-agent` | Define a new agent |
| `/syner-skill-reviewer` | Audit skill quality before shipping |
| `/workflow-reviewer` | Review GitHub Actions before running |

### Operate

| Skill | What it does |
|-------|-------------|
| `/whats-next` | Figure out what to work on today |
| `/syner-daily-briefing` | Daily status with opinionated recommendations |
| `/backlog-hygiene` | Clean stale issues and duplicates |
| `/syner-gh-auth` | Authenticate GitHub via App tokens |
| `/syner-fix-symlinks` | Repair broken skill/agent links |

[All 31 skills →](skills/)

---

## Agents

Syner delegates to specialized agents. Each owns a domain.

| Agent | Role | What it owns |
|-------|------|-------------|
| **syner** | Orchestrator | Routes intent, loads context, coordinates |
| **vaults** | Context Engineer | Reads notes, synthesizes, returns structured context |
| **dev** | Ecosystem Builder | Creates skills, agents, apps, workflows |
| **bot** | Integration Bridge | Slack, GitHub, webhooks — delivery to the outside world |
| **design** | Design Lead | UI/UX review, accessibility, spatial computing |

Plus **14 lead agents** for packages and infrastructure — each with their own specialist teams totaling 70+ domain experts.

[All 19 agents →](agents/)

---

## Apps

Four apps, one ecosystem.

| App | URL | Purpose |
|-----|-----|---------|
| **Vaults** | [syner.md](https://syner.md) | Browse your thinking — vault dashboard |
| **Dev** | [syner.dev](https://syner.dev) | Docs, skill catalog, specs |
| **Bot** | [syner.bot](https://syner.bot) | Slack & GitHub integrations — execution platform |
| **Design** | [syner.design](https://syner.design) | Components, tokens, slide generation |

---

## Architecture

```
synerops/syner
├── apps/                 # 4 Next.js applications
│   ├── vaults/           #   syner.md
│   ├── dev/              #   syner.dev
│   ├── bot/              #   syner.bot
│   └── design/           #   syner.design
├── packages/             # 8 shared packages
│   ├── sdk/              #   Core runtime (skill resolution, context loading)
│   ├── osprotocol/       #   Protocol types & validators
│   ├── github/           #   GitHub App auth & actions
│   ├── slack/            #   Slack integration & streaming
│   ├── vercel/           #   AI SDK tools & sandbox execution
│   ├── ops/              #   Friction tracking & pattern analysis
│   ├── ui/               #   Shared components & design tokens
│   └── create-syner-agent/ # Agent scaffolding
├── skills/               # 31 symlinked skills
├── agents/               # 19 agent definitions
└── .syner/               # Your vaults (local, gitignored)
```

---

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Bun](https://bun.sh) |
| Framework | [Next.js 16](https://nextjs.org) |
| Monorepo | [Turborepo](https://turbo.build) |
| AI | [AI SDK](https://sdk.vercel.ai) · [Claude Code](https://claude.ai/claude-code) |
| Execution | [Vercel Sandbox](https://vercel.com/docs/sandbox) |
| Docs | [Fumadocs](https://fumadocs.dev) |
| Design | [shadcn/ui](https://ui.shadcn.com) · OKLCH tokens · [Geist](https://vercel.com/font) |

---

## Getting started

```bash
# Clone and install
git clone https://github.com/synerops/syner.git
cd syner
bun install

# Start development
bun run dev

# Talk to the orchestrator
# (requires Claude Code)
/syner
```

### Prerequisites

- [Bun](https://bun.sh) v1.3+
- [Claude Code](https://claude.ai/claude-code) for agent interactions
- GitHub App credentials for `/syner-gh-auth` ([setup guide](https://syner.dev/docs/github-setup))

---

## Philosophy

> Software is built on layers of abstraction. Each generation loses understanding of the layer below but gains power from the layer above. The next layer is **intent**.

Three principles:

1. **Skills, not monoliths** — Each skill does one thing well. An agent that "does everything" does nothing reliably.
2. **Markdown as primitive** — Notes, configs, outputs — all markdown. Humans read it, machines parse it, LLMs understand it natively.
3. **Notes as context** — Skills read notes for understanding, not extraction. Like a colleague reading your docs before helping.

[Full philosophy →](PHILOSOPHY.md)

---

## Contributing

Syner is built by agents, for agents — supervised by humans.

```bash
# Create a skill
/create-syner-skill

# Create an agent
/create-syner-agent

# Review before shipping
/syner-skill-reviewer
```

Every PR goes through code review. Every skill gets audited. Every agent gets tested.

---

## License

[MIT](LICENSE)

---

<p align="center">
  <sub>Built with background agents. Supervised by humans.</sub>
</p>
