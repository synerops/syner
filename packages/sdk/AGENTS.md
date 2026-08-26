# @syner/sdk

This SDK provides TypeScript implementations of the [OS Protocol](https://github.com/synerops/protocol) specification.

## Architecture

The SDK is the middle layer in the three-tier architecture:

```
Protocol (contracts) → SDK (default impl) → Extensions (replacements)
```

### Directory Structure

```
src/
├── lib/                    # Runtime infrastructure (NOT part of protocol)
│   ├── types.ts           # SkillMetadata, SkillDefinition, LoadedSkill
│   ├── parser.ts          # Parses .md files (YAML frontmatter)
│   ├── loader.ts          # Dynamic tool loading
│   ├── discovery.ts       # SKILL.md discovery
│   └── index.ts
│
├── workflows/             # Workflow pattern implementations
│   ├── routing.ts         # Classify → delegate
│   ├── orchestrator-workers.ts  # Plan → delegate → synthesize
│   ├── parallelization.ts # Split → parallel → merge
│   ├── evaluator-optimizer.ts   # Generate → evaluate → optimize
│   └── index.ts
│
├── runs/                  # Run control
│   └── protocol/          # Run, Execution, Timeout, Retry, Cancel, Approval
│
├── system/                # protocol/system/*
│   ├── env/               # Environment + sandbox
│   ├── fs/                # Filesystem (placeholder)
│   ├── preferences/       # User preferences
│   └── registry/          # Agent registry
│
├── context/               # protocol/context/*
│   ├── memory/            # Session memory
│   └── documents/         # Document management
│
├── checks/                # protocol/checks/*
│   ├── rules/             # Rule validation
│   └── audit/             # Audit logging
│
├── skills/                # Meta-agents (commented out)
├── actions/               # Action definitions
├── agents/                # Agent type definitions
└── index.ts
```

## Key Concepts

### lib/ vs Protocol Domains

**lib/** contains runtime infrastructure that is NOT part of the OS Protocol:
- Parser, Loader, Discovery are SDK implementation details
- Extensions do NOT replace `lib/`
- Extensions replace protocol domains (`system/`, `context/`, `checks/`)

### Workflow Patterns

SDK provides base implementations of [Anthropic's workflow patterns](https://www.anthropic.com/engineering/building-effective-agents):

| Pattern | Class | Use Case |
|---------|-------|----------|
| Routing | `Routing<T>` | Classify and delegate |
| Orchestrator-Workers | `OrchestratorWorkers<T>` | Multi-step with workers |
| Parallelization | `Parallelization<T>` | Independent subtasks |
| Evaluator-Optimizer | `EvaluatorOptimizer<T>` | Iterative refinement |

### SKILL.md Format

```yaml
---
name: fs
description: File system operations
protocol:
  domain: system
  api: fs
---
```

## Exports

```typescript
// Main entry
import { Routing, env, discoverSkills } from '@syner/sdk'

// Subpath exports
import { Routing } from '@syner/sdk/workflows'
import { Timeout, Retry } from '@syner/sdk/runs'
import { discoverSkills } from '@syner/sdk/lib'
```

## Rules

**MUST:**
- `context/` APIs = read-only (gather information)
- `actions/` APIs = tools and capabilities (execute)
- `checks/` APIs = validation only (verify)
- Follow loop: context → actions → checks → repeat

**NEVER:**
- Nest APIs deeper than 2 levels
- Create implementation detail folders in `src/` outside `lib/`
- Mix protocol domains (e.g., don't put actions in context/)
