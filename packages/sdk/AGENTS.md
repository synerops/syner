# Syner OS

This SDK implements the [OS Protocol](https://github.com/synerops/protocol) specification in TypeScript.
The MUST/NEVER rules below enforce protocol contracts.

## Architecture

**Everything is an API.**

Hierarchy: `namespace/ → api.ts`

```
src/
├── system/           namespace
│   ├── env.ts        ← API
│   └── preferences.ts ← API
├── context/          namespace
│   └── apps.ts       ← API
└── ...
```

**Characteristics:**
- Each folder = domain with specific responsibility
- Each `.ts` file = public API
- Flat hierarchy (max 2 levels)
- Follow protocol loop: context → actions → checks

### Layer 2: Skills (Meta-agents)

Orchestration patterns that compose domain APIs to implement complex workflows.

```
src/
└── skills/           ← Meta-agents for orchestration
    ├── orchestrator.ts   ← Coordinates domain APIs
    ├── classifier.ts     ← Decides task routing
    ├── planner.ts        ← Generates execution plans
    ├── coordinator.ts    ← Coordinates multi-step tasks
    └── summarizer.ts     ← Summarizes results
```

**Characteristics:**
- Each skill can use: context → actions → checks
- Skills are independent of each other
- Skills compose domain APIs, not other skills
- Orchestrator coordinates skills, doesn't impose flow

### Layer 3: Syner Factories (User API)

Opinionated defaults in the `syner` package for quick start.

```
syner/src/
├── context/          ← createContextAgent()
├── actions/          ← createActionsAgent()
└── fullstack/        ← createFullstackAgent()
```

**Characteristics:**
- Factories compose SDK primitives with best practices
- Users choose composition level (single agent vs orchestrated)
- Advanced users can use SDK primitives directly

## Discovery

```bash
# See all domain APIs
tree src/ -L 1

# See specific domain API
tree src/context/ -L 1

# See orchestration skills
tree src/skills/ -L 1
```

Structure IS documentation. No need to read code to understand what exists.

## Usage

```ts
// Layer 3: Quick start with factories (recommended)
import { createContextAgent } from "syner"
const agent = createContextAgent()

// Layer 2: Custom orchestration
import { DefaultOrchestrator } from "@syner/sdk/skills"
const orchestrator = new DefaultOrchestrator({ ... })

// Layer 1: Direct API access (advanced)
import { memory } from "@syner/sdk/context"
await memory.set("key", "value")
```

## Domain APIs

**Agent Loop (follow protocol):**

- `context/` - knowledge & information (gather, store, retrieve)
- `actions/` - real-world execution (files, APIs, workflows)
- `checks/` - validation (verify conditions and states)

**Infrastructure:**

- `system/` - infrastructure (env, preferences, registry, sandbox, mcp)
- `workflows/` - workflow definitions and execution
- `runs/` - run tracking and history

## Rules

**MUST:**

- `context/` APIs = read-only (gather information)
- `actions/` APIs = tools and capabilities (execute)
- `checks/` APIs = validation only (verify)
- Follow loop: context → actions → checks → repeat
- Agents depend only on namespace APIs, never on other agents

**NEVER:**

- Nest APIs deeper than 2 levels
- Break the namespace/API import contract
- Create implementation detail folders in `src/`

## Flow

context (read) → actions (execute tools) → checks (validate) → repeat
