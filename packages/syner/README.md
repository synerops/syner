# Syner

> The Fullstack Agent - opinionated defaults built on [@syner/sdk](../sdk)

Syner provides batteries-included implementations of the SDK primitives with smart defaults, pre-configured guidelines, and production-ready integrations.

## Installation

```bash
pnpm add syner
```

## Quick Start

```typescript
import { context } from "syner"

// The context agent is pre-configured and ready to use
const result = await context.gather("What was I working on yesterday?")

console.log(result.experimental_output)
// {
//   data: { ... relevant memories ... },
//   sources: ["memory"],
//   confidence: 0.92
// }
```

## Context API

### Memory API

Store and retrieve information across agent interactions.

#### Direct API Access

```typescript
import { context } from "syner"

// Store information
await context.memory.set(
  "user_preference",
  { theme: "dark" },
  {
    tags: ["preferences", "ui"],
  }
)

// Retrieve by key
const pref = await context.memory.get("user_preference")
console.log(pref?.value) // { theme: "dark" }

// Search with filters
const recent = await context.memory.search({
  tags: ["preferences"],
  after: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
  limit: 10,
})

// Delete
await context.memory.delete("user_preference")

// Clear by tags
await context.memory.clear(["temporary"])
```

#### Agent-Based (Intelligent)

The agent decides when to use memory based on your query:

```typescript
import { context } from "syner"

// Agent automatically stores in memory
await context.gather("Remember that I prefer dark mode")
// → context.memory.set("user_theme", "dark", { tags: ["preferences"] })

// Agent searches memory
await context.gather("What theme do I use?")
// → context.memory.search({ query: "theme" })
// Returns: { data: { theme: "dark" }, sources: ["memory"], confidence: 1.0 }

// Context continuity
await context.gather("What was I working on last week?")
// → context.memory.search({ after: lastWeek, tags: ["task"] })
```

### Memory with Expiration

```typescript
// Temporary information that expires
await context.memory.set("session_token", "abc123", {
  expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
  tags: ["session", "temporary"],
})

// After expiration, returns null
const token = await context.memory.get("session_token")
// → null (if expired)
```

### Memory Organization with Tags

```typescript
// Store with semantic tags
await context.memory.set(
  "api_design",
  {
    decision: "REST over GraphQL",
    reasoning: "Simpler for team",
    date: "2025-10-21",
  },
  {
    tags: ["architecture", "api", "decision"],
  }
)

// Find all architectural decisions
const decisions = await context.memory.search({
  tags: ["architecture", "decision"],
})

// Find API-related memories from last month
const apiMemories = await context.memory.search({
  tags: ["api"],
  after: new Date("2025-09-21"),
  limit: 20,
})
```

## Memory Providers

Memory supports pluggable storage backends. Choose the right provider for your use case.

### InMemory Provider (Default)

Zero configuration, perfect for development and single-instance deployments.

```typescript
import { context } from "syner"
// Already using InMemory by default

// Or explicitly:
import { createContextAgent, InMemoryProvider } from "syner"

const context = createContextAgent({
  memory: new InMemoryProvider(),
})
```

**Best for:** Development, testing, single-instance apps  
**Not recommended for:** Production multi-instance deployments (data not shared across instances)

### Redis Provider

Production-ready provider with persistence and multi-instance support.

**Installation:**

```bash
pnpm add ioredis
```

**Usage:**

```typescript
import Redis from "ioredis"
import { createContextAgent, RedisMemoryProvider } from "syner"

const context = createContextAgent({
  memory: new RedisMemoryProvider({
    client: new Redis(process.env.REDIS_URL),
    keyPrefix: "myapp:",
    ttl: 3600, // Default TTL in seconds
  }),
})

// All memory operations now use Redis
await context.memory.set(
  "user_session",
  { userId: "123" },
  {
    tags: ["session"],
    expiresAt: new Date(Date.now() + 3600000),
  }
)
```

**Configuration Options:**

- `client` - ioredis client instance (required or url)
- `url` - Redis connection URL (alternative to client)
- `keyPrefix` - Prefix for all keys (default: "syner:memory:")
- `ttl` - Default TTL in seconds (optional)

**Best for:** Production, multi-instance apps, persistence required  
**Features:** Automatic expiration, tag indexing, persistence

### Custom Provider

Create your own provider by implementing `MemoryContext`:

