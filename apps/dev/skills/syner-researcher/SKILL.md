---
name: syner-researcher
description: Research topics from Claude Code docs or your personal vault. Web search not currently available.
tools: [Glob, Read, Grep, Task, AskUserQuestion, Write]
metadata:
  author: syner
  version: "0.2.0"
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
| Claude Code | skill, hook, MCP, subagent, agent SDK, CLI, claude code | Built-in knowledge + codebase |
| Internal | "my notes", "mi vault", "what I wrote", project-specific terms | `Glob` + `Read` on vault |
| Web/General | library, framework, technology, API, concept | ⚠️ Limited - see below |

Classify by scanning for signal keywords. If ambiguous, check Internal first.

## Phase 2: Research

Execute the appropriate search based on classification.

### For Claude Code Topics

Use built-in knowledge about Claude Code:
- Hooks and lifecycle events
- MCP servers and tools
- Subagents and the Task tool
- Skills and SKILL.md format
- Settings and configuration
- IDE integrations

Additionally, search the local codebase for examples:
1. `Grep` for relevant patterns in `skills/`, `agents/`, `.claude/`
2. `Read` existing skills to show real examples from this project

### For Web/General Topics

⚠️ **Limitación actual**: Este skill no tiene acceso a búsqueda web.

Cuando el topic sea Web/General:
1. Informar al usuario que no hay capacidad de búsqueda web en Claude Code CLI
2. Buscar en el vault local si hay notas sobre el tema
3. Ofrecer alternativas:
   - Sugerir que el usuario busque manualmente y pegue contenido
   - Usar conocimiento interno del modelo (con disclaimer de fecha de corte)

### For Internal Topics

0. **Anchor to project root**: Use `Glob` with pattern `apps/*/vaults/` to verify vault directories exist from the current working directory. All vault paths in subsequent steps are relative to this project root.
1. Discover all vaults: `apps/*/vaults/**/*.md`
2. Use `Grep` to find files mentioning the topic across all vaults
3. Use `Read` to load relevant files
4. Follow internal links between notes (`[text](./path.md)`)
5. Check `index.md` files for folder context

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
1. Use `AskUserQuestion` to confirm filename and which vault to save to
2. Resolve project root: use `Glob` to find `CLAUDE.md` or `package.json` at the root, then derive the absolute project root path
3. Save to `{root}/apps/{app}/vaults/{vault}/research/[topic-slug].md`
4. Include frontmatter with date and sources

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
/syner-researcher what I wrote about AI agents
/syner-researcher MCP servers
```

## Limitations

- **No web search**: Cannot search the internet. For web topics, user must provide content or use model's internal knowledge.
- **Vault-dependent**: Internal search only works if user has notes in their vault.
- **Knowledge cutoff**: For Web/General topics, answers are limited to model's training data.
