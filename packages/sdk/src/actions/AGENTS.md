# Actions API

> Implements the `actions` contract from the OS Protocol.

## Purpose

Register and manage agent capabilities - tools and integrations that agents can execute.

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

**MUST** register as tools (AI SDK) or MCP servers

**MUST** provide clear descriptions for LLM usage

**MUST** be verifiable - produce results that can be checked

**SHOULD** be idempotent when possible

**NEVER** gather context - use the context API

**NEVER** validate results - use the checks API

## Error Handling

**MUST** throw on failure with descriptive errors including operation context

```typescript
// ✅ Good: descriptive error with context
throw new Error(`Failed to delete file: ${path}`);

// ❌ Bad: generic error
throw new Error("Operation failed");
```
