---
name: syner-researcher
description: Research topics and compile findings. Routes to the right source based on topic type - Claude Code docs for CLI/agent questions, web search for technologies/libraries, or your personal vault for internal knowledge.
metadata:
  author: syner
  version: "1.0"
---

# Syner Researcher

Research any topic by routing to the appropriate source.

## Phase 1: Understand

Parse the input and classify the topic type.

**Input:** $ARGUMENTS

If empty, use `AskUserQuestion` to ask what the user wants to research.

### Classification Table

| Type | Signals | Source |
|------|---------|--------|
| Claude Code | skill, hook, MCP, subagent, agent SDK, CLI, claude code | `claude-code-guide` subagent |
| Web/General | library, framework, technology, API, concept, "how does X work" | `WebSearch` + `WebFetch` |
| Internal | "my notes", "mi vault", "what I wrote", project-specific terms | `Glob` + `Read` on vault |

Classify by scanning for signal keywords. If ambiguous, prefer Web/General as the default.

## Phase 2: Research

Execute the appropriate search based on classification.

### For Claude Code Topics

Use the `claude-code-guide` subagent:

```
Task(
  subagent_type="claude-code-guide",
  prompt="Research: [topic]. Provide comprehensive information about how this works in Claude Code.",
  model="haiku"
)
```

The subagent has access to Claude Code documentation and can answer questions about:
- Hooks and lifecycle events
- MCP servers and tools
- Subagents and the Task tool
- Skills and SKILL.md format
- Settings and configuration
- IDE integrations

### For Web/General Topics

1. Use `WebSearch` with a well-formed query:
   - Include the technology name
   - Add "2026" for recent info (documentation, best practices)
   - Be specific: "React Server Components SSR hydration" not just "React"

2. For each relevant result, use `WebFetch` to get details:
   - Prioritize official docs, GitHub repos, and authoritative sources
   - Extract key concepts, code examples, and gotchas

3. Compile from multiple sources for completeness

### For Internal Topics

1. Find the vault: `apps/notes/vaults/syner/`
2. Use `Glob` with pattern `apps/notes/vaults/syner/**/*.md`
3. Use `Grep` to find files mentioning the topic
4. Use `Read` to load relevant files
5. Follow internal links between notes (`[text](./path.md)`)
6. Check `index.md` files for folder context

## Phase 3: Compile

Structure findings into a coherent summary:

1. **Core Concept**: One-paragraph explanation
2. **Key Points**: 3-5 bullet points of essential info
3. **Examples**: Code snippets or concrete examples (if applicable)
4. **Gotchas**: Common mistakes or important caveats
5. **Sources**: Where the information came from

## Phase 4: Output

Present the compiled research.

If the user included "save" or "guardar" in the request:
1. Use `AskUserQuestion` to confirm filename
2. Save to `apps/notes/vaults/syner/research/[topic-slug].md`
3. Include frontmatter with date and sources

Otherwise, output directly to the conversation.

## Output Format

```
## [Topic]

[Core concept paragraph]

### Key Points
- Point 1
- Point 2
- Point 3

### Examples
[Code or concrete examples]

### Watch Out For
- Gotcha 1
- Gotcha 2

---
Sources: [list sources used]
```

## Usage

```
/syner-researcher hooks de claude code
/syner-researcher react server components
/syner-researcher what I wrote about AI agents
/syner-researcher vercel edge functions save
```
