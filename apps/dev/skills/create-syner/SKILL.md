---
name: create-syner
description: Scaffold syner components. Orchestrates creation of skills, agents, and apps by delegating to specialized skills. Use when creating new components or when the user says "crear", "new", "scaffold".
agent: dev
context: fork
metadata:
  author: syner
  version: "0.1.0"
tools:
  - Skill
  - Glob
  - Grep
  - Read
---

# Create Syner

> Part of **Dev** — the Ecosystem Builder mutation of Syner.

Orchestrator for creating syner ecosystem components. Routes to specialized creation skills.

## Core Principles

### 1. Write in Real-Time
Start writing IMMEDIATELY. Don't wait for "all the info".
User should NEVER have to say "ve escribiendo" - that's the default.

### 2. Output-First Testing
When testing, get the expected output FIRST. Then compare actual vs expected.
Reverse engineering from results > forward planning from requirements.

## Usage

```
/create-syner <type> [name]
```

## Process

### 1. Detect Type

If type provided, delegate immediately.

If no type, ask:
```
What do you want to create?
- skill (capability invoked with /name)
- agent (subagent invoked via Task tool)
- app (Next.js application)
```

### 2. Gather Context (Implicit + Parallel)

While user talks, in parallel:
- Use Glob and Grep to search codebase for related components
- Use Glob + Read to search notes for context about what user is building
- Use Read to load existing patterns (other skills/agents)

## Live Mode

When user is giving feedback in real-time ("te voy a ir contando", "voy a ir probando"):

1. **Write while they talk** - don't wait for all info
2. **Update in real-time** - fix as feedback comes in
3. **Don't interrupt** - no "¿más?", no questionnaires
4. **Just wait** - user continues when ready

Live mode is the default for create-syner workflows.

## CRITICAL: No Questionnaires

**NEVER** ask multiple questions upfront. This kills flow.

Bad:
```
"Cuéntame: 1. ¿Qué problema resuelve? 2. ¿Por qué elegiste X? 3. ¿Qué fricción hubo? 4. ..."
```

Good:
```
"Cuéntame el proceso, voy escribiendo mientras hablas."
```

If user says "lo tengo estructurado" or "te voy a ir contando":
- SHUT UP and listen
- Search context in parallel (silently)
- Start writing immediately with first piece of info
- Ask ONE clarifying question only if truly blocked

DO:
- Let user talk, listen
- Search context in background
- Start writing immediately based on what you hear
- Iterate in real-time
- One question at a time, only when blocked

DON'T:
- Ask "¿más?" or "continue?" after every update
- That's a mini-questionnaire disguised as politeness
- Just wait. User will continue when ready.

### 3. Delegate

| Type | Delegate To |
|------|-------------|
| `skill` | `/create-syner-skill` |
| `agent` | `/create-syner-agent` |
| `app` | `/create-syner-app` |

Use the `Skill` tool to invoke the specialized skill with gathered context.

### 4. Testing Loop (Output-First)

After delegation, support iterative testing:

```
1. User provides expected output (golden)
2. Run the component
3. Compare actual vs golden
4. Fix discrepancies
5. Repeat until match
```

When user says "el output esperado es X" or shares expected behavior:
- Store X as success criteria
- Execute the component
- Compare actual output against golden
- Fix issues in real-time
- Iterate until actual == golden

## Tools

### /skill-creator (optional)

If `/skill-creator` is installed, use it as auxiliary tool for:
- Structuring skill content
- Running evals to test skills
- Optimizing skill descriptions

Not required, but recommended for complex skills.

## Conventions

All created components follow syner conventions:
- Imperative voice (not first-person)
- Explicit tool names
- Testing section included
- Version starts at 0.0.1

## Boundaries

Validate against `/syner-boundaries` before creating:
- **Route, Don't Hoard** — Delegate to specialized creation skills
- **Concrete Output** — Create actual files, not proposals
- **Self-Verification** — Verify created components work
