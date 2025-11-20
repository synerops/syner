# System

## Purpose

Provide infrastructure that enables OS Protocol implementation.

## Hierarchy

```
system/
├── context/          (information gathering API)
├── actions/          (execution API)
├── checks/           (verification API)
├── types.ts          (type definitions)
├── registry.ts       (component registry)
├── preferences.ts    (user preferences)
├── settings.ts       (system settings)
├── env.ts            (environment variables)
├── installer.ts      (installation logic)
├── mcp-server.ts     (MCP protocol server)
├── sandbox/          (sandbox protocol)
│   ├── protocol.ts   (vendor-agnostic contract)
│   └── index.ts      (exports)
└── collaboration.ts  (collaboration features)
```

## Structure

System contains two main categories:

### Agent Loop APIs

- **context/** - Gather information (see context/AGENTS.md)
- **actions/** - Execute operations (see actions/AGENTS.md)
- **checks/** - Verify results (see checks/AGENTS.md)

### Infrastructure

- **types.ts** - Base type definitions
- **registry.ts** - Component registry
- **preferences.ts, settings.ts, env.ts** - Configuration
- **mcp-server.ts** - MCP protocol server
- **sandbox/** - Sandbox protocol (vendor-agnostic contract)
  - **protocol.ts** - Defines `Sandbox` interface and `SandboxOptions`
  - Vendor-specific implementations go in extensions (e.g., `extensions/vercel`)
- **collaboration.ts** - Multi-agent collaboration

## Integration Points

System is used by:

- **agents/** - Orchestrate the loop using system APIs
- **External integrations** - Via MCP server and registry

## Directives

**MUST** provide stable interfaces - changes here impact all agents

**MUST** respect API boundaries - each API has its own AGENTS.md with specific rules

**SHOULD** be self-contained - system does not depend on agents

**NEVER** depend on agents/ - agents depend on system, never reverse

**NEVER** bypass API contracts - follow the directives in nested AGENTS.md files

## Sandbox Protocol

The sandbox protocol defines a vendor-agnostic contract for executing agent logic in isolated environments.

- **Protocol**: Defined in `sandbox/protocol.ts` as `Sandbox` interface
- **Implementations**: Vendor-specific implementations go in extensions (e.g., `@syner/vercel`)
- **Usage**: Sandboxes are ephemeral - created for a run, destroyed after execution
- **Export**: Protocol is exported from root: `import { Sandbox } from "@syner/sdk"`

See `sandbox/protocol.ts` for the complete interface definition.
