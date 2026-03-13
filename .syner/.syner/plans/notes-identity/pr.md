# PR Test: Notes Identity

## Purpose

Validate that the Notes agent and skills produce the expected output format, voice, and language adaptation.

---

## Test 1: Notes Agent — Ambiguous Query

### Prompt

```
You are the Notes agent. Read your identity from agents/notes.md, then respond to this query:

"What's the status of the client project?"

Assume you found this in the vault:
- vaults/dev/projects/acme-corp.md mentions OAuth implementation complete, refresh tokens pending
- .syner/tasks/state.md shows last session worked on Acme Corp

Produce your response.
```

### Expected Output

- Opens with `## Context: [topic]` (NOT `## Context for: [topic]`)
- Synthesized information in natural prose, not bullet dump
- Ends with:
  ```
  **Sources:** [files]
  **Confidence:** [level] — [reason]
  **Gaps:** [if any]
  ```
- Voice is direct, no hedging ("Here's what I found" not "I found some potentially relevant information")

### Red Flags (FAIL if present)

- Uses old format `### Relevant Information` / `### Sources` / `### Confidence` / `### Gaps` as separate sections
- Hedging language ("might be", "potentially", "I think")
- Dumps raw notes instead of synthesizing

---

## Test 2: Notes Agent — No Context Found

### Prompt

```
You are the Notes agent. Read your identity from agents/notes.md, then respond to this query:

"What's our pricing strategy?"

Assume you searched all vaults and found nothing related to pricing.

Produce your response.
```

### Expected Output

```markdown
## Context: pricing strategy

No notes found about pricing strategy in any vault.

**Sources:** (none)
**Confidence:** N/A
**Gaps:** Consider asking:
- Is this a new initiative?
- Is it referred to by another name?
- Should there be existing documentation?
```

### Red Flags (FAIL if present)

- Invents information not in vault
- Uses old verbose format with separate sections
- Doesn't offer helpful gaps/questions

---

## Test 3: syner-load-all

### Prompt

```
You are the syner-load-all skill. Read your instructions from apps/notes/skills/syner-load-all/SKILL.md.

Before executing, answer: Should you run? The user just asked "what color is the sky?"

Then, assume a different scenario where full load IS appropriate. Show what your output structure would look like.
```

### Expected Output

1. First part: "No, this query doesn't need full context. Proportional loading says: casual chat → none."

2. Second part shows structure:
   ```markdown
   ## Full Context

   ### Active Focus
   [...]

   ### Background Projects
   [...]

   ### Key Themes
   [...]

   ### Open Loops
   [...]

   ### Context Window
   [...]
   ```

### Red Flags (FAIL if present)

- Would run full load for simple query (violates Proportional Loading)
- Missing self-check consideration
- Output structure doesn't match expected sections

---

## Test 4: syner-find-ideas

### Prompt

```
You are the syner-find-ideas skill. Read your instructions from apps/notes/skills/syner-find-ideas/SKILL.md.

Assume you read the user's vault and found:
- Frustration about manual PR reviews taking too long
- Note about how LLMs could help with code review
- Membership in a developer community of 500 people

Generate ONE idea based on this.
```

### Expected Output

```markdown
### [Idea Name]

**What:** One-line description

**Origin:** Which notes/insights led here

**Why You:** Your unfair advantage for this

**First Step:** Smallest possible validation

**Risk:** Main assumption to test
```

### Red Flags (FAIL if present)

- Generic idea not traced to specific notes
- Missing any of the 5 fields
- "Areas to explore" instead of concrete idea
- No unfair advantage articulated

---

## Test 5: syner-find-links

### Prompt

```
You are the syner-find-links skill. Read your instructions from apps/notes/skills/syner-find-links/SKILL.md.

The user says: "/syner-find-links"

What do you do?
```

### Expected Output

Asks for two domains:
> "Which two domains/topics do you want me to connect?"

Does NOT proceed without two domains.

### Red Flags (FAIL if present)

- Tries to guess domains
- Proceeds without asking
- Loads everything to "find any connections"

---

## Test 6: syner-grow-note

### Prompt

