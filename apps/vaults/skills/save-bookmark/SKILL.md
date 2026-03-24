---
name: save-bookmark
description: Save URLs as markdown bookmarks with metadata. Use when "save bookmark", "guardar link", "bookmark this", "save this url", "agregar bookmark", or when user shares a URL to save.
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

Save URLs as markdown artifacts with rich frontmatter metadata.

## Storage

Bookmarks live in `.syner/bookmarks/` — committed to the repo (not gitignored like vaults).

```
.syner/bookmarks/
  anthropic--building-effective-agents.md
  vercel--ai-sdk-overview.md
```

**Filename convention:** `{source}--{slug}.md` where source is the domain/org and slug is a kebab-case title.

## Process

### 1. Receive URL

Extract the URL from user input. If no URL provided, ask for one.

### 2. Fetch Content

Use WebFetch to retrieve the page content. Extract:
- **Title** from the page
- **Description** from meta tags or first paragraph
- **Author** if available
- **Date** if available (published date)

### 3. Generate Bookmark File

Create a markdown file with this structure:

```markdown
---
url: "{url}"
title: "{title}"
description: "{description}"
source: "{domain}"
author: "{author if available}"
date_saved: "{YYYY-MM-DD}"
date_published: "{YYYY-MM-DD if available}"
tags: [{relevant tags}]
---

# {Title}

> {Description or key takeaway — one or two lines}

## Why

{One sentence: why this was bookmarked, based on context or user input}

## Key Ideas

{3-5 bullet points summarizing the core ideas from the content}

## Links

- [Original]({url})
```

### 4. Write File

Write to `.syner/bookmarks/{source}--{slug}.md`.

If the bookmarks directory doesn't exist, create it.

### 5. Confirm

Show the saved bookmark in a compact summary:

```
Saved: {title}
  {url}
  Tags: {tags}
  Path: .syner/bookmarks/{filename}
```

## Tags

Infer tags from content. Use lowercase, kebab-case. Common categories:
- Domain: `ai`, `design`, `devops`, `frontend`, `backend`
- Type: `guide`, `reference`, `tutorial`, `opinion`, `research`
- Ecosystem: `anthropic`, `vercel`, `next`, `react`

Keep to 3-5 tags max.

## Edge Cases

- **Duplicate URL**: Check existing bookmarks with Grep for the URL. If found, ask user if they want to update.
- **Unreachable URL**: Save anyway with available info, mark with `status: unreachable` in frontmatter.
- **Multiple URLs**: Process each one sequentially, confirm after each.

## Testing

To test this skill:
1. `/save-bookmark https://www.anthropic.com/engineering/building-effective-agents`
2. Verify file created at `.syner/bookmarks/anthropic--building-effective-agents.md`
3. Verify frontmatter has url, title, tags
4. Verify Key Ideas section has substantive bullets

Cleanup: `rm .syner/bookmarks/anthropic--building-effective-agents.md`

## Boundaries

- **Concrete Output** — Creates actual markdown file, not a proposal
- **Non-destructive** — Never overwrites without asking
- **Minimal** — One file per bookmark, no database, no index
