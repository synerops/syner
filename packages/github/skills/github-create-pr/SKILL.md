---
name: github-create-pr
description: Create GitHub PRs using templates. Use when "crear pr", "create pr", "abrir pr", "open pr", "submit pr".
tools: [Read, Glob, Bash]
skills: [syner-gh-auth]
metadata:
  author: syner
  version: "0.0.1"
---

# GitHub Create PR

Create pull requests using project templates. Handles auth, template selection, and PR creation via `gh`.

## Process

### 1. Authenticate

Run `/syner-gh-auth` before any `gh` command.

### 2. Gather Context

```bash
git status
git diff --stat origin/main...HEAD
git log --oneline origin/main...HEAD
```

### 3. Determine Template

Select template based on branch name or explicit argument.

#### Template Selection Rules

| Priority | Source | Example |
|----------|--------|---------|
| 1 | Explicit arg | `/github-create-pr --template=skill` |
| 2 | Branch prefix | `feat/` → feature, `fix/` → fix, `skill/` → skill |
| 3 | Default | `default.md` |

#### Branch Prefix Mapping

```
feat/*     → feature.md (if exists) → default.md
fix/*      → fix.md (if exists) → default.md
hotfix/*   → fix.md (if exists) → default.md
skill/*    → skill.md (if exists) → default.md
agent/*    → agent.md (if exists) → default.md
docs/*     → default.md
chore/*    → default.md
*          → default.md
```

#### Template Resolution

1. Check if specific template exists:
   ```bash
   ls .github/PULL_REQUEST_TEMPLATE/{template}.md
   ```

2. If not found, fallback to default:
   ```bash
   ls .github/PULL_REQUEST_TEMPLATE/default.md
   ```

3. If no templates exist, use inline format (see Fallback section).

### 4. Read Template

```bash
# Template path determined in step 3
Read .github/PULL_REQUEST_TEMPLATE/{selected}.md
```

### 5. Fill Template

Replace placeholders in template with actual values:

| Placeholder | Source |
|-------------|--------|
| `{{title}}` | First commit message or branch name |
| `{{summary}}` | Generated from diff analysis |
| `{{type}}` | Detected from branch prefix |
| `{{breaking}}` | Check for BREAKING in commits |
| `{{issue}}` | Extract from branch name if `issue-123` pattern |

### 6. Create PR

```bash
gh pr create \
  --title "{{title}}" \
  --body "$(cat <<'EOF'
{{filled_template}}
EOF
)" \
  --base main
```

### 7. Report Result

Output the PR URL and number.

## Template Location

```
.github/PULL_REQUEST_TEMPLATE/
  default.md     # General purpose (required)
  feature.md     # New features (optional)
  fix.md         # Bug fixes (optional)
  skill.md       # New skills (optional)
  agent.md       # New agents (optional)
```

GitHub also uses these templates in the web UI when creating PRs.

## Arguments

| Arg | Description | Example |
|-----|-------------|---------|
| `--template` | Force specific template | `--template=skill` |
| `--title` | Override title | `--title="Add feature X"` |
| `--draft` | Create as draft | `--draft` |
| `--base` | Target branch | `--base=develop` |

## Output

```
✓ PR created: #123
  https://github.com/owner/repo/pull/123

  Title: feat: add new skill
  Base: main ← feat/new-skill
  Template: default.md
```

## Fallback (No Templates)

If no template files exist, use this structure:

```markdown
## Summary

{1-3 bullet points from commits}

## Changes

{Files changed with brief description}

## Test Plan

- [ ] {How to verify}

---
🤖 Generated with [Claude Code](https://claude.ai/code)
```

## Testing

### Test 1: Template detection from branch

```bash
git checkout -b feat/test-pr
/github-create-pr --draft
# Expected: Uses default.md, creates draft PR
# Cleanup: gh pr close --delete-branch
```

### Test 2: Explicit template

```bash
/github-create-pr --template=skill --draft
# Expected: Tries skill.md, falls back to default.md
```

### Test 3: No templates

```bash
mv .github/PULL_REQUEST_TEMPLATE /tmp/
/github-create-pr --draft
# Expected: Uses inline fallback format
# Cleanup: mv /tmp/PULL_REQUEST_TEMPLATE .github/
```

## Boundaries

- **Auth first** — Always run `/syner-gh-auth` before `gh` commands
- **Confirm before push** — If branch not pushed, ask before pushing
- **Never force push** — Use regular push only
