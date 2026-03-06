---
name: syner-readme-enhancer
description: Enhance READMEs for apps and packages by analyzing actual code. Detects maturity level, special capabilities (plan mode), and generates honest, focused READMEs. Use when creating or updating README files.
tools:
  - Glob
  - Read
  - Bash
  - Write
  - AskUserQuestion
metadata:
  author: syner
  version: "0.1.0"
---

# Syner README Enhancer

Generate honest READMEs by analyzing what the component **actually does**.

## The Three Questions

Every README must answer:

1. **What is it?** - One line, clear identity
2. **Why does it exist?** - The value it provides
3. **How do I try it?** - Commands + what I'll actually see

## Phase 1: Input & Detection

**Input:** $ARGUMENTS

Parse the target name and detect type:

```
apps/{name}     → type: app
packages/{name} → type: package
```

**Valid apps:** `notes`, `dev`, `bot`, `design`
**Valid packages:** `github` (and any in `packages/`)

If empty, use `AskUserQuestion` to ask which target.

---

## Phase 2A: Analyze Apps

**Skip this if type is `package`.**

### 2A.1 Discover & Read

```
Glob: apps/$APP/app/**/*.tsx
Glob: apps/$APP/app/**/*.ts
Read: apps/$APP/app/page.tsx
Read: apps/$APP/package.json
```

For API routes, read them to understand what the app does.

### 2A.2 Classify App Maturity

- **Placeholder** - Single page, "coming soon", no API routes
- **MVP** - 2-3 routes, basic functionality
- **Functional** - Multiple routes, real features, API integration
- **Production** - Full features, error handling, auth

### 2A.3 Check for Skills & Existing README

```
Glob: apps/$APP/skills/*/SKILL.md
Read: apps/$APP/README.md (if exists)
```

If existing README is complex (>50 lines), read `apps/dev/skills/syner-readme-enhancer/references/separation.md` for guidance.

### Context Hierarchy (internal, don't expose)

```
notes          ← base (no dependencies)
  ↓
bot            ← reads from notes
  ↓
dev / design   ← reads from notes + bot
  ↓
app (future)   ← reads from all above
```

---

## Phase 2B: Analyze Packages

**Skip this if type is `app`.**

### 2B.1 Discover & Read Package

```
Read: packages/$PKG/package.json      → name, exports, bin, description
Read: packages/$PKG/src/exports.ts    → public API
Read: packages/$PKG/src/index.ts      → CLI if has bin
Glob: packages/$PKG/src/**/*.ts       → implementation
```

### 2B.2 Check for Special Capabilities

```
Read: packages/$PKG/plan.md           → has plan mode?
Glob: packages/$PKG/skills/*/SKILL.md → associated skills
```

**Plan mode:** If `plan.md` exists, the package can materialize syner plans into platform-specific actions (e.g., GitHub issues).

### 2B.3 Understand Ecosystem Context

```
Read: apps/dev/README.md              → dev workflow context
Read: skills/syner/plan.md            → how planning works system-wide
Glob: agents/*.md                     → which agents use this package
```

### 2B.4 Classify Package Role

- **Auth** - Provides authentication (tokens, credentials)
- **Platform** - Integrates with external platform (GitHub, Vercel, etc.)
- **Tools** - Provides AI SDK tools for agents
- **Utilities** - Shared utilities for other packages/apps

A package can have multiple roles.

---

## Phase 3A: Generate App README

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

---

## Phase 3B: Generate Package README

### Template for Packages

```markdown
# @syner/{name}

one line: what problem it solves.

## what it does

- capability 1 (informative, not technical)
- capability 2
- capability 3

## how it fits

[diagram showing where this package lives in the flow]

\`\`\`
example flow showing this package's role
\`\`\`

## plan mode (only if has plan.md)

what "plan mode" means for this package:
- what it reads
- what it creates
- why it works that way

## usage

\`\`\`bash
# cli usage (if has bin)
bunx @syner/{name} command
\`\`\`

\`\`\`typescript
// programmatic (brief)
import { something } from "@syner/{name}"
\`\`\`

## setup

- `VAR_NAME` - what it's for
- `ANOTHER_VAR` - what it's for

## skills (if any)

- `/skill-name` - what it does
```

### Package Guidelines

- **"what it does"** - capabilities, not exports list
- **"how it fits"** - diagram showing flow, where this lives
- **"plan mode"** - dedicated section if `plan.md` exists
- Explain value first, technical details second
- Max 60 lines

---

## Phase 4: Output

Show the draft:

```
**Type:** [app/package]
**Classification:** [placeholder/mvp/functional/production] or [auth/platform/tools/utilities]

## Generated README

[content]

---
Does this capture the essence?
```

Ask for approval, write if confirmed.

## References

_Internal documentation only — not file paths for agent use._

- `apps/dev/skills/syner-readme-enhancer/references/examples.md` - Before/after examples
- `apps/dev/skills/syner-readme-enhancer/references/separation.md` - What content stays vs moves
