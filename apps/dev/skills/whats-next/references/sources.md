# Sources Discovery

Multi-source triage reads from four sources. Each has a discovery pattern and expected structure.

## 1. Backlog Items

**Pattern:** `.syner/vaults/**/backlog*.md` or `.syner/vaults/**/backlog/**/*.md`

**Structure:**
```markdown
# Backlog Title

- [ ] Item 1
- [ ] Item 2

> Last reviewed: YYYY-MM-DD
```

**Fallback:** If no files match, ask user for backlog location using `AskUserQuestion`.

## 2. Grow Observations

**Pattern:** `.syner/ops/*/observations.md`

**Structure:**
```markdown
# Observations: [domain]

## YYYY-MM-DD

### [observation-id]
- **type:** friction | pattern | insight
- **description:** What happened
- **context:** Where it happened
- **friction:** (if type=friction) The specific pain point
```

**Fallback:** If `.syner/ops/` doesn't exist, skip and note in report: "No grow observations found."

## 3. Tasks

**Pattern:** `.syner/plans/*/README.md`

**Structure:**
```markdown
# Tasks: [domain]

## In Progress
- [ ] Task description @owner #ref

## Pending
- [ ] Task description
```

**Fallback:** If `.syner/plans/` doesn't exist, skip and note in report: "No plans found."

## 4. GitHub Issues

**Command:**
```bash
gh issue list --state open --json number,title,labels,createdAt,assignees --limit 100
```

**Expected fields:**
- `number` — Issue number
- `title` — Issue title
- `labels` — Array of label objects with `name` field
- `createdAt` — ISO timestamp
- `assignees` — Array of assignee objects

**Fallback:** If `gh` fails (not authenticated, not a repo), skip and note in report: "GitHub issues unavailable. Run `/syner-gh-auth` to authenticate."

## Source Priority

When sources conflict or overlap:

1. **GitHub issues** — Canonical source for tracked work
2. **Tasks** — Active work in progress
3. **Backlog** — Planned work not yet started
4. **Observations** — Raw signals, may not yet be actionable

## Discovery Order

1. Discover backlog (required)
2. Discover observations (optional)
3. Discover tasks (optional)
4. Fetch GitHub issues (optional)

Stop and report partial results if backlog is empty.
