# observe — Log a bot friction

Record when your lead bot failed or underperformed.

## When to Use

- Conversation hit a dead end
- Response tone was wrong
- Integration failed or lost context
- Handoff went to wrong person/system
- Lead context was missing
- Qualification was incorrect

**Don't filter.** If it felt like friction, observe it.

## Input

```bash
/bot-grow-specialist observe
/bot-grow-specialist observe --type conversation
/bot-grow-specialist observe --type response --context "pricing inquiry"
```

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--type` | Friction type (conversation, response, integration, handoff, context, qualification) | Prompted |
| `--context` | Additional context | None |

## Process

### 1. Gather Information

If not provided via flags, prompt for:

```
What happened? (the friction)
Type: [conversation/response/integration/handoff/context/qualification]
Context: (when/where/what lead was doing)
What would have helped? (optional - your intuition)
```

### 2. Create Entry

Format:

```markdown
## [Date] - [Type]

**Friction:** [What happened]
**Context:** [When/where/what]
**Would have helped:** [Your intuition, if any]

---
```

### 3. Append to Observations

Location: `.syner/ops/bot-grow-specialist/observations.md`

Create file if it doesn't exist with header:

```markdown
# Bot Friction Observations

Raw observations of when the lead bot failed or underperformed.
These will be reviewed for patterns → proposals → specialists.

---

```

### 4. Output Confirmation

```
Observed: [type] friction
  "[brief description]"

Total observations: [N]
  - conversation: [n]
  - response: [n]
  - integration: [n]
  - handoff: [n]
  - context: [n]
  - qualification: [n]

Run `/bot-grow-specialist review` when you have 3+ of a type.
```

## Friction Types Reference

| Type | Signals | Example |
|------|---------|---------|
| `conversation` | "Couldn't continue", "Dead end", "Loop" | Lead asked follow-up, bot repeated same response |
| `response` | "Wrong tone", "Missed intent", "Too generic" | Casual lead got formal corporate response |
| `integration` | "Sync failed", "Lost data", "API error" | CRM didn't update, lost lead's company info |
| `handoff` | "Wrong person", "Too late", "Too early" | Should have escalated to sales, stayed with bot |
| `context` | "Forgot", "Missing info", "No history" | Didn't remember lead's name from 5 minutes ago |
| `qualification` | "Wrong score", "Missed signals", "Bad routing" | Hot lead marked as cold, went to nurture track |

## Examples

### Conversation Friction

```
/bot-grow-specialist observe --type conversation

Friction: Lead asked about enterprise pricing, bot gave SMB response, lead left
Context: Lead had mentioned "our team of 500" earlier in conversation
Would have helped: Recognizing enterprise signals and adjusting flow
```

### Response Friction

```
/bot-grow-specialist observe --type response

Friction: Lead was frustrated, bot kept being cheerful
Context: Lead had complained about previous support experience
Would have helped: Detecting negative sentiment, adjusting tone
```

### Handoff Friction

```
/bot-grow-specialist observe --type handoff

Friction: Lead asked for human, took 3 more bot responses before escalation
Context: Lead explicitly typed "talk to a person"
Would have helped: Immediate recognition of handoff signals
```

## Edge Cases

**Unsure of type:**
→ Use your best guess. Review will reclassify if needed.

**Multiple types in one friction:**
→ Log the primary friction. Note others in context.

**Very minor friction:**
→ Log it anyway. Patterns emerge from small things.

**Same friction as before:**
→ Log it again. Repetition is signal.

## Output Template

```
Observed: [type] friction
  "[first 50 chars of friction]..."

Total observations: [N]
  - conversation: [n]
  - response: [n]
  - integration: [n]
  - handoff: [n]
  - context: [n]
  - qualification: [n]

[If type has 3+:]
Pattern detected in [type]. Run `/bot-grow-specialist review` to analyze.
```