```typescript
import {
  DefaultMemoryProvider,
  type Memory,
  type MemorySearchOptions,
} from "@syner/sdk/context"

class SupabaseMemoryProvider extends DefaultMemoryProvider {
  constructor(private supabase: SupabaseClient) {
    super()
  }

  async set(
    key: string,
    value: unknown,
    options?: { tags?: string[]; expiresAt?: Date }
  ) {
    const memory: Memory = {
      id: this.generateId(),
      key,
      value,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: options?.expiresAt,
        tags: options?.tags,
      },
    }

    await this.supabase.from("memories").insert(memory)
    return memory
  }

  async get(key: string): Promise<Memory | null> {
    const { data } = await this.supabase
      .from("memories")
      .select()
      .eq("key", key)
      .single()

    if (!data) return null

    // Check expiration
    if (this.isExpired(data)) {
      await this.delete(key)
      return null
    }

    return data
  }

  async search(options: MemorySearchOptions): Promise<Memory[]> {
    let query = this.supabase.from("memories").select()

    if (options.tags) {
      query = query.contains("metadata->tags", options.tags)
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    const { data } = await query
    return data || []
  }

  async delete(key: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("memories")
      .delete()
      .eq("key", key)

    return !error
  }

  async clear(tags?: string[]): Promise<number> {
    let query = this.supabase.from("memories").delete()

    if (tags) {
      query = query.contains("metadata->tags", tags)
    }

    const { count } = await query
    return count || 0
  }
}

// Use custom provider
const context = createContextAgent({
  memory: new SupabaseMemoryProvider(supabaseClient),
})
```

**Implement these methods:**

- `set(key, value, options)` - Store memory
- `get(key)` - Retrieve memory (handle expiration)
- `search(options)` - Search with filters
- `delete(key)` - Remove memory
- `clear(tags?)` - Clear all or by tags

**Helper methods from DefaultMemoryProvider:**

- `generateId()` - Generate unique memory ID
- `isExpired(memory)` - Check if memory expired

### Provider Comparison

| Provider | Persistence | Multi-Instance | Speed       | Setup               |
| -------- | ----------- | -------------- | ----------- | ------------------- |
| InMemory | ❌          | ❌             | ⚡️ Fastest | Zero config         |
| Redis    | ✅          | ✅             | 🚀 Fast     | Install ioredis     |
| Custom   | Depends     | Depends        | Varies      | Implement interface |

### Future Providers

Coming soon:

- **DynamoDBMemoryProvider** - AWS DynamoDB backend
- **MongoDBMemoryProvider** - MongoDB backend
- **FileSystemMemoryProvider** - JSON file storage
- **CompositeMemoryProvider** - Multi-layer caching (L1: InMemory, L2: Redis)

## Using Memory in Chat

The context agent automatically uses memory tools when appropriate based on guidelines. Here's how it works:

### How Tools Work

The context agent has three memory tools available:

1. **memory_set** - Store information
2. **memory_get** - Retrieve by exact key
3. **memory_search** - Search with filters

The LLM decides which tool to use based on:

- The user's prompt
- Configured guidelines
- Available tools

### Example Conversation

**Request:**

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Remember that I'\''m working on authentication"}'
```

**Response:**

```json
{
  "response": "I've stored that information. You're working on authentication.",
  "toolCalls": [
    {
      "toolName": "memory_set",
      "args": {
        "key": "current_task",
        "value": "authentication",
        "tags": ["work", "task"]
      },
      "result": {
        "success": true,
        "id": "mem_1234567890_abc123",
        "key": "current_task"
      }
    }
  ]
}
```

**Later Request:**

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What am I working on?"}'
```

**Response:**

```json
{
  "response": "You're working on authentication.",
  "toolCalls": [
    {
      "toolName": "memory_search",
      "args": {
        "query": "working on",
        "limit": 10
      },
      "result": {
        "count": 1,
        "memories": [
          {
            "key": "current_task",
            "value": "authentication"
          }
        ]
      }
    }
  ]
}
```

### How Guidelines Trigger Tools

The context agent has pre-configured guidelines that map user intent to tools:

**Guideline 1: Storage** (priority: 100)

- **When:** User says "remember", "save", "store", "keep in mind"
- **Then:** Use `memory_set` tool
- **Example:** "Remember my favorite color is blue" → `memory_set("favorite_color", "blue", ["preferences"])`

**Guideline 2: Retrieval** (priority: 95)

- **When:** User says "recall", "what did", "do you remember", "what was"
- **Then:** Use `memory_search` or `memory_get` tool
- **Example:** "What did I say earlier?" → `memory_search({ query: "said earlier" })`

**Guideline 3: Context References** (priority: 90)

- **When:** User references past conversation or work
- **Then:** Use `memory_search` with filters
- **Example:** "What was I working on yesterday?" → `memory_search({ query: "working on" })`

### Chat API Reference

**Endpoint:** `POST /chat`

**Request:**

```typescript
{
  prompt: string // User's message
}
```

**Response:**

```typescript
{
  response: string;           // Agent's text response
  output: {                  // Structured output
    data: Record<string, unknown>;
    sources: string[];
    confidence: number;
  };
  toolCalls: Array<{         // Tools the agent used
    toolName: string;
    args: any;
    result: any;
  }>;
  usage: {                   // Token usage stats
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: string;
}
```

