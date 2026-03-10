# Audit Mode

**Level:** All levels
**Threshold:** N/A (analysis/cleanup)

## Purpose

Detect redundancy, overlap, and deprecated specialists across all levels. Keep the specialist ecosystem clean and efficient.

## When to Audit

- Monthly/quarterly maintenance
- Before graduating new specialist (check for overlap)
- When specialist count grows large (>10 total)
- When suspecting redundancy

## Process

### 1. Load All Specialists

**Read all levels:**
```
L0: apps/design/vaults/syner/specialists/_observations.md
L1: apps/design/vaults/syner/specialists/_proposals/*.md
L2: apps/design/agents/specialists/*.md
L3: apps/design/agents/*.md (subagents)
```

**Read generics:**
```
~/.claude/agents/agency-design-*.md
~/.claude/agents/agency-xr-*.md
```

### 2. Detect Overlap

**Algorithm:**

For each pair of specialists (proposals, customs, subagents):
```
Extract scope/decisions from each
Calculate overlap:
  - Keyword similarity in scope
  - Component overlap (affect same files?)
  - Decision overlap (make same choices?)

If overlap >70% → Flag for review
```

**Example:**
```
design-system-evolution (L2)
  Scope: "Decides when to extend @syner/ui vs custom components"
  Components: card, header, button

component-consistency (L1)
  Scope: "Ensures components follow design system patterns"
  Components: card, header, button

Overlap: 85% → Consolidation candidate
```

### 3. Detect Unused Generics

**For each generic:**
```
Check tracking data:
  - Ever consulted in this project? NO → Mark deprecated
  - Replaced by custom? YES → Mark deprecated
  - Still used alongside custom? BOTH → Flag for migration plan
```

**Example:**
```
agency-design-ux-architect
  Consulted in project: 0 times
  Replaced by: design-system-evolution (custom)
  Status: DEPRECATED for apps/design
```

### 4. Detect Stale Proposals

**For each proposal (L1):**
```
Check:
  - Last consultation > 60 days ago? → Stale
  - Last refinement > 60 days ago? → Stale
  - Consultations = 0 after 30 days? → Likely not needed

If stale → Suggest archive or delete
```

### 5. Detect Underused Specialists

**For each custom specialist (L2):**
```
Check:
  - Components affected < 3? → Underused
  - Last used > 90 days ago? → Potentially obsolete
  - Consultations declining over time? → Losing relevance

If underused → Suggest demote to proposal or archive
```

### 6. Generate Consolidation Plan

**For overlapping specialists:**

```markdown
## Consolidation Recommendation

### Case 1: Merge Proposals
**Overlap:** design-system-evolution + component-consistency (85%)

**Proposal:** Merge into "design-system-evolution"
- Broader scope: Covers both extension + consistency
- Combines tracking data: 7 + 3 = 10 consultations
- Migration: Update references in tracking

**Action:**
1. Merge content from component-consistency into design-system-evolution
2. Archive component-consistency proposal
3. Update tracking to reflect consolidation
```

### 7. Generate Deprecation List

```markdown
## Deprecated Generics (for apps/design)

### agency-design-ux-architect
- **Replaced by:** design-system-evolution (L2)
- **Reason:** Custom covers same scope + project context
- **Evidence:** 0 consultations in project, custom has 10
- **Date:** YYYY-MM-DD

### agency-design-ui-designer
- **Status:** Active alongside design-system-evolution
- **Reason:** Still used for pure visual decisions (no system impact)
- **Migration plan:** None needed (different scopes)
```

### 8. Update Tracking

Add audit section:

```markdown
## Audit History

### YYYY-MM-DD
- Detected 2 overlapping proposals → consolidated
- Marked 3 generics as deprecated
- Archived 1 stale proposal
- Recommendations: [list]
```

## Output Template

```markdown
## Audit Complete 🔍

**Analyzed:**
- Proposals (L1): [count]
- Custom Specialists (L2): [count]
- Subagents (L3): [count]
- Generics: 71

### Overlap Detected

⚠️ **[Name 1] + [Name 2]**
- Overlap: [X]%
- Components: [shared list]
- Recommendation: [Merge/Keep separate/Clarify boundaries]

### Deprecated Generics

❌ **[Generic name]**
- Replaced by: [Custom name]
- Consultations: 0
- Action: Mark deprecated

### Stale Proposals

⏰ **[Proposal name]**
- Last used: [X] days ago
- Consultations: [count]
- Recommendation: [Archive/Demote/Keep]

### Consolidation Plan

**If accepted, run:**
```bash
/design-grow-specialist consolidate [name1] [name2]
```

### Summary

- ✅ Healthy specialists: [count]
- ⚠️ Overlapping: [count]
- ❌ Deprecated: [count]
- ⏰ Stale: [count]
```

## Flags

**`--mark-deprecated`**
Automatically mark generics as deprecated (update tracking).

**`--archive-stale`**
Auto-archive proposals unused for >60 days.

**`--threshold [N]`**
Change overlap threshold (default 70%).

```bash
/design-grow-specialist audit --threshold 80
```

**`--verbose`**
Show detailed overlap analysis for each pair.

## Edge Cases

**Two specialists with similar scope but different usage:**
- E.g., one for components, one for pages
- Overlap in keywords but not in practice
- Don't consolidate, clarify boundaries instead

**Generic still occasionally useful:**
- Not fully deprecated
- Mark as "secondary" or "fallback"
- Custom is primary, generic is edge cases

**Specialist seems stale but is actually seasonal:**
- E.g., only used during major design refreshes
- Don't archive, just note in tracking
- "Seasonal: used during design system updates"

## Context Loading

Full:
- Read all specialist files (all levels)
- Read all generics
- Read full tracking data
- Don't load full codebase (use tracking references)

## Validation

Audit recommendations should:
- [ ] Cite specific overlap percentages
- [ ] Provide consolidation plan (not just "merge these")
- [ ] Identify migration path for users
- [ ] Preserve valuable content (don't lose work)

## Philosophy

**Specialist bloat is real.** Without maintenance, you'll accumulate redundant specialists.

**Audit is cleanup, not judgment.** Specialists that didn't work out aren't failures — they're experiments.

**Deprecation !== deletion.** Archive, don't delete. Patterns might re-emerge later.

## Meta

**This is the "health check" for the specialist ecosystem.**

Run periodically to keep the system lean and effective. Like code, specialists need refactoring.
