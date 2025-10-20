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

- Each `.ts` file = public API
- Each folder = namespace grouping related APIs
- Flat hierarchy (max 2 levels)

## Discovery

```bash
tree src/ -L 1              # See all namespaces
tree src/<namespace>/ -L 1  # See namespace APIs
```

Structure IS documentation. No need to read code to understand what exists.

## Usage

```ts
// Namespace access
import { system } from "syner";
system.preferences.get();

// Direct API access
import { preferences } from "syner/system";
preferences.get();
```

## Namespaces

**Agent Loop:**

- `context/` - info gathering (side-effect free)
- `actions/` - execution (side effects)
- `checks/` - verification (validation only)

**Orchestration:**

- `agents/` - orchestrators (planner, orchestrator)

**Infrastructure:**

- `system/` - infrastructure (env, preferences, registry, sandbox, mcp, settings, collaboration, installer)
- `loop/` - loop control flow (approval, retries, timeout, cancel)

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
