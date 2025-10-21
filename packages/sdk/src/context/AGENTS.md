# Context API

> Knowledge and information gathering layer

## Purpose

Gather, store, and retrieve information to build understanding. Context enriches the agent's knowledge without executing real-world operations.

## API Registry Pattern

Context APIs are registered and discovered dynamically:

- `memory` - Store/retrieve cross-interaction context
- `apps` - Application state
- `git` - Version control information
- `storage` - Persistent data
- `cache` - Cached data
- `vector` - Semantic search
- `dataset` - Dataset access

## Registration

```typescript
const agent = new DefaultContextAgent({ model: "..." });
agent.registerAPI("memory", memoryAPI);
// API accessible as: agent.memory.get()
```

Memory supports pluggable providers (InMemory, Redis, DynamoDB, etc). Implement `MemoryContext` or extend `DefaultMemoryProvider`.

## Guidelines

Guidelines make reasoning predictable by mapping conditions to APIs:

```typescript
agent.createGuideline({
  condition: "User asks to remember something",
  action: "Store in memory with tags",
  apis: ["memory"],
  priority: 100
});
```

## What Context Does

**DOES:**
- Read from sources (filesystem, git, databases, APIs)
- Store contextual knowledge (memory, cache)
- Search and retrieve information (vector, semantic)
- Build understanding over time

**DOES NOT:**
- Execute real-world operations (use actions API)
- Modify external systems
- Send notifications or trigger workflows

**MUST** return null for missing data (throw only for system errors)

## Output

```typescript
{ data: {...}, sources: ["memory", "git"], confidence: 0.95 }
```
