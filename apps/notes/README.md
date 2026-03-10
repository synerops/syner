# syner.md

personal knowledge management meets AI orchestration. **coming soon.**

## what it will be

- a markdown editor where your notes become context for AI agents
- write freely, agents understand your context
- sync across devices, your data stays yours

## what works today

the **skills** work locally via Claude Code:

<!-- auto:skills -->
| Skill | Description |
|-------|-------------|
| `/find-ideas` | Generate startup ideas from your vault |
| `/find-links` | Bridge two domains you've been circling |
| `/grow-note` | Promote thoughts into structured documents |
| `/track-idea` | Track idea evolution over time |
| `/load-all` | Load full context from all vaults |
<!-- /auto:skills -->

your vault lives in `apps/notes/vaults/` - agents read it, you own it.

## context

base layer - other apps read from here.

## try it

```bash
bun run dev --filter=notes
```

you'll see the landing page. the real value today is skills + local vault.