```
You are the syner-grow-note skill. Read your instructions from apps/notes/skills/syner-grow-note/SKILL.md.

The user wants to graduate this raw thought:

"async communication is better than meetings. less interruption. people can think. but loses nuance. maybe hybrid? need to figure out when sync matters."

Show your output.
```

### Expected Output

```markdown
## Graduated: [title]

**Source:** [the raw thought]
**Format:** [article/plan/reference/decision]

---

[A structured document that sounds like the user, not a template]

---

**Gaps:** [what's missing]
**Suggested Path:** [where to save]
**Next Steps:** [how to finalize]
```

### Red Flags (FAIL if present)

- Auto-saves without asking (violates Suggest, Don't Enforce)
- Output sounds like corporate template, not user's voice
- Missing Gaps/Suggested Path/Next Steps
- Doesn't preserve the user's informal tone

---

## Test 7: syner-track-idea — Proactive Mode

### Prompt

```
You are the syner-track-idea skill. Read your instructions from apps/notes/skills/syner-track-idea/SKILL.md.

User runs: /syner-track-idea (no arguments)

The user has been writing in Spanish throughout the conversation.

Assume you found:
- building-in-public.md: 8 commits across 4 months, last edit 45 days ago
- pricing-thoughts.md: 3 commits, last edit 2 days ago

Show your output.
```

### Expected Output

Output adapts to user's language (Spanish in this case):

```markdown
## Ideas con evolución significativa

1. **building-in-public.md** — 8 commits en 4 meses, última edición hace 45 días
   → [Insight de una línea sobre por qué evolucionó]

¿Quieres que trace alguna? Responde con el nombre.
```

Or in English if user writes in English:

```markdown
## Ideas Worth Revisiting

1. **building-in-public.md** — 8 commits across 4 months, last edit 45 days ago
   → [One-line insight about why this evolved]

Want me to trace any of these? Reply with the name.
```

Note: pricing-thoughts.md might not qualify (only 3 commits, very recent — not dormant).

### Red Flags (FAIL if present)

- Includes files that don't meet criteria
- Ignores user's language (responds in different language than conversation)
- Missing commit evidence
- Doesn't offer to trace

---

## Test 8: Voice Check

### Prompt

```
You are the Notes agent. The user asks: "do we have any notes about authentication?"

You found one note with basic OAuth flow documentation.

Respond in 2-3 sentences.
```

### Expected Output

Direct, informative, no hedging:

> "Found one note on authentication. vaults/dev/auth/oauth-flow.md covers basic OAuth implementation. No notes on refresh tokens or session management."

### Red Flags (FAIL if present)

- "I found some potentially relevant information..."
- "There might be something about..."
- "I believe there could be..."
- Over-explaining what you're about to do

---

## Language Policy

Per `agents/syner.md`, output adapts to user's language:

| Context | Language |
|---------|----------|
| Skill instructions | English |
| Agent definitions | English |
| Code and comments | English |
| Output to user | Match user's language |
| Reports and PRs | English (unless user specifies) |

Tests should validate language adaptation, not enforce a single language.

---

## Scoring

| Test | Pass Criteria |
|------|---------------|
| 1. Ambiguous Query | Correct format + voice |
| 2. No Context | Correct format + helpful gaps |
| 3. Load All | Self-check + correct structure |
| 4. Find Ideas | All 5 fields + traced to notes |
| 5. Find Links | Asks for domains |
| 6. Grow Note | Preserves voice + suggests don't enforce |
| 7. Track Idea | Criteria-based + language adaptation + offers trace |
| 8. Voice | Direct, no hedging |

**Pass:** 8/8 or 7/8 with minor issues
**Needs Work:** 5-6/8
**Fail:** <5/8

---

## Quick Prompts

### Format Check
```
You are Notes. Answer: "What's the status of project X?" (assume you found one note about it)
```

### No Context Check
```
You are Notes. Answer: "What's our pricing?" (assume nothing found)
```

### Voice Check
```
You are Notes. Answer: "Any notes on auth?" in 2 sentences.
```

### Boundary Check
```
You are syner-load-all. Should you run for: "what color is the sky?"
```

---

## How to Run

1. Start a new session
2. Give one test prompt at a time
3. Compare output against Expected Output
4. Check for Red Flags
5. Score each test
6. Report results
