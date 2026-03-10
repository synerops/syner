---
name: syner-grow-note
description: Promote daily thoughts into real assets. Transform scattered daily notes, fleeting thoughts, and rough ideas into structured, actionable documents. Use when a thought has matured enough to become a proper article, plan, or reference document.
metadata:
  author: syner
  version: "0.3.0"
tools: [Glob, Read, Write]
---

# Syner Grow Note

> Part of **Notes** — the Context Engineer mutation of Syner.

You detect growth opportunities and execute the right type of evolution.

## Purpose

Growth isn't always "make it bigger." Sometimes it's:
- **Graduate** — Rough thought → Polished document
- **Fragment** — Dense file → Breathable structure
- **Discover** — Hidden potential → Visible opportunities

This skill orchestrates all three.

## Decision Flow

```
Input received
  ↓
Has --scan flag?
  ├─ Yes → Scout Evolution mode
  │         (Find opportunities across vaults)
  │
  └─ No → Analyze target
            ↓
          Is it a .md file path?
            ├─ Yes → Analyze density
            │         ├─ High → Document → Structure
            │         └─ Low → Thought → Document
            │
            └─ No (phrase/topic) → Thought → Document
```

## Modes

Each mode has detailed reference documentation:

### 1. Scout Evolution (`--scan`)
**Reference:** `references/scout-evolution.md`

Proactively scan vaults for evolution opportunities.

**Triggers:**
- `--scan` flag present
- No specific file target

**Output:** Prioritized list of files ready to evolve

### 2. Document → Structure
**Reference:** `references/document-to-structure.md`

Fragment dense documents into folder structures.

**Triggers:**
- Input is `.md` file path
- Density analysis shows 3+ competing concepts
- File > 200 lines with clear boundaries

**Output:** Proposed folder structure + fragment plan

### 3. Thought → Document
**Reference:** `references/thought-to-document.md`

Graduate raw thoughts into polished documents.

**Triggers:**
- Input is phrase/topic
- Input is daily note or rough draft
- Density analysis shows single cohesive idea

**Output:** Drafted document with suggested placement

## Usage

```bash
# Scout for opportunities
/syner-grow-note --scan
/syner-grow-note --scan apps/design/vaults

# Transform dense document
/syner-grow-note apps/design/vaults/syner/components.md

# Graduate a thought
/syner-grow-note "my thoughts on async communication"
/syner-grow-note daily/2024-03-09.md

# Force specific format
/syner-grow-note "async notes" --format article
```

**For detailed help:** Read `help.md` in this skill directory

## Execution Steps

### 1. Parse Input

Extract:
- Target (file, topic, or none if scanning)
- Flags (`--scan`, `--format`, `--path`, `--verbose`, `--stats`)
- Scope (specific path or full vault)

### 2. Read References

Based on mode detected, read the appropriate reference:
```bash
Read references/scout-evolution.md        # If --scan
Read references/document-to-structure.md  # If high density file
Read references/thought-to-document.md    # If thought/topic
```

### 3. Execute Mode

Follow the process defined in the reference document.

### 4. Output Result

Use the output template from the reference, formatted consistently.

## Context Loading

Load proportionally:
- **Scout mode:** Full vault scan (`apps/*/vaults/**/*.md`)
- **Transform mode:** Single file + related notes
- **Graduate mode:** Topic search across vaults

Always read `index.md` files first for orientation.

## Boundaries

This skill operates within `/syner-boundaries`:

| Boundary | Application |
|----------|-------------|
| Suggest, Don't Enforce | Propose structure/format, confirm before executing |
| Concrete Output | Deliver drafts and plans, not vague suggestions |
| Notes Are Context | Read for understanding, preserve user's voice |
| Proportional Loading | Load only what the mode requires |

**Self-check:** Before outputting, verify:
- [ ] Mode detection was correct
- [ ] References were consulted
- [ ] Output is actionable and concrete
- [ ] User's voice is preserved (not templatized)

## Meta-Note

This skill practices what it preaches:

```
syner-grow-note/
  ├── SKILL.md                      ← You are here (orchestrator)
  ├── help.md                       ← User-facing documentation
  └── references/                   ← Detailed mode specifications
      ├── scout-evolution.md
      ├── document-to-structure.md
      └── thought-to-document.md
```

**It evolved from a single file using its own methodology.** This structure is the case study for document → structure transformation.

---

**Related skills:** `/syner-track-idea`, `/syner-find-links`, `/syner-find-ideas`
