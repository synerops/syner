# syner.md

personal knowledge management meets AI orchestration. **coming soon.**

## what it will be

- a markdown editor where your notes become context for AI agents
- write freely, agents understand your context
- sync across devices, your data stays yours

## what works today

the **skills** work locally via Claude Code:

- `/syner-find-ideas` - generate ideas from your vault
- `/syner-find-links` - connect two domains
- `/syner-grow-note` - promote thoughts to documents
- `/syner-track-idea` - trace idea evolution
- `/syner-load-all` - load full context from all vaults

your vault lives in `apps/notes/vaults/` - agents read it, you own it.

## context

base layer - other apps read from here.

## try it

```bash
bun run dev --filter=notes
```

you'll see the landing page. the real value today is skills + local vault.
