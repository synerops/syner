# Context API

> Implements the `context` contract from the OS Protocol.

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
└── dataset.ts    (dataset access)
```

## Integration Points

This API is designed to integrate with:

- **Applications** via `apps.ts`
- **System state** via `system.ts`
- **Storage backends** via `storage.ts`, `cache.ts`, `dataset.ts`
- **Vector databases** via `vector.ts`

## Directives

**MUST** be read-only - only query and retrieve information

**MUST** provide information for action execution

**SHOULD** be fast - context gathering should not block the agent loop

**NEVER** modify state - that's the responsibility of the actions API

**NEVER** perform operations - only provide data

## Error Handling

**MUST** return null/undefined for missing data, throw only for system errors (network, permissions)

```typescript
// ✅ Good: return null for missing data
const app = await context.apps.get(id);
if (!app) return null;

// ❌ Bad: throw for missing data
if (!app) throw new Error("Not found");
```
