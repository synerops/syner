---
name: save-bookmark
description: Save a URL as a markdown bookmark that connects to what you're building and thinking about. Reads your vaults and conversation to write bookmarks that feel personal, not generated.
command: save-bookmark
metadata:
  author: syner
  version: "0.0.1"
  agent: vaults
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - WebFetch
---

# Save Bookmark

A bookmark should read like a note you wrote to your future self about why this URL mattered the day you saved it.

## Storage

`.syner/bookmarks/{source}--{slug}.md` — committed to the repo.

## How to Think

There is no template. There is a thinking process.

### 1. Context First

Before anything, build a picture of the person saving this bookmark.

In parallel:
- Glob `.syner/vaults/**/*.md` — index files and recent notes
- Glob `.syner/bookmarks/*.md` — existing bookmarks (their vocabulary, their patterns)
- The current conversation — what were you discussing when this came up?

You're not extracting fields. You're understanding a person.

### 2. Get the Content

WebFetch the URL. If it fails, use what you know — don't produce an empty bookmark over a 403.

### 3. Think Before Writing

Now you have two things: a person and a piece of content. Before writing anything, answer these internally:

- **Why did they save this right now?** Not in general — right now, in this conversation, at this point in their work.
- **What does this change for them?** Does it validate something they're building? Challenge an assumption? Open a new direction?
- **What would they search for when they need this again?** That determines the frontmatter and how you frame it.
- **Is this a reference, an inspiration, a challenge, or a tool?** Each deserves different treatment.

### 4. Write

The only fixed part is the frontmatter:

```yaml
---
url: "{url}"
title: "{title}"
source: "{domain}"
date_saved: "{YYYY-MM-DD}"
tags: [{tags from their vocabulary}]
---
```

Add `author`, `date_published`, `fetchable` only when relevant.

Everything below the frontmatter is freeform. Write what the bookmark needs, not what a template demands. Some bookmarks need three lines. Some need a full analysis. Let the content and context decide.

**The test:** If you replaced the URL with a different one but the body still made sense, you wrote a generic summary. Rewrite.

**Second test:** If you removed the user's name/projects and the body still made sense, you didn't personalize. Rewrite.

### 5. Confirm

```
Saved: {title}
  → {why, in your words}
  .syner/bookmarks/{filename}
```

## Tags

Use the user's language. Look at vault folder names, existing bookmark tags, project names. Not a generic taxonomy — their taxonomy.

## Edge Cases

- **Duplicate URL**: Ask if they want to update — their context may have shifted.
- **No vault context**: The conversation is the context. Write from that.
- **URL mid-conversation**: The conversation IS the reason. Don't ask why — you were there.

## Boundaries

- **Concrete Output** — A real file, not a proposal
- **Non-destructive** — Never overwrite without asking
- **Honest** — If there's no real connection to their work, say so. A bookmark without a reason is just a URL.
