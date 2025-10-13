# Context API

## Purpose

Gather information without side effects before making decisions.

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

**MUST** be side-effect free - only query and retrieve information

**MUST** provide information for action execution

**SHOULD** be fast - context gathering should not block the agent loop

**NEVER** modify state - that's the responsibility of the actions API

**NEVER** perform operations - only provide data
