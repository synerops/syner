# Syner OS

## What is Syner OS?

Syner OS is a **Semantic and Agentic Operating System** where:
1. Users can create and orchestrate AI agents
2. **Syner** (default agent) is a meta-orchestrator that chooses workflow patterns
3. The "source code" of Syner are `.md` files (SKILL.md, AGENT.md, etc.)
4. Users modify these files to customize behavior

## Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    OS PROTOCOL                              │
│                 (Defines CONTRACTS)                         │
│                                                             │
│  - TypeScript interfaces in @osprotocol/schema              │
│  - "A Filesystem MUST have readFile(), writeFile()"         │
│  - Agnostic to implementation                               │
│  - The "law" that everyone must follow                      │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ implements
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       SDK                                   │
│            (DEFAULT Implementation)                         │
│                                                             │
│  - @syner/sdk provides base workflow classes                │
│  - lib/: Runtime (parser, loader, discovery)                │
│  - Works out-of-the-box without extensions                  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ can replace
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTENSIONS                               │
│           (ALTERNATIVE Implementations)                     │
│                                                             │
│  @syner/vercel:                                             │
│    - VercelFilesystem (uses Vercel API)                     │
│    - VercelSandbox (secure execution)                       │
│                                                             │
│  Other vendors can create their own extensions              │
└─────────────────────────────────────────────────────────────┘
```

**Key Rule**: Protocol defines contracts, SDK implements defaults, Extensions replace.

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
│       ├── lib/             # Runtime infrastructure (NOT part of protocol)
│       │   ├── parser.ts    # Parses .md files (SKILL.md, AGENT.md)
│       │   ├── loader.ts    # Loads tools dynamically
│       │   ├── discovery.ts # Discovers skills/agents
│       │   └── types.ts     # SDK-specific types
│       ├── system/          # protocol/system/* (env, fs, preferences, registry)
│       ├── context/         # protocol/context/* (memory, documents)
│       ├── actions/         # protocol/actions/* (tools, ops)
│       ├── checks/          # protocol/checks/* (rules, audit)
│       ├── skills/          # protocol/skills/* (orchestrator, planner, executor)
│       ├── workflows/       # protocol/workflows/* implementations
│       └── runs/            # protocol/runs/* control
│
├── syner/                   # Default orchestrator agent
│   ├── AGENT.md             # Syner as agent definition
│   ├── PERSONALITY.md       # Default personality
│   ├── RULES.md             # Default rules
│   └── src/                 # AI SDK-specific implementations
│
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