### Testing Locally

**Start the server:**

```bash
cd apps/workspace
pnpm dev
```

**Test memory storage:**

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Remember that my name is Ronny"}'
```

**Test memory retrieval:**

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is my name?"}'
```

**Test memory search:**

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What do you know about me?"}'
```

## Custom Configuration

### Create Custom Instance

```typescript
import { createContextAgent } from "syner/context"

const myContext = createContextAgent({
  model: "anthropic/claude-3.5-sonnet",
})

// Add custom guideline
myContext.createGuideline({
  condition: "User asks about team members",
  action: "Search memory with team tag and return profiles",
  apis: ["memory"],
  priority: 110,
})

await myContext.gather("Who is on the frontend team?")
```

### Multiple Instances

```typescript
import { createContextAgent } from "syner/context"

// Different contexts for different purposes
const userContext = createContextAgent({ model: "openai/gpt-4o-mini" })
const systemContext = createContextAgent({ model: "openai/gpt-4o" })

// User preferences and history
await userContext.memory.set("last_login", new Date())

// System state and metrics
await systemContext.memory.set("health_check", { status: "healthy" })
```

## Integration with Orchestrator

```typescript
import { createFullstackAgent } from "syner"

const agent = createFullstackAgent()

// Agent has pre-configured context
const { experimental_output: ctx } = await agent.context.gather(
  "Gather everything about the authentication module"
)

console.log(ctx.sources)
// → ["memory", "filesystem", "git"]

console.log(ctx.confidence)
// → 0.89
```

## Common Patterns

### Conversation History

```typescript
// Store conversation context
await context.memory.set(
  `conv_${userId}_${timestamp}`,
  {
    user: userId,
    message: "How do I deploy?",
    response: "Run pnpm build && pnpm deploy",
  },
  {
    tags: ["conversation", userId],
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  }
)

// Retrieve user's conversation history
const history = await context.memory.search({
  tags: ["conversation", userId],
  limit: 50,
})
```

### Task Context

```typescript
// Track current work
await context.memory.set(
  "current_task",
  {
    name: "Implement Memory API",
    started: new Date(),
    files: ["context/memory.ts", "context/index.ts"],
    status: "in_progress",
  },
  {
    tags: ["task", "active"],
  }
)

// Later, resume where you left off
const task = await context.memory.get("current_task")
console.log(`Resuming: ${task.value.name}`)
```

### Project Knowledge Base

```typescript
// Store project decisions and conventions
await context.memory.set(
  "naming_convention",
  {
    files: "kebab-case",
    components: "PascalCase",
    functions: "camelCase",
    constants: "UPPER_SNAKE_CASE",
  },
  {
    tags: ["convention", "project", "documentation"],
  }
)

// Query project knowledge
const conventions = await context.memory.search({
  tags: ["convention", "project"],
})
```

## API Reference

### MemoryContext

```typescript
interface MemoryContext {
  set(
    key: string,
    value: unknown,
    options?: {
      tags?: string[]
      expiresAt?: Date
    }
  ): Promise<Memory>

  get(key: string): Promise<Memory | null>

  search(options: {
    query?: string
    tags?: string[]
    limit?: number
    before?: Date
    after?: Date
  }): Promise<Memory[]>

  delete(key: string): Promise<boolean>

  clear(tags?: string[]): Promise<number>
}
```

### Memory

```typescript
interface Memory {
  id: string
  key: string
  value: unknown
  metadata?: {
    createdAt: Date
    updatedAt: Date
    expiresAt?: Date
    tags?: string[]
  }
}
```

## Best Practices

1. **Use semantic tags** - Tag memories with multiple relevant categories for better retrieval
2. **Set expiration** - Use `expiresAt` for temporary data to prevent memory bloat
3. **Consistent keys** - Use predictable key patterns (e.g., `user_${id}_preference`)
4. **Structured values** - Store objects, not strings, for richer context
5. **Search with limits** - Always set reasonable limits to avoid performance issues

## Philosophy

**Syner = SDK + Opinions**

- SDK provides primitives (`DefaultContextAgent`, `MemoryContext`)
- Syner provides implementations (`SynerMemoryContext`) with sensible defaults
- SDK is unopinionated, Syner is opinionated
- For full control, use SDK directly. For quick start, use Syner.

## What's Next

This implementation establishes the pattern for all Context APIs:

- `context.memory` ✅ (implemented)
- `context.apps` (coming soon)
- `context.git` (coming soon)
- `context.storage` (coming soon)
- `context.cache` (coming soon)
- `context.vector` (coming soon)

Each API follows the same pattern: SDK defines interface, Syner implements with defaults.
