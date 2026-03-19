# syner.dev

Developer portal for the syner ecosystem. Renders the skill catalog and documentation from the monorepo filesystem.

## Quick Start

```bash
bun run dev --filter=dev
# -> http://localhost:3002
```

You'll see the skills catalog on the homepage -- every skill in the monorepo, grouped by category, with modal detail views.

## For Developers

### What's Here

| Surface | What it does | Status |
|---------|-------------|--------|
| Skills catalog | Homepage lists all skills grouped by category, click for detail modal | Functional |
| Documentation | Fumadocs-powered `/docs/[[...slug]]` renders MDX from `content/docs/` | Functional |
| Skill resolution API | POST intent, get best-matching skill name | Experimental |
| Skill review API | POST SKILL.md content, get frontmatter/voice/spec validation | Experimental |
| Agent manifest | GET `/agent` returns this app's own SKILL.md parsed via `@syner/osprotocol` | Functional |

### Architecture

```
apps/*/skills/*/SKILL.md          (source of truth)
        |
  @syner/sdk/skills               (getSkillsList, getSkillBySlug)
        |
  apps/dev/app/                   (Next.js routes)
        |
  +-----------+------------------+-------------------+
  |           |                  |                   |
  page.tsx    /api/skills        /api/skills/resolve /api/review/skill
  (catalog)   (static JSON)     (dynamic matching)  (validation)
```

Skills are discovered from the monorepo filesystem at **build time**. The homepage and `/api/skills` use `force-static` -- skills are baked into the deploy. New skills only appear after a redeploy.

The resolve endpoint (`/api/skills/resolve`) is `force-dynamic` and reads the filesystem at runtime. On Vercel, this means it depends on the monorepo being available at runtime -- which it may not be. Use the static `/api/skills` endpoint for reliable agent discovery in production.

### Skills (18 via Claude Code)

The real value of syner.dev today is the skills that run locally:

| Skill | What it does |
|-------|-------------|
| `/create-syner` | Routes to the right creation skill (app, skill, agent) |
| `/create-syner-app` | Scaffolds Next.js apps with standard stack |
| `/create-syner-skill` | Creates new skills with conventions |
| `/create-syner-agent` | Creates new agents with frontmatter |
| `/update-syner-app` | Syncs existing apps to current stack |
| `/syner-fix-symlinks` | Repairs skill/agent symlinks |
| `/syner-enhance-skills` | Audits + applies fixes with confirmation |
| `/syner-skill-reviewer` | Quality gate: safety, voice, technical, conventions |
| `/syner-readme-enhancer` | Generates honest READMEs from actual code |
| `/whats-next` | Cross-references backlog/GitHub/observations, prioritizes |
| `/backlog-hygiene` | Finds stale, duplicate, tangled backlog items |
| `/syner-daily-briefing` | Daily status dashboard from GitHub data |
| `/syner-boundaries` | Validates proposals against 10 operational boundaries |
| `/workflow-reviewer` | Audits GitHub Actions before running |
| `/test-syner-agent` | Output-first agent testing methodology |
| `/syner-grow-orchestration` | Evolves routing decisions into codified principles |
| `/dev-grow-specialist` | Evolves building/review specialists from friction |
| `/update-docs` | Updates documentation to reflect codebase state |

### Setup

```bash
# From monorepo root
bun install
bun run dev --filter=dev
```

No env vars required for local development. The app reads skills from the monorepo filesystem relative to `apps/dev/` (two levels up to project root).

### Adding Documentation

Docs use [Fumadocs](https://fumadocs.dev). Add MDX files to `content/docs/`:

```
apps/dev/content/docs/
  index.mdx              <- /docs
  getting-started.mdx    <- /docs/getting-started
  guides/
    meta.json
    first-skill.mdx      <- /docs/guides/first-skill
```

Config: `source.config.ts` defines the collection, `lib/source.ts` creates the loader.

### Troubleshooting

**Skill not appearing in catalog?**
Skills must have a valid `SKILL.md` with frontmatter (`name`, `description`). Check that the skill directory is symlinked in `.claude/skills/` or exists under `apps/*/skills/` or `skills/`. Redeploy to pick up changes.

**Content page 404?**
Run `bun run postinstall` (or `fumadocs-mdx`) to regenerate the `.source` directory. Check that your MDX file has valid frontmatter with `title`.
