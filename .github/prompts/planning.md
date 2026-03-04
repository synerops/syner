# Planning Mode

Transform findings into Acceptance Criteria (checklist).

## Instructions

1. Read the issue body
2. Locate the findings/analysis section
3. Transform each finding → verifiable checklist item
4. Update the issue body:
   - Keep original content intact
   - Append `## Acceptance Criteria` section
5. Swap labels: remove `needs-planning`, add `claude`

## Acceptance Criteria Format

```markdown
## Acceptance Criteria

- [ ] Criterion that can be verified (done or not done)
- [ ] Another verifiable criterion
- [ ] Each item should be achievable in one PR
```

**Good criteria:**
- `[ ] All skills use SKILL.md (not skill.md)`
- `[ ] All versions follow 0.x.x format`
- `[ ] No hardcoded paths in skills`

**Bad criteria:**
- `[ ] Improve code quality` ← vague
- `[ ] Consider refactoring` ← not actionable

## Fallback

If the issue has no findings or actionable content:
1. Comment: "No actionable findings to plan."
2. Remove `needs-planning` label
3. Do not add `claude` label

## Example

**Input (findings):**
```
## Findings
- 2 skills use skill.md instead of SKILL.md
- 12 skills use non-standard version format
```

**Output (append to issue):**
```markdown
## Acceptance Criteria

- [ ] `vercel-setup` uses SKILL.md
- [ ] `syner-daily-standup` uses SKILL.md
- [ ] All skill versions follow 0.x.x format
```
