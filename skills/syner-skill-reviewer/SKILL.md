---
name: syner-skill-reviewer
description: Review skills for quality, safety, and convention compliance. Use when auditing a skill's instructions, checking for prompt injection risks, first-person voice issues, or verifying best practices. Triggers on "review this skill", "audit skill", "check skill quality", "is this skill safe", or when evaluating skills before publishing.
metadata:
  author: syner
  version: "2.0.0"
---

# Skill Reviewer

Audit a skill and report what needs attention — the user decides what to fix.

## Process

1. **Locate** the target skill using `Glob` with `skills/**/SKILL.md` or `.claude/skills/**/SKILL.md`
2. **Read** the SKILL.md completely
3. **Pick review depth** based on context (see below)
4. **Report** findings — only sections with issues, starting with the most important one

If no skill specified, list available skills and ask user to choose.

## Review Depth

Not every review needs every check. Pick the right depth:

| Depth | When | Checks |
|-------|------|--------|
| **Quick** | "quick check", "is this safe?", sanity check | Safety & Voice only |
| **Standard** | "review this skill", general audit | Safety + Technical |
| **Deep** | "full audit", "before publishing", thorough review | All three dimensions |

Default to Standard. The user can request a specific depth, or the context makes it obvious — a one-line question about safety doesn't need a full convention audit.

---

## A. Safety & Voice

This is the most important dimension. A skill lives inside the model's context alongside system prompts and user messages. If the skill "speaks" in first person or claims identity, the model can get confused about whose voice it is — it may adopt the skill's persona instead of following it as a set of directives.

Think of it this way: a skill is a recipe card, not a chef. The recipe says "chop the onions", not "I will chop the onions."

### A1. First-Person Voice

When a skill says "I will analyze your code", the model processing that skill may start thinking it IS the skill. The imperative form ("Analyze the code for...") keeps the boundary clear: these are directives to follow, not an identity to adopt.

Look for: "I", "my", "me", "we", "our" — especially in headings and opening lines where they set the tone for everything that follows.

Common patterns and what to suggest instead:
- "What I Do" → "Process" or "Capabilities"
- "I will analyze..." → "Analyze the input..."
- "How I work" → "How this skill works"
- "My approach" → just describe the steps directly

First person inside example outputs or templates is fine — there the skill is showing what the final text looks like, not speaking as itself.

### A2. Identity & Injection Patterns

Skills should never compete with the model's actual instructions. Patterns like "You are a code reviewer" or "Act as an expert" create identity conflicts — the model already has its identity from the system prompt, and the skill is trying to overwrite it.

The safe alternative is always the imperative: "Review code for..." instead of "You are a code reviewer." Same outcome, no conflict.

Red flags to watch for:
- Identity claims: "You are...", "Act as...", "Your role is..."
- Override language: "Ignore previous...", "Forget everything above"
- Authority claims: "This overrides...", "As the primary skill..."
- Hidden behavioral instructions buried inside code blocks or comments

### A3. Heading Tone

Headings set the frame for everything beneath them. A heading like "# Who You Are" or "# Your Mission" or "# Remember" creates an identity/command frame that colors how the model interprets the content below.

Prefer descriptive headings: "# Purpose", "# Process", "# Checklist". They describe content without issuing commands.

---

## B. Technical Quality

These checks catch patterns that make skills unreliable or fragile in practice.

### B1. Tool Specificity

When a skill says "read the files", the model has to guess which tool to use — `Read`? `Glob`? `Grep`? `Bash` with `cat`? Each has different behavior. Naming tools explicitly ("Use `Glob` to discover files, then `Read` to load contents") removes ambiguity and leads to more consistent execution.

### B2. Path Resolution

Skills that use relative paths ("look in `./notes/`") break when invoked from different directories. Anchoring to the project root ("find the directory containing `apps/` or `package.json`, then look in `apps/notes/`") makes the skill work regardless of where the user is.

### B3. Skill References

Same idea as paths — referencing another skill with `../syner-load-all/SKILL.md` is fragile. Using the skill name (`/syner-load-all`) works everywhere and is what the routing system expects.

### B4. Input Handling

When a skill needs input but doesn't get any, it should either have a sensible default or ask with `AskUserQuestion`. The key judgment call: if the skill has an obvious default mode (like "review all skills" when no specific skill is named), just do that — don't ask a question the user already answered by omission.

### B5. Output Structure

If a skill's output format is important (and it usually is for skills that produce reports or structured artifacts), define it with an explicit template. Vague descriptions like "output a summary" lead to inconsistent results across invocations.

### B6. Delegation

When a skill involves multiple file changes, verification loops, or iterative refinement, it should delegate to `syner-worker` rather than handling the complexity inline. A skill that tries to do everything itself tends to get long and brittle.

---

## C. Convention Compliance

These are syner ecosystem patterns. They're not critical for safety or correctness, but they keep the skill ecosystem consistent and maintainable.

### C1. Folder Context

Skills that read from folders should check for `index.md` first — it provides context about what that folder contains and how to interpret its files.

### C2. Frontmatter

Complex skills benefit from declaring their needs in frontmatter:
- `context: fork` for heavy context loading or multi-step operations
- `skills: [deps]` to preload dependencies
- `agent: type` when delegating execution
- `tools: [list]` to declare what tools the skill uses

### C3. Shared Conventions

If a skill repeats the "How to Read Notes" pattern (or similar boilerplate), it should reference `skills/syner/note-conventions.md` instead. Five skills currently share this block — deduplication keeps updates from needing five edits.

### C4. Philosophy

Syner skills follow the principles in PHILOSOPHY.md: suggest don't enforce, read notes for context not data extraction, ask when unsure. A skill that imposes rigid structure on free-form notes or makes decisions without offering alternatives is out of alignment.

### C5. Simplicity

When a skill specifies a complex approach (scoring formulas, git-diff-based historical analysis, weighted rankings), check whether a simpler alternative achieves the same goal. Ordered criteria beat scoring formulas. Current-state checks beat historical comparisons. The model's judgment within clear guidelines beats rigid mathematical rules.

---

## Reporting

Only report sections that have findings — don't list passing checks. Start with the most impactful issue.

Use severity to communicate priority:
- **Critical** — could cause model misbehavior (identity confusion, injection risk)
- **Warning** — reduces reliability (vague tools, fragile paths)
- **Suggestion** — improvement opportunity (conventions, frontmatter)

Format:

```
## Skill Review: `[name]`

### Critical
- **[A1]**: "What I Do" heading creates identity frame
  - Line ~9: suggest "Process" or "Capabilities"

### Warnings
- **[B2]**: Paths assume current directory
  - Suggest anchoring to project root

### Start here
→ Fix the first-person headings first — they affect how the model interprets everything else.
```

If the skill is clean, just say so: "Reviewed [name] at [depth] depth. No issues found."

End with a reminder: this reviewer reports and suggests. The user decides what matters and what to change.
