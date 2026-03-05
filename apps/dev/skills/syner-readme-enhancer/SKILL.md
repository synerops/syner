---
name: syner-readme-enhancer
description: Enhance app READMEs by analyzing actual code, not just metadata. Detects if an app is a placeholder or has real functionality. Generates honest, focused READMEs. Use when creating or updating README files for syner apps.
tools:
  - Glob
  - Read
  - Bash
  - Write
  - AskUserQuestion
metadata:
  author: syner
  version: "0.8.0"
---

# Syner README Enhancer

Generate honest READMEs by analyzing what the app **actually does**.

## The Three Questions

Every README must answer:

1. **What is it?** - One line, clear identity
2. **Why does it exist?** - The value it provides
3. **How do I try it?** - Commands + what I'll actually see

## Context Hierarchy (internal)

Use this to understand what each app reads from, but don't expose it in the README:

```
notes          ← base (no dependencies)
  ↓
bot            ← reads from notes
  ↓
dev / design   ← reads from notes + bot
  ↓
app (future)   ← reads from all above
```

## Phase 1: Input

**Input:** $ARGUMENTS

Parse the app name. Valid: `notes`, `dev`, `bot`, `design`.

If empty, use `AskUserQuestion` to ask which app.

## Phase 2: Analyze the Actual App

**Read the actual code** to understand what's implemented.

All paths are relative to project root. Use `Glob` and `Read` with full paths.

### 2.1 Discover & Read

```
Glob: apps/$APP/app/**/*.tsx
Glob: apps/$APP/app/**/*.ts
Read: apps/$APP/app/page.tsx
Read: apps/$APP/package.json
```

For API routes, read them to understand what the app does.

### 2.2 Classify App Maturity

- **Placeholder** - Single page, "coming soon", no API routes
- **MVP** - 2-3 routes, basic functionality
- **Functional** - Multiple routes, real features, API integration
- **Production** - Full features, error handling, auth

### 2.3 Check for Skills & Existing README

```
Glob: apps/$APP/skills/*/SKILL.md
Read: apps/$APP/README.md (if exists)
```

If existing README is complex (>50 lines), read `references/separation.md` for guidance.

## Phase 3: Generate README

### Template for Functional Apps

```markdown
# syner.{ext}

one line: what it does.

## why syner.{ext}

- value point 1
- value point 2
- value point 3

## how it works

1. step one (from actual code)
2. step two
3. step three

## try it

\`\`\`bash
bun run dev --filter={app}
\`\`\`

what happens when you run it.

## skills (if any)

- `/skill-name` - what it does

## setup (if needed)

run `/skill-name` or see [setup guide](link).
```

### Template for Placeholder Apps

Use "what it will be" instead of "why" and "how it works":

```markdown
# syner.{ext}

one line vision. **coming soon.**

## what it will be

- vision point 1
- vision point 2
- vision point 3

## what works today

the **skills** work locally via Claude Code:

- `/skill-name` - what it does

## try it

\`\`\`bash
bun run dev --filter={app}
\`\`\`

what you'll see (be honest).
```

### Guidelines

- Use lists, not tables
- Max 50 lines
- "why" explains value, "how it works" explains mechanics
- Link to details instead of including them
- Only document THIS app, not its dependencies

## Phase 4: Output

Show the draft:

```
**Classification:** [placeholder/mvp/functional/production]

## Generated README

[content]

---
Does this capture the essence?
```

Ask for approval, write if confirmed.

## References

- `references/examples.md` - Before/after examples
- `references/separation.md` - What content stays vs moves
