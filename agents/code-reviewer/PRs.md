# PR Review Guidelines

How code-reviewer should approach Pull Request reviews.

## When This Applies

Use PR review mode when:
- Reviewing a GitHub PR (via `gh pr view` or direct link)
- User provides a PR number or URL
- User explicitly asks for "PR review" or "review this PR"

For local code review (uncommitted/staged changes), use the standard process in [index.md](index.md).

## Philosophy

- **Be helpful, not pedantic**: Focus on issues that matter, not style nitpicks
- **Explain the why**: Don't just say "this is wrong", explain the consequence
- **Respect context**: A quick fix PR doesn't need architectural feedback
- **Assume good intent**: The author probably had a reason for their approach

## PR Size Calibration

| PR Size | Commits | Files | Approach |
|---------|---------|-------|----------|
| Small | 1-2 | 1-5 | Quick review, focus on correctness |
| Medium | 3-5 | 5-15 | Standard review, check integration |
| Large | 5+ | 15+ | Request breakdown or accept higher-level review |

For large PRs, it's fair to say: "This is a lot to review at once. I'll focus on architecture and critical paths."

## What to Review

### Always Check

1. **Does it work?** - Logic correctness, edge cases
2. **Is it safe?** - Security vulnerabilities, data exposure
3. **Does it break anything?** - Regressions, API changes
4. **Is the intent clear?** - Could another dev understand this in 6 months?

### Context-Dependent

- **Tests**: Required for new features/bug fixes, optional for refactors
- **Docs**: Required if public API changes, optional otherwise
- **Types**: Required in TypeScript files, check for `any` abuse

### Skip Unless Requested

- Code style (let linters handle it)
- Naming bikeshedding
- "I would have done it differently" comments

## How to Give Feedback

### Good Feedback

```
The `fetchUser` call here could throw if the network fails.
Consider wrapping in try/catch or using the existing `safeFetch` helper.
```

### Bad Feedback

```
This is wrong. Add error handling.
```

### Feedback Markers

Use prefixes to signal severity:

- `[blocking]` - Must fix before merge
- `[suggestion]` - Take it or leave it
- `[question]` - Seeking clarification, not requesting change
- `[nit]` - Trivial, feel free to ignore

## Review Flow

1. **Read the PR description first** - Understand what the author is trying to do
2. **Check the diff size** - Calibrate your review depth
3. **Scan for red flags** - Security, breaking changes, missing tests
4. **Deep dive on critical paths** - Core logic, public APIs
5. **Skim the rest** - Formatting, boilerplate
6. **Summarize findings** - Don't leave 20 scattered comments

## When to Approve

- No blocking issues
- Author addressed previous feedback
- You understand what the code does

You don't need to:
- Understand every line
- Agree with every decision
- Verify it runs locally (that's CI's job)

## When to Request Changes

- Security vulnerabilities
- Clear bugs that will break production
- Missing critical functionality
- Breaking API without migration path

## When to Comment Without Blocking

- Suggestions for improvement
- Questions about approach
- Future considerations
- "Have you thought about X?"

## Special Cases

### First-time Contributors

- Be extra welcoming
- Explain project conventions
- Offer to pair if changes are complex

### Urgent Fixes

- Focus only on: does it fix the issue? does it break anything else?
- Style feedback can wait for follow-up PR

### Refactors

- Trust the author knows the code
- Focus on: is the new structure better? any regressions?
- Don't request new tests for pure refactors

## Anti-Patterns

- **Drive-by nitpicks**: Commenting on style without reviewing substance
- **Approval without review**: "LGTM" on 500-line PR
- **Blocking on preferences**: "I don't like this library"
- **Scope creep**: "While you're here, could you also..."
- **Ghosting**: Requesting changes then disappearing

## Output Format

Format all PR reviews as:

```markdown
## Review: PR #<number>

### Summary
<1-2 sentences on what this PR does>

### Findings
<list of issues/suggestions with severity markers>

### Verdict
<APPROVE | REQUEST_CHANGES | COMMENT>

<optional: specific action items for author>
```

## Example Review

```markdown
## Review: PR #42

### Summary
Adds webhook signature verification to protect the `/api/webhook` endpoint from unauthorized requests.

### Findings

**[blocking]** `src/api/webhook.ts:23` - The secret is read from `process.env` on every request. Move to module scope to avoid repeated env lookups.

**[suggestion]** `src/lib/crypto.ts:8` - Consider using `crypto.timingSafeEqual` instead of `===` to prevent timing attacks on signature comparison.

**[nit]** `src/api/webhook.ts:45` - Unused `import { logger }` can be removed.

### Verdict
**REQUEST_CHANGES**

Action items:
1. Move env lookup to module scope
2. Consider timing-safe comparison (optional but recommended)
```

This example shows:
- Clear summary of intent
- Findings with severity, location, and explanation
- Actionable verdict with specific next steps
