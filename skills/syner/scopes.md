# Scope Discovery Protocol

How Syner discovers and presents capabilities within a scope.

## Scope-to-Directory Mapping

One scope per app or package that has a `skills/` directory. No invented groupings — the filesystem IS the registry.

| Scope | Directory | What lives here | Example intents |
|-------|-----------|-----------------|-----------------|
| dev | `apps/dev/skills/` | Developer tools, plans, scaffolding, ecosystem building, skill creation, agents, reviews | "review this plan", "what's next", "create a new skill", "scaffold an app" |
| vaults | `apps/vaults/skills/` | Ideas, notes, content pipeline, PKM, knowledge synthesis | "find ideas about X", "grow this note", "track how this idea evolved", "load all context" |
| bot | `apps/bot/skills/` | Integrations, webhooks, deployment configuration | "set up Vercel env vars", "configure bot deployment" |
| design | `apps/design/skills/` | Design system, design specialists | "evolve design decisions", "design system review" |
| github | `packages/github/skills/` | GitHub operations, PRs, authentication, CLI | "authenticate with GitHub", "create a PR", "run gh command" |
| vercel | `packages/vercel/skills/` | Build tools, skill manifests | "build skill manifest" |

## Discovery Protocol

When Syner enters a scope:

1. **Glob for skills:** `Glob("{area}/*/SKILL.md")` where `{area}` is the scope's directory
2. **Read each SKILL.md:** Extract `name` and `description` from frontmatter
3. **Present or route:**
   - If the user asked "what can I do in X?" — summarize all discovered skills
   - If the user has a specific intent — match it to a discovered skill and route

## Answering "What can I do in X?"

```
User: "what can I do with github?"
Syner:
  1. Glob("packages/github/skills/*/SKILL.md")
  2. Read each → extract name + description
  3. Present: "In the github scope: syner-gh-auth (authenticate gh CLI),
     github-create-pr (create PRs with templates), github-cli (run gh commands)"
```

The response is always current — it reads the filesystem, not a cached list.

## Unknown Scopes

If the user asks about a scope that doesn't exist:

1. List known scopes: "I know these scopes: dev, vaults, bot, design, github, vercel"
2. Suggest the closest match if intent is clear
3. Or attempt broad discovery: `Glob("apps/*/skills/*/SKILL.md")` + `Glob("packages/*/skills/*/SKILL.md")` to search across all scopes

## How Scopes Grow

- **New app with `skills/`** → becomes a scope automatically on next discovery
- **New skill in existing app** → appears when Syner globs that scope
- **No registration needed** — no config file, no schema update, no frontmatter change
- **Scope removal** — delete the app or its `skills/` directory. The scope disappears.

The filesystem IS the configuration. If it has a `skills/` directory with SKILL.md files, it's a scope.

## Scopes Are Not Commands

Scopes are areas of capability, not CLI subcommands. There is no parser. `/syner github` doesn't tokenize `github` as a subcommand — the LLM reads the scope table and routes intelligently.

This means:
- "help me with github auth" routes to `github` scope just like `/syner github auth` does
- The LLM understands context, not just exact matches
- New scopes work immediately without updating a parser
