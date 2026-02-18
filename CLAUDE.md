# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
bun install

# Development (all apps/packages in parallel)
bun run dev

# Build all packages
bun run build

# Lint, typecheck, format
bun run lint
bun run typecheck
bun run format

# Run commands for specific packages using turbo filter
bunx turbo run dev --filter=os
bunx turbo run build --filter=@syner/sdk
bunx turbo run lint --filter=dev
```

## Architecture

Syner OS is an **Agentic Operating System** implementing the [OS Protocol](https://github.com/synerops/osprotocol) specification.

### OS Protocol (`@osprotocol/schema`)

The protocol is the single source of truth for all capability interfaces. Published on npm as `@osprotocol/schema`.

**Extensions import interfaces from the protocol directly, NOT from `@syner/sdk`:**

```typescript
// Correct — import from the protocol
import type { Kv } from '@osprotocol/schema/context/kv'

// Wrong — do not import interfaces from the SDK
import type { Kv } from '@syner/sdk/context/kv'
```

The SDK re-exports protocol types for convenience, but extensions should always reference the protocol directly. The SDK provides default implementations (e.g., `createMemoryKv`), not the interfaces.

### Monorepo Structure

```
apps/
├── os/          # Main Syner OS Next.js application (port 3000)
├── dev/         # Developer hub (syner.dev) - Auth, APIs, Devkit, Docs (port 3002)
└── design/      # Design system documentation (port 3003)

packages/
├── sdk/         # @syner/sdk - TypeScript OS Protocol implementation
├── syner/       # syner - Default assistant agent for Syner OS
└── ui/          # @syner/ui - Shared UI components

extensions/
├── github/      # @syner/github - GitHub OAuth and API integration
├── upstash/     # @syner/upstash - Upstash Redis KV implementation
└── vercel/      # @syner/vercel - Vercel sandbox integration

tooling/
├── eslint/      # @syner/eslint - ESLint configs (base, next, react, a11y)
├── prettier/    # @syner/prettier - Prettier config
└── typescript/  # @syner/typescript - TypeScript configs (base, nextjs, react)
```

### SDK Architecture (packages/sdk)

The SDK implements the OS Protocol with direct tool implementations:

```
src/
├── lib/             # Runtime infrastructure (NOT part of protocol)
│   ├── types.ts     # Runtime types
│   ├── config.ts    # Configuration
│   └── security.ts  # Path validation and security
├── workflows/       # Workflow pattern implementations
│   ├── routing.ts         # Classify → delegate
│   ├── orchestrator-workers.ts
│   ├── parallelization.ts
│   └── evaluator-optimizer.ts
├── system/          # protocol/system/* (intelligence)
│   ├── env/         # Environment + sandbox
│   ├── fs/          # Filesystem operations (placeholder)
│   ├── preferences/ # User preferences (placeholder)
│   └── registry/    # Agent registry
├── context/         # protocol/context/* (data)
│   ├── kv/          # Key-value store (memory implementation)
│   ├── memory/      # Session memory
│   └── documents/   # Document management
├── checks/          # protocol/checks/* (verification)
│   ├── rules/       # Rule validation
│   └── audit/       # Audit logging
├── agents/          # Meta-agents for orchestration
└── runs/            # protocol/runs/*
```

**Agent Loop**: `context (read) → actions (execute) → checks (validate) → repeat`

### Package Catalogs

Version catalogs are defined in root `package.json` under `workspaces.catalogs`:
- `aisdk`: AI SDK and compatible zod versions
- `next16`: Next.js 16, React 19, related types
- `docs`: Fumadocs packages
- `ui`: Sonner and UI libraries
- `vercel`: Vercel analytics
- `osprotocol`: `@osprotocol/schema` (capability interfaces)

Usage: `"dependency": "catalog:catalogName"`

## Environment Variables

For `apps/dev` and extensions, copy `.env.example` to `.env.local`:

```bash
# GitHub OAuth (@syner/github)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# GitHub App - server-to-server
GITHUB_APP_ID=
GITHUB_PRIVATE_KEY=

# Upstash Redis (@syner/upstash)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## External Dependencies

Before implementing agents or modifying SDK core:
```bash
curl -s 'https://raw.githubusercontent.com/synerops/osprotocol/refs/heads/main/AGENTS.md'
```

## Conventions

### Imports
- Extensions import interfaces from `@osprotocol/schema`, not SDK
- Apps import implementations from SDK or extensions
- Use catalog versions for consistency

### Testing
- Run `bun run typecheck` before committing
- Use `bunx turbo run build --filter=<package>` to test specific packages

### Code Style
- ESLint and Prettier configs are shared from `/tooling`
- No console.log in production code (use structured logging when available)

## Important Notes

1. **Protocol is immutable**: Never modify interfaces from `@osprotocol/schema`
2. **SDK provides defaults**: Extensions replace SDK implementations
3. **Direct tool loading**: No discovery system, tools are loaded directly
4. **KV not Cache**: Use Kv interface from OSP, not legacy Cache