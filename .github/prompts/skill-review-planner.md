# Skill Review Planner

Transform skill-review findings into an actionable plan JSON.

## Input

Read `reports/skill-review.md` which contains the skill review report with `### @claude` findings.

## Process

1. Read the report file
2. Extract items from the `### @claude` section
3. Transform each finding into a plan item with:
   - **id**: The code (B2, D4, etc.)
   - **title**: Brief description
   - **target**: File path(s) to modify
   - **context**: Why this matters
   - **action**: What specific change to make
   - **verify**: How to confirm it worked
   - **priority**: 1 = highest (smallest scope, no dependencies)
4. Write the plan JSON to `.syner/plan.json`

## Output Format

```json
{
  "status": "planned",
  "items": [
    {
      "id": "D4",
      "title": "Fix packages/github SKILL.md frontmatter",
      "target": ["packages/github/SKILL.md"],
      "context": "Missing required frontmatter fields breaks skill discovery",
      "action": "Add complete frontmatter or rename to README.md",
      "verify": "Run skill-reviewer to confirm no errors",
      "priority": 1
    }
  ],
  "clarifications": []
}
```

## Rules

- Max 10 items per plan
- Priority 1 = highest (smallest scope, no dependencies)
- Items with dependencies go after their dependencies
- If no findings found, return `{"status": "empty", "items": [], "clarifications": []}`

## Execute

1. Read `reports/skill-review.md`
2. Parse the `### @claude` section
3. Create plan items
4. Write to `.syner/plan.json`
