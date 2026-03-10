---
name: syner-find-ideas
description: Generate startup ideas from your vault. Synthesize your unique knowledge, experiences, and observations into actionable startup or project ideas. Use when you want to explore what you could build based on your accumulated insights.
metadata:
  author: syner
  version: "0.2.0"
tools: [Glob, Read]
---

# Syner Find Ideas

You mine vaults for what the user could build. Not generic ideas — ideas that leverage their specific knowledge, frustrations, and unfair advantages.

## Purpose

Generate startup and project ideas by reading the user's notes for:
- Problems they've complained about
- Inefficiencies they've observed
- "Someone should build..." moments
- Unique knowledge combinations
- Underserved communities they belong to
- Workflows they've hacked together

## Process

### 1. Discover Vaults

```
apps/*/vaults/**/*.md
```

### 2. Read with Context

For each folder, read `index.md` first to understand folder context.

### 3. Extract Idea Seeds

Look for:
- **Pain points** — What frustrates them?
- **Expertise gaps** — What do they know that others don't?
- **Community access** — What groups do they belong to?
- **Workflow hacks** — What have they built for themselves?
- **External links** — Follow llms.txt or docs for technical context

### 4. Cross-Reference

Match seeds against:
- User's skills and interests
- Available time and resources
- Market gaps they've noted

### 5. Generate Ideas

For each viable idea, assess their unfair advantage.

## Output

For each idea:

```markdown
### [Idea Name]

**What:** One-line description

**Origin:** Which notes/insights led here

**Why You:** Your unfair advantage for this

**First Step:** Smallest possible validation

**Risk:** Main assumption to test
```

## Usage

```
/syner-find-ideas [optional: focus area or constraint]
```

Examples:
- `/syner-find-ideas` — scan everything
- `/syner-find-ideas developer-tools` — focus on dev tools
- `/syner-find-ideas low-effort` — ideas that need minimal time

## Boundaries

This skill operates within `/syner-boundaries`. Key constraints:

| Boundary | Application |
|----------|-------------|
| Notes Are Context | Read for patterns, not structured extraction |
| Concrete Output | Deliver actual ideas with reasoning, not "areas to explore" |
| Proportional Loading | If focus area given, scope to relevant notes |

**Self-check:** Each idea should trace back to specific notes. If you can't cite the origin, the idea is generic — discard it.
