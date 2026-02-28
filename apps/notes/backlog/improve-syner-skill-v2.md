# /syner skill backlog

> Last reviewed: 2026-02-26 against SKILL.md v0.1.0 (backlog-triager v1.1)

## Status

| # | Item | Status | Priority |
|---|------|--------|----------|
| 1 | Too generic — tool table adds no value | **Fixed** | - |
| 2 | Doesn't leverage skill ecosystem — add skill routing table | **Fixed** | - |
| 3 | Context phase too heavyweight — add tiered loading | Partial | P1 |
| 4 | Dynamic hard rules — extract from notes, not hardcoded | **Invalid** | - |
| 5 | Verification doesn't match stack | **Fixed** | - |
| 6 | No self-improvement mechanism | Open | P3 |
| 7 | References section underused | Partial | P3 |
| 8 | Deduplicate `index.md` instruction across skills | Open | P2 |
| 9 | Context isolation with `context: fork` | **Fixed** | - |

**Summary**: 4 fixed, 2 partial, 1 invalid, 3 open.

## Prioritized next actions

1. **#3 Tiered context** — `/state` is preloaded via `skills: [state]` but always loads everything. Consider light/medium/full tiers based on task scope.
2. **#8 Deduplicate** — 6 skills copy-paste "How to Read Notes" block. Convention is in `content/index.md`. Skills should reference it.
3. **#7 References** — Has `ai-apps-checklist.md` and links PHILOSOPHY.md. Could add more reference docs.
4. **#6 Self-improvement** — Add note: "To improve this skill, run `/syner-enhance-skills syner`".

## Detail per item

### 1. Too generic — FIXED

**Review note (2026-02-26)**: SKILL.md v0.1.0 no longer has a generic tool table. It now focuses on context-aware routing with a clear flow: Load context → Route or Execute → Summarize. The skill routing table is specific to syner's ecosystem.

### 2. Doesn't leverage the skill ecosystem — FIXED

**Review note (2026-02-26)**: SKILL.md v0.0.4 now has a complete Skill Routing table in Phase 2 (lines 36-56) covering all skills: `/state`, `/trace`, `/connect`, `/ideas`, `/graduate`, `/create-syner-app`, `/update-syner-app`, `/backlog-triager`, `/backlog-reviewer`, `/syner-enhance-skills`, `/vercel-react-best-practices`, `/web-design-guidelines`.

### 3. Context phase too heavyweight

Running `/state` (reads ALL notes) for every task is overkill. Proposed tiers:

- **Light**: Single file tasks — read only the relevant note/project
- **Medium**: Feature within one app — read that app's project note + common-stack
- **Full**: Cross-cutting or ambiguous tasks — run full `/state`

### 4. Dynamic hard rules — INVALID

**Original idea**: Hardcode rules in SKILL.md.

**Proposed approach**: Extract constraints from notes with structured format (Language:, Package manager:, etc.).

**Why invalid**: This contradicts the core philosophy documented in `/PHILOSOPHY.md`. Notes are personal and free-form — there's no schema to extract. Skills read notes for context and understanding, not for parsing structured fields. Proposing formats like "Language:", "Stack:" enforces structure that doesn't belong in a personal notes system.

The philosophy is: **Context, not data extraction**. Skills should understand the user's situation from their notes, not try to parse them into structured metadata.

### 5. Verification doesn't match stack — FIXED

Phase 3 now delegates to `/vercel-react-best-practices` and `/web-design-guidelines` when applicable. Also uses `code-reviewer` subagent.

### 6. No self-improvement mechanism

Add: "To improve this skill, run `/syner-enhance-skills syner`"

### 7. References section underused — PARTIAL

**Review note (2026-02-26)**: Now links `ai-apps-checklist.md` and `planning.md` (workflow patterns). Still missing `common-stack.md` and `preferences.md`.

### 8. Deduplicate `index.md` instruction

6 skills (state, connect, ideas, trace, graduate, enhance) copy-paste the same ~30 line "How to Read Notes" + "Note Format Conventions" block. The convention is already defined in `content/index.md`. Skills should reference that convention with a one-liner instead.

### 9. Context isolation with `context: fork` — FIXED

**Review note (2026-02-26)**: Added `context: fork` and `agent: general-purpose` to SKILL.md frontmatter. Syner now runs in an isolated subagent context, keeping verbose output (lint, tests, code review) out of the main conversation. Also preloads `/state` skill via `skills: [state]`.
