# Syner

Agent orchestrator that understands your personal context through markdown notes.

## Owner

- GitHub: [@rbadillap](https://github.com/rbadillap)

## Build & Dev

- Package manager: `bun` (v1.3.2)
- Install: `bun install`
- Dev: `bun run dev` (runs turbo dev)
- Build: `bun run build`
- Start: `bun run start`

## Project Structure

```
.syner/                  # OS brain (gitignored operations)
  vaults/                # Centralized vaults (all personal context)
    vaults/              # syner.md app vaults
    dev/                 # syner.dev app vaults
    bot/                 # syner.bot app vaults
    design/              # syner.design app vaults
  ops/                   # Grow specialist observations
  plans/                 # Plans per epic (what/how, DoD, deliveries)
  research/              # Research artifacts
  system/                # Environment config
apps/                    # Applications (Next.js)
  vaults/                # syner.md - vault dashboard
  bot/                   # syner.bot - integration platform
  dev/                   # syner.dev - developer portal
  design/                # syner.design - design system
skills/                  # Shared skills (symlinks from apps/packages)
agents/                  # Subagent definitions (symlinks from apps)
packages/                # Shared packages
  syner/                 # Core orchestrator package
  github/                # GitHub App integration
  vercel/                # AI SDK tools (Bash, Fetch) via Vercel Sandbox
  slack/                 # Slack integration
  ui/                    # Shared UI components
.claude/                 # Claude Code compatibility
  skills -> ../skills
  agents -> ../agents
```

## Architecture

### The Flow

```
You (intent)
  ↓
/syner (orchestrator)
  ↓
Skills (focused capabilities)
  ↓
Vaults (markdown notes = context)
  ↓
Output (PR, document, answer)
```

### Why This Design

1. **Skills, not monoliths**: Each skill does one thing well. An agent that "does everything" does nothing reliably.

2. **Markdown as primitive**: Notes, configs, outputs - all markdown. Humans read it, machines parse it, LLMs understand it natively.

3. **Notes as context, not data**: Skills read notes for understanding (like a colleague reading your docs), not for field extraction.

4. **Apps are autonomous**: Each app has its code, its skills, its content. Vaults are centralized in `.syner/vaults/` but partitioned by app. The monorepo is an ecosystem of mini-agents.

## Vault Architecture

Vaults are centralized in `.syner/vaults/`:

```
.syner/vaults/
  vaults/                    # syner.md app context
  dev/                       # syner.dev app context
  bot/                       # syner.bot app context
  design/                    # syner.design app context
```

**Discovery pattern:** `.syner/vaults/**/*.md`
**App-specific:** `.syner/vaults/{app}/**/*.md`

**Key principles:**
- Filesystem IS the configuration (no config file)
- Vaults are gitignored (local > repo)
- Vaults with `_` prefix are always ignored (private)
- Skills discover and read from all vaults dynamically
- Working in an app? That app's vault subdirectory gets priority
- A `vaults/` symlink exists at root for human navigation (Glob does NOT follow symlinks — always use `.syner/vaults/` in code)

**Why vaults are local:**
Your notes are personal. The repo has project context, your machine has life context. Skills synthesize both.

## Content Pipeline

Content is separate from vaults. Vaults are private thinking; content is published documentation.

```
.syner/vaults/ (private, gitignored)
  → /grow-note (graduation)
    → apps/*/content/ (committed, rendered by Fumadocs)
```

Each app owns its content directory:
- `apps/dev/content/docs/` — Developer docs, specs, changelog
- `apps/bot/content/` — Integration guides
- `apps/design/content/` — Design system docs
- `apps/vaults/content/` — PKM guides

Content is rendered via [Fumadocs](https://fumadocs.dev) headless — `source.config.ts` defines collections, `lib/source.ts` creates the loader, pages consume via `source.getPage()`.

## Orchestration

`/syner` is the entry point for complex tasks. It:

1. **Understands intent** - Parses what you want
2. **Loads context proportionally** - None for chat, app-specific for focused work, full for synthesis
3. **Routes to specialists** - Or executes directly if simple

### Context Loading

| Scope | When | Pattern |
|-------|------|---------|
| None | Casual conversation | Respond directly |
| Project | Syner-level context | `.syner/vaults/**/*.md` |
| App | Task within one app | `.syner/vaults/{app}/**/*.md` |
| Targeted | Specific file/topic | Glob/Grep for that area |
| Full | Multi-domain synthesis | `.syner/vaults/**/*.md` via `/load-all` |

### When to Route Through /syner

- GitHub operations (auth is centralized)
- Tasks spanning multiple packages
- Anything needing your personal context
- When unsure which skill to use

## Skills

Skills are markdown files that define capabilities. Located in `apps/{app}/skills/` and symlinked to `.claude/skills/`.

### Orchestration Skills
- `/syner` - Main orchestrator, routes to specialists
- `/load-all` - Load full context from all vaults

### Vaults Skills (apps/vaults/skills/)
- `/find-ideas` - Orchestrate ideas system, discover and route
- `/find-links` - Bridge two domains you've been circling
- `/grow-note` - Promote thoughts into real documents (vaults → content)
- `/track-idea` - Track how ideas evolved over time
- `/vaults-grow-specialist` - Evolve PKM specialists from friction observations

### Dev Skills (apps/dev/skills/)
- `/syner-researcher` - Research topics, routes to right source
- `/whats-next` - What to work on today
- `/backlog-hygiene` - Clean backlog (stale, duplicates)
- `/create-syner-app` - Scaffold new apps
- `/syner-skill-reviewer` - Audit skill quality

### Auth Skills
- `/syner-gh-auth` - Authenticate gh CLI via GitHub App

## Agent Tools

Tools available for AI agents via `@syner/vercel`:

```typescript
import { Bash, Fetch } from '@syner/vercel'
```

| Tool | Description |
|------|-------------|
| Bash | Execute commands in isolated Vercel Sandbox |
| Fetch | Fetch URL content as markdown (truncated to 50k chars) |

Both run in Vercel Sandbox for security isolation.

## GitHub Operations

Always authenticate before gh commands:

```
/syner-gh-auth
```

Uses GitHub App tokens (short-lived, no PATs stored). Auth is centralized through the orchestrator.

## Code Style

- TypeScript with ES modules
- React/Next.js for web apps
- Prefer const over let, never var
- camelCase for variables/functions, PascalCase for components

## Philosophy

See `PHILOSOPHY.md` for full principles:

- **Notes are personal** - No enforced schema, organize however you want
- **Skills suggest, users decide** - Never assume, always confirm destructive actions
- **Markdown everywhere** - The format is the interface
- **Background agents** - Trigger and forget, review when ready

## Gotchas

- **bun, not npm** - Always use bun for installs/scripts
- **Turbo for builds** - Don't run builds directly, use `bun run build`
- **Skills are symlinked** - Edit in `apps/{app}/skills/`, not `.claude/skills/`
- **Vaults are centralized** - All vaults in `.syner/vaults/`, not `apps/*/vaults/`
- **Glob ignores symlinks** - Always use `.syner/vaults/` paths, never the `vaults/` root symlink
- **Vaults vs content** - `.syner/vaults/` is private thinking (gitignored); `apps/*/content/` is published docs (committed)
- **Vaults are local** - Don't expect your full context in CI or other machines

## Vision 2026 Workflow

When the user asks to work on vision-2026 issues:

1. **Auth:** `/syner-gh-auth`
2. **Find work:** `gh issue list --repo synerops/syner --label vision-2026 --state open --json number,title,labels,body -L 100`
3. **Filter:**
   - Skip issues labeled `epic` (parent tracking only)
   - Skip issues labeled `in-progress` (another session owns it)
   - Skip issues labeled `backlog` (TODO for later)
   - Parse "## Dependencies" section — check each dep issue is closed: `gh issue view {n} --json state`
   - Pick the first issue with ALL dependencies met
4. **Claim:** `gh issue edit {n} --add-label in-progress`
5. **Branch:** `git checkout -b vision-2026/{n} feat/vision-2026`
6. **Read context:**
   - Read all files listed in "## Research" section
   - Read all files listed in "## Current Code" section
7. **Implement:** Follow "## Implementation" section exactly
8. **Verify:** Run all checks in "## Acceptance" section
9. **PR:** Create PR to `feat/vision-2026` with `Closes #{n}` in body
10. **Close:** After PR merges, close issue manually (`Closes #N` only works on merge to `main`):
    - `gh issue close {n} --repo synerops/syner --reason completed`
    - `gh issue edit {n} --repo synerops/syner --remove-label in-progress`

## Recommended Action

Read [SYNER.md](./SYNER.md) and [PHILOSOPHY.md](./PHILOSOPHY.md)
