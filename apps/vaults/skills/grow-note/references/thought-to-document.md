# Thought → Document (Graduate Mode)

Convert raw, scattered thoughts into polished documents that can be shared or acted upon.

## When This Mode Activates

- User provides a phrase/topic without `.md` extension
- User provides a daily note or rough draft
- Density analysis shows low conceptual density (single core idea)

## Process

### 1. Discover Source Material

Search pattern:
```
.syner/vaults/**/*.md
```

Look for mentions of the topic/phrase. Read `index.md` first for context.

### 2. Analyze Raw Material

Extract:
- **Core insight or thesis** — What's the main point?
- **Supporting observations** — What evidence or examples exist?
- **Related notes** — What else connects? (use internal links)
- **Gaps** — What's missing for completion?

### 3. Determine Output Format

| Format | When |
|--------|------|
| **Article** | Shareable insight for others (external audience) |
| **Plan** | Actionable project with steps and milestones |
| **Reference** | Reusable knowledge for future self |
| **Decision Doc** | Choice to be made with options analyzed |

User can force format with `--format` flag.

### 4. Draft the Document

Structure based on format chosen:

**Article:**
```markdown
# [Title]

[Hook/intro]

## Context
[Why this matters]

## Core Insight
[The main point]

## Evidence/Examples
[Supporting material]

## Implications
[What this means]

## Related
- [[internal-note]]
- [External link](https://...)
```

**Plan:**
```markdown
# [Project Name]

## Goal
[What we're trying to achieve]

## Why Now
[Context/trigger]

## Milestones
1. [Phase 1]
2. [Phase 2]
3. [Phase 3]

## Open Questions
[Uncertainties to resolve]

## Resources
[Links, people, tools needed]
```

**Reference:**
```markdown
# [Topic]

## Quick Summary
[TL;DR for future self]

## Details
[The meat - organized by subtopic]

## Usage
[When/how to apply this]

## Examples
[Concrete instances]

## Related
[Links to other references]
```

**Decision Doc:**
```markdown
# [Decision Title]

## Context
[Why we're deciding]

## Options

### Option A: [Name]
**Pros:**
- [Advantage 1]
- [Advantage 2]

**Cons:**
- [Downside 1]
- [Downside 2]

### Option B: [Name]
[Same structure]

## Recommendation
[What I'd choose and why]

## Open Questions
[What we still don't know]
```

### 5. Suggest Placement

Based on content type and app context:
- Articles → `articles/[topic].md`
- Plans → `projects/[name].md` or `plans/[name].md`
- References → `references/[topic].md`
- Decisions → `decisions/[yyyy-mm-dd]-[title].md`

Respect existing vault structure if one exists.

## Output Template

```markdown
## Graduated: [title]

**Source:** [original note/thought]
**Format:** [article/plan/reference/decision]
**Suggested Path:** [where to save it]

---

[The complete drafted document]

---

**Gaps:** [what's missing for completion]
**Next Steps:** [how to finalize - e.g., "Review and save to suggested path"]
```

## Quality Checks

Before outputting:

- [ ] Document sounds like the user's voice, not a template
- [ ] Internal links use `[[note-name]]` syntax
- [ ] External links are contextual, not decorative
- [ ] Structure fits the format chosen
- [ ] Gaps are honest (don't claim completion if uncertain)

## Boundaries

- **Suggest, Don't Enforce:** Propose path and format, user decides
- **Preserve Voice:** Don't sanitize the user's style
- **Concrete Output:** Deliver a draft, not "here's what it might contain"
- **Verify Sources:** If source material doesn't exist, ask for clarification
