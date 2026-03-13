# PR Prompt Template

Guide for creating pr.md files that reproduce implementations or validate agent behavior.

---

## Types

| Type | When to Use | Structure |
|------|-------------|-----------|
| **Creation PR** | Prompt that creates files/components | Prompt → Expected Output → Match Criteria |
| **Test PR** | Suite that validates agent behavior | Purpose → Tests → Scoring → Quick Prompts |

---

## Creation PR Template

Use when the PR is about **creating something new** (agent, skill, component).

```markdown
# PR: {Component Name}

## Prompt

\`\`\`
{The exact prompt to give the agent}

Instructions:
1. Read these files: [list]
2. Create [what]
3. Update [what]

Show the complete files.
\`\`\`

---

## Expected Output

### {file-path-1}

\`\`\`markdown
{Expected content with placeholders marked as [description]}
\`\`\`

### {file-path-2}

\`\`\`markdown
{Expected content}
\`\`\`

---

## Match Criteria

| Aspect | Must Match |
|--------|------------|
| Structure | {what sections in what order} |
| Frontmatter | {required fields and values} |
| Core Loop | {if applicable} |
| Voice | {tone, examples} |
| Boundaries | {which boundaries apply} |
```

### Key Elements

1. **Prompt is copy-pasteable** - Can be given directly to an agent
2. **Expected Output shows structure** - Not exact text, but shape
3. **Placeholders are explicit** - `[description]` format for variable content
4. **Match Criteria is a table** - Quick validation checklist

---

## Test PR Template

Use when the PR is about **validating behavior** of an existing agent/skill.

```markdown
# PR Test: {Agent/Skill Name}

## Purpose

{One line: what this test suite validates}

---

## Test {N}: {Test Name}

### Prompt

\`\`\`
{The exact prompt to test}
\`\`\`

### Expected Output

{What the agent should produce - structure, tone, content}

### Red Flags (FAIL if present)

- {Behavior that indicates failure}
- {Another failure indicator}
- {Pattern that should NOT appear}

---

## Scoring

| Test | Pass Criteria |
|------|---------------|
| 1. {Name} | {What makes it pass} |
| 2. {Name} | {What makes it pass} |
| ... | ... |

**Pass:** {X}/{Total} or {X-1}/{Total} with minor issues
**Needs Work:** {range}
**Fail:** <{threshold}

---

## Quick Prompts

Copy-paste versions for rapid testing:

### {Category} Check
\`\`\`
{Short prompt}
\`\`\`

### {Category} Check
\`\`\`
{Short prompt}
\`\`\`

---

## How to Run

1. Start a new session
2. Give one test prompt at a time
3. Compare against Expected Output
4. Check for Red Flags
5. Score each test
6. Report results
```

### Key Elements

1. **Each test is independent** - Can run in any order
2. **Red Flags are specific** - Observable behaviors, not vague
3. **Scoring has thresholds** - Clear pass/fail criteria
4. **Quick Prompts enable rapid iteration** - Shortened versions for re-testing

---

## Best Practices

### From notes-identity

- **Voice tests are valuable** - Dedicated test for tone/hedging (Test 8)
- **No-context scenarios matter** - Test what happens when nothing is found (Test 2)
- **Format precision** - Exact header format (`## Context:` not `## Context for:`)

### From bot-identity

- **Show file updates too** - Not just new files, but modifications to existing ones
- **Version bumps are explicit** - `version: "0.2.0" # ← era 0.1.0`
- **Comments show changes** - `# ← nuevo`, `# ← era X`

### From dev-identity

- **Test boundary awareness** - Does the agent detect OUT OF BOUNDS? (Test 3)
- **Self-referential edge cases** - What happens when agent modifies its own rules? (Test 4)
- **Background mode understanding** - Does it know when it runs autonomously? (Test 10)
- **Live mode behavior** - Does it write immediately vs questionnaire? (Test 8)

---

## Checklist Before Submitting

- [ ] Prompt is exact (copy-pasteable)
- [ ] Expected Output matches agent's documented behavior
- [ ] Red Flags reference specific anti-patterns
- [ ] Scoring has clear thresholds
- [ ] Tests cover: happy path, edge cases, failure modes
- [ ] Voice/tone is tested explicitly
- [ ] Boundaries relevant to the agent are validated

---

## Examples

See existing pr.md files:

- `.syner/tasks/notes-identity/pr.md` - Test suite (8 tests)
- `.syner/tasks/bot-identity/pr.md` - Creation prompt
- `.syner/tasks/dev-identity/pr.md` - Test suite (10 tests)
