# Context API

## Purpose

Build knowledge and understanding by gathering, storing, and retrieving information.

## API Hierarchy

```
context/
├── apps.ts       (application context)
├── system.ts     (system state)
├── storage.ts    (persistent storage)
├── cache.ts      (cached data)
├── vector.ts     (vector search)
├── dataset.ts    (dataset access)
└── reasoning.ts  (reasoning and LLM context)
```

## Integration Points

This API is designed to integrate with:

- **Applications** via `apps.ts`
- **System state** via `system.ts`
- **Storage backends** via `storage.ts`, `cache.ts`, `dataset.ts`
- **Vector databases** via `vector.ts`
- **LLM reasoning** via `reasoning.ts`

## Directives

**DOES:**
- Read from sources (filesystem, git, databases, APIs)
- Store contextual knowledge (memory, cache)
- Search and retrieve information
- Provide information for action execution

**DOES NOT:**
- Execute real-world operations (use actions API)
- Modify external systems
- Send notifications or trigger workflows

**SHOULD** be fast - context gathering should not block the agent loop
