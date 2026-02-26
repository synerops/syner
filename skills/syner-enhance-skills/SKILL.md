---
name: syner-enhance-skills
description: Improve existing skills by applying best practices. Use when you want to audit and upgrade a skill's instructions for clarity, tool usage specificity, and robustness. Triggers on "improve this skill", "enhance skill", "audit skill", "make skill better", or when reviewing skills for quality.
metadata:
  author: syner
  version: "0.2.0"
---

# Enhance Skill

Systematically improve existing skills by identifying gaps and applying proven patterns.

## Process

1. **Locate** the target skill
2. **Read** the SKILL.md completely
3. **Score** against the checklist below
4. **Apply** fixes for items that fail
5. **Verify** by reading the enhanced skill back

## How to Locate Skills

1. Use `Glob` with pattern `skills/**/SKILL.md` to find project skills
2. Use `Glob` with pattern `.claude/skills/**/SKILL.md` to find user skills
3. If skill name provided, match against the `name:` field in frontmatter

If no skill specified, list available skills and ask user to choose.

## Enhancement Checklist

### 1. Tool Usage Specificity

**Problem**: "read files" without specifying how.

**Fix**: Name tools explicitly:
```markdown
1. Use `Glob` tool with pattern `path/**/*.md` to discover files
2. Use `Read` tool to load contents
```

### 2. Path Resolution

**Problem**: Relative paths assume current directory.

**Fix**: Anchor to project root:
```markdown
1. Find project root (directory containing `apps/` or `package.json`)
2. Use `Glob` from project root: `apps/notes/**/*.md`
```

### 3. Context File Convention

**Problem**: Skills don't leverage folder-level context.

**Fix**: Check for index files:
```markdown
For each folder, read `index.md` first if it exists.
```

### 4. Input Validation

**Problem**: Skills assume input is always provided.

**Fix**: Add fallback that matches skill design:
- If input is **required** with no default: Use `AskUserQuestion` to prompt
- If input is **optional** with clear default behavior: Document the default, don't ask

**Anti-pattern**: Adding AskUserQuestion when the skill already has intuitive default behavior (e.g., `/skill` without args = run in default mode).

### 5. Output Structure

**Problem**: Output format described but not enforced.

**Fix**: Use explicit template with ALWAYS:
```markdown
ALWAYS use this structure:
- **Section A**: [content]
```

### 6. Skill References

**Problem**: References to other skills use relative paths.

**Fix**: Use skill name or absolute pattern:
```markdown
Execute `/state` skill (found via `Glob` pattern `skills/state/SKILL.md`)
```

### 7. Frontmatter Completeness

**Problem**: Missing modern frontmatter options for complex skills.

**Fix**: Verify skill has appropriate options:
- `context: fork` - If skill loads heavy context or runs multi-step operations
- `skills: [deps]` - Preload required skill dependencies
- `agent: type` - Specify agent type when delegating execution
- `allowed-tools: [patterns]` - (Future) For autonomous execution

Example:
```yaml
context: fork
agent: general-purpose
skills:
  - state
```

### 8. Philosophy Alignment

**Problem**: Skill violates syner principles from PHILOSOPHY.md.

**Fix**: Check against core principles:
- **Suggest, don't enforce** - Skills should offer options, not dictate
- **Context, not data extraction** - Read notes for understanding, don't parse structured data
- **Ask when unsure** - Use AskUserQuestion instead of assuming
- **Fork context when needed** - Isolate complex operations

### 9. Boilerplate Deduplication

**Problem**: Skill copy-pastes common patterns (e.g., "How to Read Notes" block).

**Fix**: Reference conventions instead of duplicating:
```markdown
Follow note conventions from `apps/notes/content/index.md`:
- Read `index.md` first in each folder for context
- Use internal links, external docs (llms.txt), skill references (/skill-name)
```

**Known duplications** (22 lines repeated in 5 skills):
- state, ideas, connect, graduate, trace

### 10. Worker Delegation

**Problem**: Skill handles complex multi-step execution inline instead of delegating.

**Fix**: For skills requiring multiple file changes or verification loops:
```markdown
Delegate execution to syner-worker:

Task(subagent_type=syner-worker, prompt="
  Task: [What to accomplish]
  Context: [From notes]
  Success: [How to verify]
")
```

**When to delegate:**
- Multiple file changes with verification
- Iterative refinement (code → review → fix)
- Action → Verify → Repeat loops

### 11. Simplicity Principle

**Problem**: Skill over-specifies complex implementations when simpler alternatives exist.

**Fix**: Prefer simpler approaches:
- **Ordered criteria** > scoring formulas with weights
- **Current state checks** > historical comparisons (git diff across time)
- **LLM judgment within guidelines** > rigid mathematical rules

**Anti-pattern**: Suggesting git version comparisons to detect "growing connections" when counting current links achieves the same goal more simply.

## Output Format

ALWAYS report:

- **Skill**: `[name]`
- **Issues**: [list of failed checklist items]
- **Changes**: [summary of fixes applied]
