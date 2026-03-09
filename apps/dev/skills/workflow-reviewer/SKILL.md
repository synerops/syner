---
name: workflow-reviewer
description: Review GitHub Actions workflows before running. Use when about to trigger a workflow, debugging workflow failures, or auditing workflow logic. Triggers on "review workflow", "check this workflow", "before I run this", "why did this fail".
agent: dev
tools: [Read, Glob, Grep, WebFetch]
metadata:
  author: syner
  version: "0.1.0"
---

# Workflow Reviewer

> Part of **Dev** — the Ecosystem Builder mutation of Syner.

Catch workflow issues before they cost money or time.

This is a review skill. Run it before triggering workflows or when debugging failures.

## Process

### 0. Anchor to project root

Find the directory containing `.github/` and `package.json`. All paths below are relative to this root.

### 1. Locate workflow

- With argument: find that specific workflow in `.github/workflows/`
- Without argument: ask which workflow to review

### 2. Read completely

Read the entire workflow file. Don't skim.

### 3. Apply checklist

Run through each dimension below. Report findings.

---

## A. Data Flow

Trace every piece of data from creation to consumption.

| Data Type | Questions |
|-----------|-----------|
| **Job outputs** | Where created? How passed? Who consumes? |
| **Artifacts** | What's uploaded? Path correct? Who downloads? |
| **Environment variables** | Set where? Available where? |
| **Secrets** | Which jobs need them? Are they available? |

Common failures:
- Output referenced but never set
- Artifact path mismatch between upload/download
- Secret used in job that doesn't have it

### 4. Job Context

For EACH job, verify:

| Requirement | Check |
|-------------|-------|
| **Checkout** | Does it use `actions/checkout`? Needed if: accessing files, running `gh` commands, reading repo content |
| **Artifacts** | If depends on previous job data, does it download artifacts? |
| **Permissions** | Does it have required permissions? (contents, pull-requests, issues, id-token) |
| **Tokens** | Does it generate/use correct tokens? (GITHUB_TOKEN vs App token) |

### 5. Work Backwards

Start from the desired end state. Trace backwards:

```
End state (e.g., PR created)
  ↑ requires
Intermediate state (e.g., branch exists)
  ↑ requires
Previous action (e.g., commits made)
  ↑ requires
Earlier action (e.g., files edited)
```

At each step ask: "Is this explicitly done, or assumed?"

### 6. External Actions

For each external action used (not `actions/*`):

1. Check the action's documentation
2. Verify inputs match expected format
3. Verify outputs are captured correctly
4. Check if action auto-does things or requires explicit steps

Use `WebFetch` on action's README or action.yml if unclear.

Example questions:
- Does `claude-code-action` auto-commit? (No)
- Does `branch_name_template` create branches? (No, just names them)
- What outputs does the action provide?

### 7. Implicit Assumptions

List assumptions the workflow makes:

| Assumption | Verified? |
|------------|-----------|
| Claude will commit changes | ❌ Must be in prompt |
| `gh` has repo context | ❌ Needs checkout |
| Branch exists after action | ❌ Only if commits made |
| Artifacts persist between jobs | ✅ Yes, within same run |

---

## Output Format

```markdown
## Workflow Review: {name}

### Data Flow
- ✅ {what's correct}
- ❌ {what's broken}: {why} → {fix}

### Job Context
| Job | Checkout | Artifacts | Permissions | Issues |
|-----|----------|-----------|-------------|--------|
| {name} | ✅/❌ | ✅/❌/N/A | ✅/❌ | {notes} |

### Implicit Assumptions
- {assumption}: {verified or not}

### External Actions
- `{action}`: {notes on behavior}

### Recommendations
1. {highest priority fix}
2. {next fix}
...
```

---

## Testing

To test this skill:

```
/workflow-reviewer skill-review.yml
```

Compare findings against known issues in the workflow.

## Boundaries

Validate against `/syner-boundaries`:
- **Context Before Action** — Read entire workflow before auditing
- **Concrete Output** — Actionable findings with specific fixes
- **Suggest, Don't Enforce** — Report findings, user decides what to fix
