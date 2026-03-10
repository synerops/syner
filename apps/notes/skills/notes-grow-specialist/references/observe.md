# observe — Log a PKM friction

Record when your notes/ideas system failed you.

## When to Use

- You couldn't find a note you know exists
- Capture was awkward or lost
- Connections were missed
- Synthesis failed despite having the pieces
- Processing backlog is overwhelming

**Don't filter.** If it felt like friction, observe it.

## Input

```bash
/notes-grow-specialist observe
/notes-grow-specialist observe --type retrieval
/notes-grow-specialist observe --type capture --context "voice memo while driving"
```

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--type` | Friction type (retrieval, capture, linking, synthesis, processing, vocabulary) | Prompted |
| `--context` | Additional context | None |

## Process

### 1. Gather Information

If not provided via flags, prompt for:

```
What happened? (the friction)
Type: [retrieval/capture/linking/synthesis/processing/vocabulary]
Context: (when/where/what you were doing)
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

Location: `.syner/ops/notes-grow-specialist/observations.md`

Create file if it doesn't exist with header:

```markdown
# PKM Friction Observations

Raw observations of when the notes/ideas system failed.
These will be reviewed for patterns → proposals → specialists.

---

```

### 4. Output Confirmation

```
Observed: [type] friction
  "[brief description]"

Total observations: [N]
  - retrieval: [n]
  - capture: [n]
  - linking: [n]
  - synthesis: [n]
  - processing: [n]
  - vocabulary: [n]

Run `/notes-grow-specialist review` when you have 3+ of a type.
```

## Friction Types Reference

| Type | Signals | Example |
|------|---------|---------|
| `retrieval` | "I know I wrote...", "Can't find...", "Search failed" | Searched "async" but note was titled "distributed work" |
| `capture` | "Lost the idea", "Awkward to capture", "No good place" | Had insight while walking, phone was awkward |
| `linking` | "Should be connected", "Missed the relationship" | Project note and meeting note were related but not linked |
| `synthesis` | "Had all pieces", "Couldn't see pattern" | Three notes about same topic, never combined |
| `processing` | "Never processed", "Inbox overflow" | Voice memos from last month still unprocessed |
| `vocabulary` | "Different words", "Inconsistent naming" | "PKM" in one vault, "note-taking" in another |

## Examples

### Retrieval Friction

```
/notes-grow-specialist observe --type retrieval

Friction: Couldn't find my notes about async team communication
Context: Preparing for meeting, searched "async", "communication", "remote"
Would have helped: Knowing I use "distributed work" in some contexts
```

### Capture Friction

```
/notes-grow-specialist observe --type capture

Friction: Had idea about skill architecture while showering
Context: No capture device, tried to remember, lost nuance
Would have helped: Voice capture that works offline
```

### Linking Friction

```
/notes-grow-specialist observe --type linking

Friction: Realized two projects had the same blocker, notes weren't linked
Context: Working on project B, remembered project A had same issue
Would have helped: Automatic detection of similar blockers
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
  - retrieval: [n]
  - capture: [n]
  - linking: [n]
  - synthesis: [n]
  - processing: [n]
  - vocabulary: [n]

[If type has 3+:]
Pattern detected in [type]. Run `/notes-grow-specialist review` to analyze.
```
