# @syner/vercel

> AI SDK tool suite and skill execution runtime for isolated Vercel Sandbox containers.

## Quick Start

```bash
bun add @syner/vercel
```

```typescript
// Create sandbox tools for an agent
import { createAgentSandbox, createTools, stopSandbox } from '@syner/vercel'

const { sandbox, workdir } = await createAgentSandbox({
  repoUrl: 'https://github.com/synerops/syner',
})
const tools = createTools(sandbox)
// tools = { Bash, Fetch, Read, Write, Edit, Glob, Grep }

// ... use tools with AI SDK ...

await stopSandbox(sandbox)
```

## Key Features

- **7 sandbox tools** -- Bash, Fetch, Read, Write, Edit, Glob, Grep as AI SDK tools
- **Skill execution** -- `executeSkill()` runs a SKILL.md as a ToolLoopAgent subagent
- **Vault tools** -- 5 vault operations (Read, Write, Delete, List, Glob) via VaultStore
- **Lazy sandbox** -- `createAgentHandler()` defers sandbox creation until first tool call
- **Next.js integration** -- `withSyner()` adds `/agent` route rewrite

## Usage

### Execute a skill

```typescript
import { executeSkill } from '@syner/vercel'

const result = await executeSkill('find-ideas', 'Find startup ideas', {
  repoRoot: '/workspace',
  tools,
  model,
})
// result is an osprotocol Result with context, action, verification, output
```

### Standalone tools (ephemeral sandbox per call)

```typescript
import { Bash, Fetch } from '@syner/vercel'
// Each call creates and destroys a sandbox — expensive for multiple calls
```

### Shared sandbox (recommended for multi-call workflows)

```typescript
import { createAgentSandbox, createTools, stopSandbox } from '@syner/vercel'

const { sandbox } = await createAgentSandbox({ repoUrl })
const tools = createTools(sandbox)  // all 7 tools share one sandbox

// Always clean up
await stopSandbox(sandbox)
```

### Agent handler (Next.js API route)

```typescript
import { createAgentHandler } from '@syner/vercel'

const handler = createAgentHandler({
  agentId: 'my-agent',
  skillRef: 'session:my-agent',
  handler: async (req, context, action) => { /* ... */ },
})

export const POST = handler
```

## Dependencies

| Package | Why |
|---------|-----|
| `@vercel/sandbox` | Sandbox container runtime for all tool execution |
| `ai` | AI SDK `tool()` function, `ToolLoopAgent`, `LanguageModel` type |
| `zod` | Input schema definitions for all tools |
| `@syner/osprotocol` | Context/Action/Result types, `verify()`, `createResult()`, `parseSkillManifest()` |
| `@syner/sdk` | `VaultStore` type for vault tool factories |
| `gray-matter` | SKILL.md frontmatter parsing |
| `glob` | File discovery for skill loading |

See [AGENTS.md](./AGENTS.md) for the full API reference, type definitions, and constraints.
