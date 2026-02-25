---
name: enhance
description: Improve existing skills by applying best practices. Use when you want to audit and upgrade a skill's instructions for clarity, tool usage specificity, and robustness. Triggers on "improve this skill", "enhance skill", "audit skill", "make skill better", or when reviewing skills for quality.
metadata:
  author: syner
  version: "1.0"
---

# Enhance Skill

## Purpose

Systematically improve existing skills by identifying gaps and applying proven patterns. This skill codifies lessons learned from skill development: vague instructions lead to inconsistent behavior, while specific tool guidance produces reliable results.

## When to Use

- After creating a new skill, to audit it before use
- When a skill produces inconsistent results
- During periodic skill maintenance
- When migrating skills between projects

## Enhancement Checklist

Review the target skill against these criteria, then apply fixes:

### 1. Tool Usage Specificity

**Problem**: Instructions say "read files" without specifying how.

**Fix**: Explicitly name the tools and patterns:
```markdown
## How to Read Files
1. Use `Glob` tool with pattern `path/**/*.md` to discover files
2. Use `Read` tool to load file contents
3. Use `Grep` tool to search within files
```

### 2. Context File Convention

**Problem**: Skills don't leverage folder-level context.

**Fix**: Add instructions to check for index/context files:
```markdown
**Important**: For each folder, check if an `index.md` exists and read it first - it provides context for interpreting that folder's contents.
```

### 3. Path Resolution

**Problem**: Relative paths like `apps/notes/` assume current directory.

**Fix**: Anchor paths to a discoverable root:
```markdown
1. Find the project root (the directory containing `apps/` or the marker file)
2. Then navigate to `apps/notes/` from there
```

### 4. Chronological Ordering

**Problem**: Time-based analysis has no way to determine order.

**Fix**: Specify how to get timestamps:
```markdown
Use `ls -la` or `stat` on files to get modification timestamps for chronological ordering.
```

### 5. Input Validation

**Problem**: Skills assume input is always provided.

**Fix**: Add fallback behavior:
```markdown
1. If [input] not provided, ask the user
   OR
1. If [input] not provided, suggest options based on recent files
```

### 6. Output Structure

**Problem**: Output format is described but not enforced.

**Fix**: Use explicit templates:
```markdown
## Output Format
ALWAYS use this structure:
- **Section A**: [content]
- **Section B**: [content]
```

### 7. Language Clarity

**Problem**: Instructions are ambiguous or in mixed languages.

**Fix**:
- Use imperative form ("Read the file" not "The file should be read")
- One language throughout
- Avoid jargon without definition

## Process

1. **Read** the target skill's SKILL.md completely
2. **Score** against each checklist item (pass/needs-fix)
3. **Draft** improvements for items that need fixing
4. **Apply** changes while preserving the skill's intent
5. **Verify** the enhanced skill by reading it back

## Output Format

When enhancing a skill, report:

- **Skill**: Name of the skill enhanced
- **Issues Found**: List of checklist items that needed fixing
- **Changes Made**: Summary of improvements applied
- **Before/After**: Key sections that changed (abbreviated)

## Usage

```
/enhance [skill-name or path-to-skill]
```

Examples:
- `/enhance state` - Enhance the state skill
- `/enhance skills/trace/SKILL.md` - Enhance by path
- `/enhance` - List available skills to choose from

## Notes

This skill embodies a meta-principle: skills improve when they're specific about *how* to do things, not just *what* to do. Vague instructions force the AI to guess; specific instructions produce consistent results.

The checklist items come from real debugging sessions where skills failed due to these exact gaps.
