# syner.dev

### Endpoints

#### GET /api/skills

Returns all skills in the catalog. Statically generated at build time.

```bash
curl https://dev.syner.dev/api/skills
```

```json
[
  {
    "name": "syner-skill-reviewer",
    "slug": "syner-skill-reviewer",
    "description": "Audit a skill and report what needs attention...",
    "version": "0.0.5",
    "category": "dev"
  }
]
```

#### GET /api/skills/[slug]

Returns a single skill's full content. ISR with 1-hour revalidation. Only pre-generated slugs are served (`dynamicParams: false`).

```bash
curl https://dev.syner.dev/api/skills/syner-skill-reviewer
```

Returns the full `SkillContent` object including parsed frontmatter and body.

#### POST /api/skills/resolve

Intent-based skill matching. Sends natural language, gets best match.

```bash
curl -X POST https://dev.syner.dev/api/skills/resolve \
  -H 'Content-Type: application/json' \
  -d '{"intent": "review my skill for quality"}'
```

```json
{
  "skill": "syner-skill-reviewer",
  "confidence": 0.6,
  "alternatives": [
    { "name": "syner-enhance-skills", "description": "...", "score": 0.4 }
  ]
}
```

Scoring: token-overlap between intent and skill description. Minimum threshold: 0.3. No semantic matching -- purely lexical.

#### GET /api/skills/resolve

Returns all skills as `{ name, description }` pairs. Lightweight discovery endpoint.

#### POST /api/review/skill

Validates raw SKILL.md content against conventions.

```bash
curl -X POST https://dev.syner.dev/api/review/skill \
  -H 'Content-Type: application/json' \
  -d '{"content": "---\nname: my-skill\n---\n# My Skill\nI will do things."}'
```

```json
{
  "skillPath": null,
  "issues": [
    { "severity": "error", "message": "Missing required field: description", "line": 0 },
    { "severity": "warning", "message": "First-person voice detected -- use imperative", "line": 4 }
  ],
  "pass": false
}
```

Checks: frontmatter parsing via `@syner/osprotocol`, required fields (`name`, `description`), name format (`/^[a-z][a-z0-9-]*$/`), description length (max 1024), first-person voice detection (`I will`, `I am`, `What I Do`).

#### GET /agent

Returns this app's own SKILL.md parsed as an osprotocol manifest. Cached in-memory after first read.

### Constraints

1. **Do not call `/api/skills/[slug]` with slugs not returned by `/api/skills`.** `dynamicParams: false` means unknown slugs return 404 at the edge, not a filesystem lookup.
2. **Do not assume `/api/skills/resolve` POST is available in production.** It is `force-dynamic` and depends on monorepo filesystem at runtime. In Vercel serverless, the filesystem may not have the full monorepo. Use the static `/api/skills` endpoint for reliable discovery.
3. **Do not POST to `/api/review/skill` without the `content` field.** `skillPath` is optional metadata. `content` (the raw SKILL.md string) is required.
4. **Do not expect real-time skill updates.** The catalog is statically generated at build time. New skills appear only after a deploy.
5. **Skill discovery depends on `@syner/sdk/skills`.** `getSkillsList` and `getSkillBySlug` are the only skill discovery functions. Do not attempt direct filesystem reads from the dev app routes.

### Dependencies

| Package | Used for |
|---------|----------|
| `@syner/sdk` | `getSkillsList`, `getSkillBySlug`, `groupByCategory` |
| `@syner/osprotocol` | `parseSkillManifest` (review API + agent manifest) |
| `@syner/ops` | Workspace dependency (not directly used in routes yet) |

---

## Stack

- Next.js 16.1.6 (App Router)
- Fumadocs (MDX documentation)
- Tailwind CSS v4
- shadcn/ui (Dialog, Badge)
- SWR (client-side skill detail fetching)
- TypeScript
- Port: 3002

## Status

| Component | State |
|-----------|-------|
| Skills catalog UI | Functional -- static generation, modal detail |
| `/api/skills` | Functional -- static, reliable |
| `/api/skills/[slug]` | Functional -- ISR, pre-generated only |
| `/api/skills/resolve` POST | Experimental -- token overlap, no semantic matching |
| `/api/skills/resolve` GET | Functional -- lightweight listing |
| `/api/review/skill` | Experimental -- basic checks (frontmatter, spec, voice) |
| `/agent` manifest | Functional -- cached in-memory |
| `/docs` | Functional -- Fumadocs wired, single index page |
| 19 Claude Code skills | Functional -- the primary value today |

