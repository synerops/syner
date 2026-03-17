# @syner/vercel

> Runtime for agent orchestration — `createRuntime()` is the single entry point.

## Exports

```typescript
// Primary API
import { createRuntime } from '@syner/vercel'
import type { Runtime, RuntimeConfig, GenerateResult, GenerateOptions, ToolDef, AgentCardOutput } from '@syner/vercel'

// Skills types (for consumers interacting with runtime.skills)
import type { SkillDescriptor, CommandInfo, SkillsMap } from '@syner/vercel'

// Tool factories (advanced — via subpath export)
import { createSkillTool, createPrepareStep, preprocessPrompt } from '@syner/vercel/tools'
import { createBashTool, createFetchTool, createReadTool, createWriteTool, createEditTool, createGlobTool, createGrepTool } from '@syner/vercel/tools'
```

## Runtime API

```typescript
const runtime = createRuntime(config?)

// Maps
runtime.agents    // Map<string, AgentCard> — call runtime.load() to populate
runtime.tools     // Map<string, ToolDef> — sandbox tools
runtime.skills    // SkillsMap — skills with domain methods

// Methods
await runtime.load()              // Load agents + skills from disk
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

## Dependencies

| Package | Why |
|---------|-----|
| `@vercel/sandbox` | Sandbox container runtime for all tool execution |
| `ai` | AI SDK `tool()`, `ToolLoopAgent` |
| `zod` | Input schema definitions |
| `@syner/osprotocol` | Context/Action/Result lifecycle |
| `@syner/sdk` | Agent registry, model resolution, vault context |
| `@workflow/ai` | Durable agent support |
| `workflow` | Run adapter API |

## Constraints

1. **Always call `runtime.load()` before using agents/skills.** Maps start empty.
2. **Skills index is the source of truth.** `public/.well-known/skills/index.json` — no filesystem scanning.
3. **ToolLoopAgent step limit is 10.** Hardcoded in `generate()`.
4. **Sandbox lifecycle is per-generate.** Created lazily on first tool use, stopped in finally block.
