# Syner OS

## What is Syner OS?

Syner OS is an **Agentic Operating System** - a platform where AI agents operate following systematic patterns to gather context, execute actions, and verify results in a continuous loop.

## Architecture

- **OS Protocol** (separate spec) - Defines the agent loop contract
- **@syner/sdk** - TypeScript implementation of the protocol
- **syner** - Assistant Agent created by default in Syner OS

## Documentation Hierarchy

Syner uses hierarchical AGENTS.md files to avoid redundancy:

- `/AGENTS.md` (this file) - Project overview, what is Syner OS
- `/apps/*/AGENTS.md` - App-specific architecture and rules
- `/packages/*/AGENTS.md` - Package-specific architecture and rules

**Rules:**

- Root AGENTS.md = context ("what is this?")
- Package AGENTS.md = architecture ("how does it work?")
- NEVER duplicate information across levels
- Read root first, then navigate to package for details

## OS Protocol Specification

**IMPORTANT**: Before implementing agents, modifying the SDK, or working with the agent loop (context/actions/checks), you MUST fetch and understand the OS Protocol specification.

**When to fetch the protocol**:

- Before building new agents
- Before modifying SDK core functionality
- When implementing context/actions/checks APIs
- When working on the agent loop or orchestration
- When you need to understand the contract that all agents must follow

**How to fetch**:
Run this command to get the latest protocol specification (only fetch when needed to save tokens):

```bash
curl -s --location 'https://raw.githubusercontent.com/synerops/protocol/refs/heads/main/AGENTS.md' \
--header 'Accept: text/markdown'
```

The protocol defines:

- The agent loop contract (context → actions → checks → repeat)
- MUST/NEVER rules that all implementations must follow
- Interface contracts for Agent, Context, Action, and Check primitives
- Communication patterns between agents

## Web Interface Guidelines

**IMPORTANT**: Before building, modifying, or reviewing ANY user interface component, form, interaction, or visual element, you MUST fetch and follow Vercel's Web Interface Guidelines.

**When to fetch the guidelines**:

- Before creating new UI components
- Before modifying existing interfaces
- When reviewing UI/UX code
- When implementing forms, animations, or interactions
- When working on accessibility features

**How to fetch**:
Run this command to get the latest guidelines (only fetch when needed to save tokens):

```bash
curl -s --location 'https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/refs/heads/main/AGENTS.md' \
--header 'Accept: text/markdown'
```

These guidelines use MUST/SHOULD/NEVER terminology and cover:

- Interactions (keyboard, forms, navigation, feedback)
- Animation (accessibility, performance)
- Layout (responsive, alignment)
- Content & Accessibility (a11y, semantics)
- Performance (rendering, optimization)
- Design (contrast, shadows, colors)

## Coding Best Practices

### Interfaces Over Abstract Classes for Static Members

TypeScript does not support `override` for static members. When you need to enforce static properties on subclasses:

- **DO**: Use interfaces to define the contract
- **DON'T**: Declare static members in abstract classes expecting subclasses to override them

```typescript
// ✅ Correct approach - interface for instance contract, statics by convention
export interface Agent<Output, Config> {
  config: Config
  execute(input: unknown): Promise<Output>
}

class MyAgent implements Agent<string, MyConfig> {
  static readonly name = 'MyAgent'
  static readonly description = 'Does something useful'
  static readonly metadata: Metadata = { annotations: { ... } }

  constructor(public config: MyConfig) {}

  async execute(input: unknown): Promise<string> {
    // implementation
  }
}

// ❌ Wrong approach - TypeScript can't enforce static overrides
export abstract class Agent {
  static readonly name: string  // Subclasses can't use `override`
}
```

### Signed TODOs

All TODOs MUST be signed with the author's identifier for traceability:

```typescript
// ✅ Correct
// TODO(@claude): Awaiting Ronny's approval - description of what's pending

// ✅ Correct
// TODO(@syner): Refactor this when we migrate to v2

// ❌ Wrong - unsigned TODO
// TODO: Fix this later
```

## Project Structure

This monorepo contains:

```
apps/
├── os/                      # syner.app + syner.bot (API at /api/v1/*)
└── docs/                    # syner.dev (documentation)

packages/
├── sdk/                     # @syner/sdk - OS Protocol implementation
│   └── src/
│       ├── system/          # protocol/system/* (env, fs, preferences, registry)
│       ├── context/         # protocol/context/* (memory, documents)
│       ├── actions/         # protocol/actions/* (tools, ops)
│       ├── checks/          # protocol/checks/* (rules, audit)
│       ├── skills/          # protocol/skills/* (orchestrator, planner, executor)
│       ├── workflows/       # protocol/workflows/*
│       ├── runs/            # protocol/runs/*
│       └── core/            # Types + Runtime (discovery, parser, loader)
│
├── syner/                   # Default orchestrator agent
└── ui/                      # @syner/ui - Shared components

extensions/
└── vercel/                  # @syner/vercel - Vercel sandbox integration
    └── src/system/sandbox/  # Extends SDK system/

tooling/                     # eslint, prettier, typescript configs
```

**Domains:**
- `syner.app` → apps/os (UI + API)
- `syner.bot` → apps/os/api/v1/* (same deploy, different domain)
- `syner.dev` → apps/docs

## Skills Architecture

Skills use the SKILL.md format (inspired by Anthropic Skills) for discovery and loading:

```yaml
---
name: fs
description: File system operations
protocol:
  domain: system
  api: fs
---

# Filesystem

## Capabilities
- Read files and directories
- Write and create files

## When to Use
- User needs to read or write files
```

Each skill directory contains:
- `SKILL.md` - Skill metadata and documentation
- `tools/` - AI SDK tool implementations
- `index.ts` - Module exports
