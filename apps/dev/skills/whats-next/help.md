# whats-next Help

Tells you what to work on today. Synthesizes backlog, observations, tasks, and GitHub issues into an opinionated action plan.

## Quick Start

```bash
# Full synthesis (recommended)
/whats-next

# Just check backlog items (simple mode)
/whats-next --backlog-only

# Skip GitHub API calls (faster)
/whats-next --quick

# Focus on specific domain
/whats-next --domain bot
```

## Modes

### Full Mode (default)

Reads all four sources:
1. Backlog items from vaults
2. Grow observations from `.syner/ops/`
3. Plans from `.syner/plans/`
4. Open GitHub issues

Generates a report at `.syner/reports/triage-{date}.md`.

### Backlog Only (`--backlog-only`)

Only reads backlog items and compares against code state. Useful when:
- No observations/tasks exist yet
- Quick check
- Testing the skill

### Quick Mode (`--quick`)

Skips GitHub API calls. Reads backlog, observations, and tasks. Faster when:
- Working offline
- GitHub auth expired
- Rapid iteration

### Domain Filter (`--domain X`)

Filter all sources to a specific domain (bot, notes, dev). Useful when:
- Deep-diving one area
- Too many items across domains
- Focused work session

## Output

### Report File

Written to `.syner/reports/triage-{date}.md` with:
- **First Move** — Single highest-impact action
- **Focus Area** — Domain needing most attention
- **Decisions Blocking Work** — Issues waiting on decisions
- **Priority Items** — Top priority / This week / Later categorized list
- **Cross-Reference Map** — Related items across sources

### Console Summary

Brief summary printed after report is written:
```
First move: [action]
Focus area: [domain] ([N] signals)
Items: [X] top priority, [Y] this week, [Z] later
```

## Troubleshooting

### "No backlog found"

The skill couldn't find backlog files. Check:
- Files exist at `.syner/vaults/**/backlog*.md`
- Or files exist in `.syner/vaults/**/backlog/` directory

The skill will ask for the location if auto-discovery fails.

### "No grow observations found"

Normal if you haven't run grow specialists yet. The skill continues with other sources.

To create observations:
```bash
/bot-grow-specialist observe
/vaults-grow-specialist observe
```

### "GitHub issues unavailable"

The `gh` CLI isn't authenticated. Run:
```bash
/syner-gh-auth
```

Or use `--quick` mode to skip GitHub.

### "No task tracking found"

Normal if you don't use `.syner/plans/` yet. The skill continues with other sources.

## Related Skills

- `/backlog-hygiene` — Clean backlog (duplicates, stale items)
- `/syner-daily-briefing` — Daily status with GitHub activity
- `/bot-grow-specialist` — Create observations for bot domain
