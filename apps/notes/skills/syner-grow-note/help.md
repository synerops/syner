# syner-grow-note --help

Promote thoughts into documents, documents into structures, and discover evolution opportunities.

## Usage

```bash
/syner-grow-note [target] [options]
```

## Modes

### 1. Thought → Document (Graduate)
Transform scattered thoughts into structured documents.

```bash
/syner-grow-note "my thoughts on async communication"
/syner-grow-note daily/2024-03-09.md
```

**Output:** Polished article, plan, reference, or decision doc

---

### 2. Document → Structure (Transform)
Fragment a dense document into organized folder structure.

```bash
/syner-grow-note apps/design/vaults/syner/components.md
```

**Output:** Proposed folder structure with fragmentation plan

---

### 3. Scout Evolution (Discover)
Scan vaults for documents ready to evolve.

```bash
/syner-grow-note --scan
/syner-grow-note --scan apps/design/vaults
```

**Output:** List of evolution opportunities with priority

---

## Options

| Flag | Description |
|------|-------------|
| `--scan` | Scout mode - find evolution opportunities |
| `--format <type>` | Force output format (article/plan/reference/decision) |
| `--path <location>` | Suggest specific output path |

## Examples

```bash
# Graduate a thought
/syner-grow-note "that idea about developer tools"

# Transform a dense doc
/syner-grow-note apps/design/vaults/syner/components.md

# Scout for opportunities
/syner-grow-note --scan apps/design/vaults

# Graduate with specific format
/syner-grow-note "async notes" --format article
```

## Output Formats

### Graduate Mode
```markdown
## Graduated: [title]
**Source:** [original note]
**Format:** [type]
**Suggested Path:** [location]

[Drafted document]

**Gaps:** [missing pieces]
**Next Steps:** [how to finalize]
```

### Transform Mode
```markdown
## Evolution Detected: [file]
**Density:** [High/Medium/Low]
**Recommendation:** Fragment into folder

[Proposed structure + fragment plan]

**Next Steps:** Confirm and I'll generate files
```

### Scout Mode
```markdown
## Evolution Opportunities

### 🎯 High Priority
[Files ready to evolve]

### ✅ Already Well-Structured
[Files in good shape]
```

## How It Decides

1. **Has `--scan`?** → Scout mode
2. **Is a .md file?** → Analyze density
   - High density → Transform mode
   - Low density → Graduate mode
3. **Is a phrase/topic?** → Search vaults → Graduate mode

## Philosophy

Growth isn't always "make it bigger." Sometimes it's:
- **Graduate** — Rough → Polished
- **Fragment** — Dense → Breathable
- **Discover** — Hidden → Visible

This skill does all three.

---

**See also:** `/syner-track-idea`, `/syner-find-links`, `/syner-find-ideas`
