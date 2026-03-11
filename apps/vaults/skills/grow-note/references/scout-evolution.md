# Scout Evolution (Discover Mode)

Proactively scan vaults to discover documents ready to evolve - either from thought to document, or from document to structure.

## When This Mode Activates

- User provides `--scan` flag
- User asks to "find evolution opportunities"
- No specific file provided, just area/vault

## What It Looks For

### Evolution Type A: Thought → Document
**Signal:** Raw notes ready to graduate

- Daily notes with recurring themes (3+ mentions)
- Rough drafts with "TODO: expand this" markers
- Fragmented ideas spread across multiple notes
- Notes with high outbound link density (connecting to many topics)

### Evolution Type B: Document → Structure
**Signal:** Dense documents ready to fragment

- Files > 200 lines with 3+ distinct sections
- Multiple variants/examples of same concept
- Natural H2 boundaries that could be files
- Competing concepts in single namespace

## Process

### 1. Discover Scope

If path provided:
```bash
Glob [provided-path]/**/*.md
```

If no path (full scan):
```bash
Glob .syner/vaults/**/*.md
```

Always read `index.md` files first for context.

### 2. Analyze Each File

For each `.md` file found:

**Quick metrics:**
- Line count
- Number of H2 sections
- Conceptual boundaries (how many distinct ideas?)
- Link density (internal/external)
- Last modified date (is it active?)

**Density scoring:**
```
Low:    1-2 concepts, < 150 lines, cohesive flow
Medium: 2-3 concepts, 150-250 lines, some boundaries
High:   3+ concepts, > 200 lines, clear subsections
```

### 3. Categorize Opportunities

Group findings by priority:

**🎯 High Priority:**
- High density documents ready to fragment
- Daily notes with mature recurring themes
- Drafts explicitly marked for expansion

**⚡ Medium Priority:**
- Medium density approaching fragmentation threshold
- Notes with potential but need validation

**✅ Already Well-Structured:**
- Files in good shape, no action needed
- Recently evolved (show as examples of good structure)

### 4. Generate Proposals

For each high-priority opportunity, include:

- **File path**
- **Reason** for evolution (what signals triggered it)
- **Proposed structure** (folder tree or document type)
- **Effort estimate** (quick/medium/deep work)

## Output Template

```markdown
## Evolution Opportunities: [scan-scope]

**Scanned:** X files across Y vaults
**Updated:** [timestamp]

---

### 🎯 High Priority

#### [filename.md] → `[foldername]/`
**Type:** Document → Structure
**Reason:** 5 distinct components competing, 340 lines
**Proposed:**
```
[foldername]/
  ├── README.md
  ├── concept-1.md
  ├── concept-2.md
  └── concept-3.md
```
**Effort:** 30 min

#### Daily themes: "async communication"
**Type:** Thought → Document
**Reason:** Mentioned in 6 daily notes (2024-02-15 to 2024-03-01)
**Proposed:** Article in `articles/async-communication.md`
**Effort:** 45 min

---

### ⚡ Medium Priority

#### [another-file.md]
**Reason:** 2 main concepts, 180 lines, approaching threshold
**Action:** Monitor - may evolve soon

---

### ✅ Already Well-Structured

- `components/` — Good fragmentation (evolved 2024-03-08)
- `branding/colors.md` — Single concern, concise
- `references/tools.md` — Clean reference doc

---

**Next Steps:**
Pick an opportunity and run:
- `/grow-note [filename.md]` (for transform)
- `/grow-note "[topic]"` (for graduate)
```

## Scanning Strategies

### Targeted Scan (Recommended)
```bash
/grow-note --scan .syner/vaults/design
```
Focus on specific app/vault for relevant results.

### Full Vault Scan
```bash
/grow-note --scan
```
Comprehensive but may be overwhelming. Best for periodic audits.

### Smart Filters

Only surface opportunities where:
- File has been modified in last 60 days (active content)
- File size > 100 lines (substantial enough)
- Not already in a well-structured folder
- Not auto-generated (e.g., not `CHANGELOG.md`)

## Real-World Patterns

### Pattern 1: Component Proliferation
```
components.md (350 lines)
→ 5 distinct components with variants
→ Recommend: components/ folder with 5 files
```

### Pattern 2: Recurring Daily Theme
```
daily/2024-03-01.md: "thought about developer tools"
daily/2024-03-05.md: "more on developer tools - automation"
daily/2024-03-08.md: "dev tools insight - reduce context switching"
→ Recommend: Article on developer tool philosophy
```

### Pattern 3: Variant Explosion
```
card.md:
  - FeatureCard variant
  - Standard card variant
  - Minimal card variant
  - Hero card variant
→ Recommend: card/ folder with variant files
```

## Boundaries

- **Don't Scan Everything:** Respect `.gitignore` patterns
- **Respect Privacy:** Skip folders starting with `_` (private convention)
- **No Auto-Execute:** Only propose, never auto-fragment
- **Context Matters:** A 300-line file might be perfect if cohesive

## Quality Checks

Before proposing evolution:

- [ ] Each opportunity has clear justification
- [ ] Proposed structures make conceptual sense
- [ ] Priority ranking is defensible
- [ ] Already well-structured examples show good judgment
- [ ] Effort estimates are realistic

## Output Modes

**Summary mode (default):**
Show high-priority items only with brief proposals.

**Detailed mode (`--verbose`):**
Include medium-priority and full analysis for each.

**Stats mode (`--stats`):**
Just the numbers - how many files, avg size, density distribution.
