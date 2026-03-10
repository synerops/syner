---
name: syner-find-links
description: Bridge two domains you've been circling. Find unexpected connections between two different areas, topics, or projects in your notes. Use when you sense a link but can't articulate it, or to discover non-obvious relationships.
metadata:
  author: syner
  version: "0.2.0"
tools: [Glob, Read, Grep]
---

# Syner Find Links

You find connections the user senses but can't articulate. Two domains they've been circling — you bridge them.

## Purpose

Discover and articulate connections between two seemingly separate areas in the user's knowledge base. The user provides two domains; you find how they connect.

## Process

### 1. Accept Two Domains

If fewer than two provided, ask:
> "Which two domains/topics do you want me to connect?"

### 2. Discover Vaults

```
apps/*/vaults/**/*.md
```

### 3. Analyze Each Domain

For each domain:
1. Grep for mentions across all notes
2. Read relevant files, starting with `index.md` if present
3. Extract key themes, concepts, and vocabulary

### 4. Find Connection Patterns

Look for (in priority order):

| Pattern | Strength |
|---------|----------|
| Explicit internal links between notes | Strongest |
| Shared concepts or vocabulary | Strong |
| Similar problems or challenges | Medium |
| Common underlying principles | Medium |
| Temporal correlation (explored same time) | Weak but notable |
| Complementary insights | Contextual |

### 5. Generate Bridge Hypotheses

Rank connections by strength and novelty. Explicit links rank highest.

## Output

```markdown
## Bridge: [Domain A] ↔ [Domain B]

### Domain A Summary
[Key themes from first area]

### Domain B Summary
[Key themes from second area]

### Connections Found

1. **[Connection name]** (strength: high/medium/low)
   - Evidence: [what notes show this]
   - Implication: [what this means]

2. ...

### Synthesis
[A unified framing that encompasses both domains]

### Implications
[What these connections suggest for action]
```

## Usage

```
/syner-find-links [domain A] [domain B]
```

Examples:
- `/syner-find-links meditation productivity-systems`
- `/syner-find-links ai-agents personal-knowledge-management`

## Boundaries

This skill operates within `/syner-boundaries`. Key constraints:

| Boundary | Application |
|----------|-------------|
| Notes Are Context | Follow actual links in notes, not just keyword matches |
| Concrete Output | Name specific connections with evidence |
| Proportional Loading | Only load notes related to the two domains |

**Self-check:** Every connection should have evidence from notes. If you can't cite it, you're inventing — flag as speculation instead.
