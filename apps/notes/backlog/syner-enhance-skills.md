# /syner-enhance-skills

> Version: 0.2.0 | Location: `skills/syner-enhance-skills/SKILL.md`

Audits and improves existing skills by applying best practices from the syner ecosystem.

## Usage

```
/syner-enhance-skills [skill-name]
```

Without arguments, lists available skills and prompts for selection.

## Checklist (11 items)

| # | Item | Detects |
|---|------|---------|
| 1 | Tool Usage Specificity | Vague "read files" without naming tools |
| 2 | Path Resolution | Relative paths that assume cwd |
| 3 | Context File Convention | Missing `index.md` checks |
| 4 | Input Validation | Missing fallback for optional/required inputs |
| 5 | Output Structure | Undefined output format |
| 6 | Skill References | Relative paths to other skills |
| 7 | Frontmatter Completeness | Missing `context: fork`, `skills:`, `agent:` |
| 8 | Philosophy Alignment | Violates PHILOSOPHY.md principles |
| 9 | Boilerplate Deduplication | Copy-pasted patterns (e.g., "How to Read Notes") |
| 10 | Worker Delegation | Complex execution that should use syner-worker |
| 11 | Simplicity Principle | Over-specified implementations |

## Changelog

### 0.2.0 (2026-02-26)

- Renamed from `/enhance` to `/syner-enhance-skills`
- Added items 7-11 (frontmatter, philosophy, deduplication, worker delegation, simplicity)
- Refined item 4 with anti-pattern guidance for input validation

### 0.1.0

- Initial version with 6 checklist items
