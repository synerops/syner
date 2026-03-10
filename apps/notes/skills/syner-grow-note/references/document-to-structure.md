# Document → Structure (Transform Mode)

Detect when a single `.md` file has grown dense enough to deserve fragmentation into a folder structure.

## When This Mode Activates

- User provides a path to a `.md` file
- Density analysis shows **high conceptual density**:
  - Multiple distinct concepts competing for attention
  - Natural subsections emerging (3+ major sections)
  - Each section could stand alone as documentation

## Conceptual Density Signals

### High Density (Fragment Recommended)
- 3+ distinct concepts with their own subsections
- Sections exceed 50-100 lines each
- Multiple "how to use" patterns or variants
- Different audiences for different sections
- File length > 200 lines with clear boundaries

### Medium Density (Monitor)
- 2 main concepts, closely related
- Sections are balanced but not overwhelming
- Could evolve soon but not urgent

### Low Density (Keep as Single File)
- Single cohesive concept
- Sections support one main idea
- Comfortable reading length (< 150 lines)
- Natural flow from start to finish

## Process

### 1. Read and Analyze

```bash
Read [file.md]
```

Identify:
- **Main sections** — What are the distinct concepts?
- **Natural boundaries** — Where would you naturally split?
- **Shared context** — What belongs in a README/index?
- **Hierarchy** — Are there parent-child relationships?

### 2. Propose Structure

Based on content, suggest folder organization:

**Example (Real: components.md → components/):**
```
components/
  ├── README.md          # Philosophy + index table
  ├── card.md            # FeatureCard + Standard Card variants
  ├── button.md          # Button specifications
  ├── badge.md           # Badge specifications
  └── input.md           # Input specifications
```

**Naming conventions:**
- Folder name = original file stem (`components.md` → `components/`)
- README.md = overview + navigation
- Fragment files = concept names (lowercase, hyphenated)

### 3. Create Fragment Plan

Map original sections to new files:

```markdown
### Fragment Plan

**README.md** ← Sections:
- Philosophy (lines 1-20)
- Component index table (lines 21-35)
- General usage notes (lines 36-50)

**card.md** ← Sections:
- FeatureCard variant (lines 51-120)
- Standard Card variant (lines 121-180)
- Card examples (lines 181-220)

**button.md** ← Sections:
- Button variants (lines 221-280)
- Button states (lines 281-320)
```

### 4. Preserve Relationships

- **Cross-links:** Update internal references to new paths
- **Hierarchy:** Maintain conceptual parent-child relationships
- **Context:** README gets the "why" and overview
- **Navigation:** README includes index/table linking to fragments

### 5. Quality Check

Before proposing:

- [ ] Each fragment has a clear, single focus
- [ ] README provides map/navigation
- [ ] No orphaned content (everything has a home)
- [ ] Fragment names are descriptive and consistent
- [ ] Original file's purpose is preserved at folder level

## Output Template

```markdown
## Evolution Detected: [filename]

**Density:** High (X concepts competing)
**Recommendation:** Fragment into folder structure

### Current Structure
```
[Current file with line count]
```

### Proposed Structure
```
[Folder tree visualization]
```

### Fragment Plan

**README.md** ← Content:
- [List what goes here]

**[fragment-1].md** ← Content:
- [List what goes here]

**[fragment-2].md** ← Content:
- [List what goes here]

---

**Preserves:**
- Original hierarchy and relationships
- Cross-links (updated to new paths)
- Context and philosophy

**Creates:**
- Navigation via README index
- Breathing room for each concept
- Findability and focus

**Next Steps:** Confirm structure and I'll generate all files with content
```

## Execution Mode

If user confirms, generate all files:

1. **Create folder** at original file location
2. **Generate README.md** with overview + index
3. **Generate fragments** with extracted content
4. **Update cross-links** to reflect new paths
5. **Preserve original** as `[filename].md.bak` (don't delete)

## Boundaries

- **Suggest, Don't Execute:** Always propose before generating
- **Preserve Content:** No loss of information during fragmentation
- **Respect Hierarchy:** Folder structure should feel natural
- **Maintain Voice:** Don't rewrite during fragmentation, just reorganize

## Real-World Example

**Before:** `components.md` (350 lines, 5 component specs)

**After:**
```
components/
  ├── README.md (50 lines - philosophy + index)
  ├── card.md (80 lines - card variants only)
  ├── button.md (60 lines - button specs only)
  ├── badge.md (50 lines - badge specs only)
  └── input.md (70 lines - input specs only)
```

**Result:** Each file breathes. README navigates. Concepts are findable.
