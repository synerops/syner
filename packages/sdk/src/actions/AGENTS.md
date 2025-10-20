# Actions API

> Implements the `actions` contract from the OS Protocol.

## Purpose

Execute operations with side effects based on gathered context.

## API Hierarchy

```
actions/
├── tools.ts          (tool integrations)
├── ops.ts            (system operations)
└── mcp-client.ts     (MCP protocol client)
```

## Integration Points

This API is designed to integrate with:

- **External tools** via `tools.ts`
- **System operations** via `ops.ts`
- **MCP servers** via `mcp-client.ts`

## Directives

**MUST** have side effects - this is the execution phase

**MUST** operate on context gathered from the context API

**MUST** be verifiable - actions should produce results that can be checked

**SHOULD** be idempotent when possible

**NEVER** gather context directly - use the context API

**NEVER** verify results - that's the responsibility of the checks API

## Error Handling

**MUST** throw on failure with descriptive errors including operation context

```typescript
// ✅ Good: descriptive error with context
throw new Error(`Failed to delete file: ${path}`);

// ❌ Bad: generic error
throw new Error("Operation failed");
```
