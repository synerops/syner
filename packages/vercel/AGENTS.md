# @syner/vercel

> Runtime for agent orchestration — `createRuntime()` is the single entry point.

## Exports

```typescript
// Primary API
import { createRuntime } from '@syner/vercel'
import type { Runtime, RuntimeConfig, GenerateResult, GenerateOptions, AgentCardOutput } from '@syner/vercel'

// Skills types (for consumers interacting with runtime.skills)
import type { SkillDescriptor, CommandInfo, SkillsMap } from '@syner/vercel'

// Tool schemas + execute functions (advanced — via subpath export)
import { bashInputSchema, executeBash, fetchInputSchema, executeFetch } from '@syner/vercel/tools'
import { readInputSchema, executeRead, writeInputSchema, executeWrite } from '@syner/vercel/tools'
import { globInputSchema, executeGlob, grepInputSchema, executeGrep } from '@syner/vercel/tools'
import { createSkillTool, createPrepareStep } from '@syner/vercel/tools'
```

## Runtime API

```typescript
const runtime = createRuntime(config?)

// Maps
runtime.agents    // Map<string, AgentCard> — call runtime.start() to populate
runtime.skills    // SkillsMap — skills with domain methods

// Methods
await runtime.start()             // Load agents + skills from disk
await runtime.byChannel()         // Map<channelId, AgentCard>
runtime.card()                    // A2A discovery card (sync)
await runtime.generate(agent, prompt, options?)  // Full lifecycle
```

### SkillsMap

```typescript
runtime.skills                    // SkillsMap extends Map<string, SkillDescriptor>
runtime.skills.commands()         // Map<commandName, CommandInfo>
runtime.skills.has('syner')       // native Map method
```

## Types

### RuntimeConfig

```typescript
interface RuntimeConfig {
  agents?: { dir?: string }
  skills?: { index?: string; dirs?: string[] }
}
```

### SkillDescriptor

```typescript
interface SkillDescriptor {
  name: string
  description: string
  files: string[]
  command?: string
  agent?: string
}
```

### CommandInfo

```typescript
interface CommandInfo {
  skillName: string
  description: string
  agent: string
}
```

### AgentCardOutput

```typescript
interface AgentCardOutput {
  name: string
  description: string
  url: string
  version: string
  capabilities: { streaming: boolean; pushNotifications: boolean }
  skills: Array<{ id: string; name: string; description: string }>
}
```

## Tool Architecture

Tools are pure operations: schema + execute function. No `ToolDef` abstraction.

- **Sandbox tools** (Bash, Read, Write, Glob, Grep): `execute(sandbox, input)` — the runtime binds the sandbox at call time
- **Native tools** (Fetch): `execute(input)` — no sandbox needed, uses native `fetch()`
- **Composite tools** (Skill, Task): created via factory functions with runtime dependencies

The runtime's `generate()` method binds tools to the lazy sandbox directly, eliminating the intermediate Map layer.

## Dependencies

| Package | Why |
|---------|-----|
| `@vercel/sandbox` | Sandbox container runtime for tool execution |
| `ai` | AI SDK `tool()`, `ToolLoopAgent` |
| `zod` | Input schema definitions |
| `@syner/osprotocol` | Context/Action/Result lifecycle |
| `@syner/sdk` | Agent registry, model resolution, vault context |
| `@workflow/ai` | Durable agent support |
| `workflow` | Run adapter API |

## Constraints

1. **Always call `runtime.start()` before using agents/skills.** Maps start empty.
2. **Skills index is the source of truth.** `public/.well-known/skills/index.json` — no filesystem scanning.
3. **ToolLoopAgent step limit is 10.** Hardcoded in `generate()`.
4. **Sandbox lifecycle is per-generate.** Created lazily on first tool use, stopped in finally block.
