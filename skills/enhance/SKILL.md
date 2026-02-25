---
name: enhance
description: Improve existing skills by applying best practices. Use when you want to audit and upgrade a skill's instructions for clarity, tool usage specificity, and robustness. Triggers on "improve this skill", "enhance skill", "audit skill", "make skill better", or when reviewing skills for quality.
metadata:
  author: syner
  version: "1.1"
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

**Fix**: Add fallback:
```markdown
If [input] not provided:
1. Use `Glob` to suggest recent options, OR
2. Use `AskUserQuestion` to prompt
```

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

## Output Format

ALWAYS report:

- **Skill**: `[name]`
- **Issues**: [list of failed checklist items]
- **Changes**: [summary of fixes applied]
