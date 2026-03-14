# syner.md

> Personal knowledge management meets AI orchestration. Human developers use this to run PKM skills against local vaults. Agents use this as the context layer — reading vault files to inform other agents.

### Invoke this agent

```yaml
# agents/vaults.md frontmatter
name: vaults
channel: C0AKWADSSTW
tools: [Read, Glob, Grep, Bash, Edit, Write, Task, Skill]
model: sonnet
skills:
  - find-ideas
  - find-links
  - grow-note
  - track-idea
  - load-all
  - vaults-grow-specialist
```

Via `syner.bot`:

```bash
curl -X POST https://bot.syner.dev/agent \
  -H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET" \
  -H "Content-Type: application/json" \
  -d '{ "agentName": "vaults", "task": "What is the current focus?" }'
```

### Skills contract

| Skill slug | What it returns |
|------------|----------------|
| `find-ideas` | Ranked ideas with origin, unfair advantage, and suggested next step |
| `find-links` | Connections between two named domains with evidence from notes |
| `grow-note` | Draft document or structure proposal for a given thought or file |
| `track-idea` | Evolution timeline of a concept across notes and git history |
| `load-all` | Full synthesized context across all vaults |
| `vaults-grow-specialist` | PKM specialist observation, proposal, and graduation lifecycle |

### Discovery patterns

```
# All vaults
.syner/vaults/**/*.md

# App-specific (this app's context)
.syner/vaults/vaults/**/*.md

# Targeted (search for a topic)
Grep pattern across .syner/vaults/**/*.md
```

### Scoping rules

| Scope | When | Pattern |
|-------|------|---------|
| None | Casual query | Respond directly, no vault read |
| Targeted | Specific file or topic mentioned | Glob/Grep the relevant area |
| App | Task is about a specific app | `.syner/vaults/{app}/**/*.md` |
| Full | Multi-domain synthesis | Delegate to `load-all` |

Default: infer from query. Specific mention → targeted. App context → app. Open-ended → full.

### Output contract

```markdown
## Context: [topic]

[Synthesized information]

**Sources:** [file paths used]
**Confidence:** [High/Medium/Low] — [reason]
**Gaps:** [what wasn't found but might matter]
```

### State

Read at session start. Write at session end. Nothing else.

```
.syner/plans/state.md
```

Fields: current focus, recent queries, key entities, handoff notes.

### Constraints

1. **Glob ignores symlinks.** Always use `.syner/vaults/` paths. Never reference the `vaults/` root symlink — it silently returns nothing.

2. **Vaults are local and gitignored.** Do not expect vault content in CI, in Vercel runtime, or on other machines. Skills that depend on vaults fail silently in those environments.

3. **Vaults are private context, not data.** Read for understanding. Do not extract fields or assume schema. Do not modify vault notes except for state writes to `.syner/plans/state.md`.

4. **`_`-prefixed files are always ignored.** Skip any file or folder starting with `_` in all discovery patterns.

5. **Do not invoke `/load-all` by default.** It reads every vault file. Use targeted or app-scoped loading unless full synthesis is explicitly needed.

6. **No runtime API.** `syner.md` is statically generated. There are no endpoints to call at runtime for vault data.

