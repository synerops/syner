---
name: save-bookmark
description: Save a URL as a markdown bookmark that connects to what you're building and thinking about. Reads your vaults and conversation to write bookmarks that feel personal, not generated.
metadata:
  author: syner
  version: "0.1.0"
  agent: vaults
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - WebFetch
---

# Save Bookmark

Bookmarks that know why you care. Not a URL dumper — a context-aware save that connects what you're reading to what you're building and thinking.

## Storage

Bookmarks live in `.syner/bookmarks/` — committed to the repo.

```
.syner/bookmarks/
  anthropic--building-effective-agents.md
  vercel--ai-sdk-overview.md
```

**Filename:** `{source}--{slug}.md` — source is domain/org, slug is kebab-case title.

## Process

### 1. Load Your Context

Before touching the URL, understand what the user is working on and thinking about.

In parallel:
- Glob `.syner/vaults/**/*.md` — read index files and recent notes for themes
- Glob `.syner/bookmarks/*.md` — read existing bookmarks for patterns
- Note the current conversation context — what were you discussing when this URL came up?

Extract: active projects, current interests, recurring themes, open questions.

### 2. Fetch the Content

Use WebFetch to retrieve the page. Extract title, author, date, and the actual substance.

If fetch fails (403, timeout): use what you know about the content. Many popular articles are well-known. Mark `fetchable: false` in frontmatter. Don't let a 403 produce an empty bookmark.

### 3. Read Through the User's Lens

This is the core step. Don't summarize the article generically — read it as the user would.

Ask yourself:
- **What in this connects to their active projects?** (e.g., if they're building an agent orchestrator, an article about agent patterns hits differently)
- **What's the tension?** Does it confirm, challenge, or extend something they already think?
- **What's actionable for them specifically?** Not "this is a good guide" but "the routing pattern here maps to how /syner dispatches skills"

### 4. Write the Bookmark

```markdown
---
url: "{url}"
title: "{title}"
source: "{domain}"
author: "{author}"
date_saved: "{YYYY-MM-DD}"
date_published: "{YYYY-MM-DD if available}"
tags: [{contextual tags}]
fetchable: {true|false}
---

# {Title}

> {The one line that matters to THIS user — not the article's description, but why it resonates}

## Why This Matters to You

{2-3 sentences connecting this content to what the user is actively working on, thinking about, or struggling with. Reference specific projects, notes, or conversations. This should feel like a friend explaining why they sent you the link.}

## Key Takeaways

{3-5 bullets, but filtered: what's relevant to the user's context. Skip generic takeaways. Each bullet should connect back to something concrete in their world.}

## Threads

{Optional. Connections to other bookmarks, vault notes, or active work. Only if real connections exist — don't force it.}

- Connects to: {existing bookmark or note}
- Tension with: {something that contradicts or complicates}
- Builds on: {something they already explored}

## Links

- [Original]({url})
```

### 5. Tags

Tags should reflect the user's taxonomy, not generic categories. Look at existing bookmarks and vault folder names for vocabulary.

If no existing bookmarks: infer from vault structure and project names. Keep 3-5 tags.

### 6. Write and Confirm

Write to `.syner/bookmarks/{source}--{slug}.md`.

Confirm with:

```
Saved: {title}
  → {one-line why it matters to you}
  Tags: {tags}
  Path: .syner/bookmarks/{filename}
```

## Edge Cases

- **Duplicate URL**: Grep existing bookmarks. If found, ask if they want to update (context may have changed since last save).
- **No vault context**: Save anyway, but the "Why This Matters" section should use conversation context instead. Note: "No vault context loaded — connection based on current conversation."
- **Multiple URLs**: Process each one. Each gets its own context pass.
- **URL shared mid-conversation**: The conversation IS the context. What were you discussing? That's the "why."

## Testing

1. `/save-bookmark https://www.anthropic.com/engineering/building-effective-agents`
2. Verify "Why This Matters to You" references specific syner concepts, not generic AI talk
3. Verify "Key Takeaways" are filtered through the user's lens
4. Verify tags use vocabulary from the user's world

Cleanup: `rm .syner/bookmarks/anthropic--building-effective-agents.md`

## Boundaries

- **Concrete Output** — Creates actual file, not a proposal
- **Non-destructive** — Never overwrites without asking
- **Honest connections** — If there's no real connection to the user's context, say so. Don't invent relevance.
- **Notes are context** — Read vaults for understanding, not extraction
