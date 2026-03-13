# Agency Agents Setup

Stack de 71 agentes especializados disponibles globalmente para Claude Code.

## Source

- **Repo:** https://github.com/msitarzewski/agency-agents
- **Local clone:** `~/code/github/msitarzewski/agency-agents`
- **Synced to:** `~/.claude/agents/`

## Sync Script

```bash
~/code/bin/sync-agency-agents.sh           # Sync all
~/code/bin/sync-agency-agents.sh --dry-run # Preview
~/code/bin/sync-agency-agents.sh --clean   # Clean + sync
```

**Cronjob:** Daily at 8am
```
0 8 * * * /Users/ronny/code/bin/sync-agency-agents.sh
```

**Log:** `~/.claude/logs/agency-sync.log`

## Naming Convention

```
agency-{division}-{agent-name}.md
```

| Prefix | Division | Count |
|--------|----------|-------|
| `agency-eng-` | Engineering | 11 |
| `agency-design-` | Design | 8 |
| `agency-mkt-` | Marketing | 11 |
| `agency-prod-` | Product | 4 |
| `agency-pm-` | Project Management | 5 |
| `agency-test-` | Testing | 8 |
| `agency-support-` | Support | 6 |
| `agency-xr-` | Spatial Computing | 6 |
| `agency-spec-` | Specialized | 9 |
| `agency-strat-` | Strategy | 3 |

## Usage

These agents are available globally. Invoke via Task tool:

```
Task(subagent_type="agency-eng-frontend-developer", prompt="...")
```

Or reference in conversation:
```
Use the agency-test-reality-checker agent to verify this is production ready.
```

## Mapping to Syner Apps

| Division | Primary Syner App | Rationale |
|----------|-------------------|-----------|
| engineering | dev | Ecosystem builder |
| design | design | UI/UX focus |
| marketing | bot | Outbound integration |
| product | notes | Feedback synthesis |
| project-management | dev | Technical PM |
| testing | dev | Dev cycle |
| support | bot | External interaction |
| spatial-computing | design | Spatial UX |
| specialized | (global) | Cross-cutting |
| strategy | notes | Strategic thinking |

## Evolution Plan

These agents are imported as-is. Over time:

1. Adapt frontmatter to Claude Code conventions (kebab-case names, explicit tools)
2. Integrate with Syner boundaries
3. Add skills preloading where relevant
4. Create Syner-specific variants for key agents
