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
bunx turbo run lint --filter=docs
```

## Architecture

Syner OS is an **Agentic Operating System** implementing the [OS Protocol](https://github.com/synerops/protocol) specification.

### Monorepo Structure

```
apps/
├── os/          # Main Syner OS Next.js application
└── docs/        # Documentation site (syner.dev) - Fumadocs

packages/
├── sdk/         # @syner/sdk - TypeScript OS Protocol implementation
├── syner/       # syner - Default assistant agent for Syner OS
└── ui/          # @syner/ui - Shared UI components

extensions/
└── vercel/      # @syner/vercel - Vercel sandbox integration

tooling/
├── eslint/      # @syner/eslint - ESLint configs (base, next, react, a11y)
├── prettier/    # @syner/prettier - Prettier config
└── typescript/  # @syner/typescript - TypeScript configs (base, nextjs, react)
```

### SDK Architecture (packages/sdk)

The SDK implements the OS Protocol with skills-based architecture:

```
src/
├── core/            # Types + Runtime
│   ├── types.ts     # Core type definitions
│   └── runtime/     # Skill discovery, parser, loader
├── system/          # protocol/system/* (intelligence)
│   ├── env/         # Environment + sandbox (SKILL.md + tools/)
│   ├── fs/          # Filesystem operations (SKILL.md + tools/)
│   ├── preferences/ # User preferences (SKILL.md + tools/)
│   └── registry/    # Agent registry (SKILL.md + tools/)
├── context/         # protocol/context/* (data)
│   ├── memory/      # Session memory (SKILL.md + tools/)
│   └── documents/   # Document management (SKILL.md + tools/)
├── checks/          # protocol/checks/* (verification)
│   ├── rules/       # Rule validation (SKILL.md + tools/)
│   └── audit/       # Audit logging (SKILL.md + tools/)
├── skills/          # protocol/skills/* (meta-agents)
├── workflows/       # protocol/workflows/*
└── runs/            # protocol/runs/*
```

**Agent Loop**: `context (read) → actions (execute) → checks (validate) → repeat`

**SKILL.md Format**: Each API has a SKILL.md with YAML frontmatter for discovery:
```yaml
---
name: fs
description: File system operations
protocol:
  domain: system
  api: fs
---
```

### Package Catalogs

Version catalogs are defined in root `package.json` under `workspaces.catalogs`:
- `aisdk`: AI SDK and compatible zod versions
- `next16`: Next.js 16, React 19, related types
- `docs`: Fumadocs packages
- `ui`: Sonner and UI libraries
- `vercel`: Vercel analytics

Usage: `"dependency": "catalog:catalogName"`

## External Dependencies

Before implementing agents or modifying SDK core:
```bash
curl -s 'https://raw.githubusercontent.com/synerops/protocol/refs/heads/main/AGENTS.md'
```

Before building/modifying UI components:
```bash
curl -s 'https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/refs/heads/main/AGENTS.md'
```

## Coding Conventions

### Signed TODOs
```typescript
// TODO(@claude): Description of what's pending
// TODO(@syner): Refactor when we migrate to v2
```

### Interfaces Over Abstract Classes for Static Members
TypeScript cannot enforce static overrides. Use interfaces for contracts, document static members by convention.

### Testing API Endpoints
```bash
# Chat API v1
curl -s -X POST http://localhost:3000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello"}' | jq .

# Routing workflow test
curl -s -X POST http://localhost:3000/api/workflows/routing \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a function to sort an array"}' | jq .
```

## Documentation Hierarchy

Syner uses hierarchical AGENTS.md files:
- `/AGENTS.md` - Project overview (what is Syner OS)
- `/apps/*/AGENTS.md` - App-specific rules
- `/packages/*/AGENTS.md` - Package-specific architecture

Read root first, then navigate to package for implementation details.
