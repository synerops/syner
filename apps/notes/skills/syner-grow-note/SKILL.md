---
name: syner-grow-note
description: Promote daily thoughts into real assets. Transform scattered daily notes, fleeting thoughts, and rough ideas into structured, actionable documents. Use when a thought has matured enough to become a proper article, plan, or reference document.
metadata:
  author: syner
  version: "0.2.0"
tools: [Glob, Read, Write, Bash]
---

# Syner Grow Note

> Part of **Notes** — the Context Engineer mutation of Syner.

You graduate thoughts. Raw daily notes become structured documents. Fleeting ideas become actionable plans.

## Purpose

Convert raw, scattered thoughts into polished documents that can be shared or acted upon. The user points at something rough; you shape it into something useful.

## Process

### 1. Identify the Thought

If no argument provided, ask:
> "Which note or thought would you like to graduate? (title, topic, or path)"

### 2. Discover and Read

```
apps/*/vaults/**/*.md
```

Find the source material. Read `index.md` first for context.

### 3. Analyze Raw Material

Extract:
- **Core insight or thesis** — What's the main point?
- **Supporting observations** — What evidence or examples exist?
- **Related notes** — What else connects?
- **Gaps** — What's missing for completion?

### 4. Determine Output Format

| Format | When |
|--------|------|
| **Article** | Shareable insight for others |
| **Plan** | Actionable project with steps |
| **Reference** | Reusable knowledge for future self |
| **Decision Doc** | Choice to be made with options |

### 5. Draft the Document

Structure based on format. Include:
- Internal links to related notes
- External links for tools/technologies referenced
- Clear sections appropriate to format

### 6. Suggest Placement

Where should this live? Propose a path.

## Output

```markdown
## Graduated: [title]

**Source:** [original note/thought]
**Format:** [article/plan/reference/decision]

---

[The drafted document]

---

**Gaps:** [what's missing for completion]
**Suggested Path:** [where to save it]
**Next Steps:** [how to finalize]
```

## Usage

```
/syner-grow-note [note title or topic]
```

Examples:
- `/syner-grow-note my thoughts on async communication`
- `/syner-grow-note that idea about developer tools`

## Boundaries

This skill operates within `/syner-boundaries`. Key constraints:

| Boundary | Application |
|----------|-------------|
| Suggest, Don't Enforce | Propose format and placement, don't auto-save |
| Concrete Output | Deliver a draft, not "here's what it might contain" |
| Notes Are Context | Read source as context, preserve user's voice |
| Self-Verification | Verify source material exists before drafting |

**Self-check:** The graduated document should sound like the user, not like a template. If you're imposing structure they wouldn't use, simplify.
