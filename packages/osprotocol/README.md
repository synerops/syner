# @syner/osprotocol

> Type definitions, runtime validators, and a SKILL.md parser for the agent execution protocol lifecycle.

## Quick Start

```bash
bun add @syner/osprotocol
```

```typescript
import {
  createContext, createAction, createResult, createRun,
  updateRunStatus,
  verify, escalate, checkPreconditions,
  validateContext, validateAction, validateResult, validateRun,
  parseSkillManifest,
  type Context, type Action, type Result, type Run, type SkillManifest,
} from '@syner/osprotocol'
```

Single import path: `@syner/osprotocol`. No subpath exports.

## Key Features

- **Protocol types** -- Context, Action, Verification, Result, Run with full TypeScript definitions
- **Factory functions** -- `createContext()`, `createAction()`, `createResult()`, `createRun()` with safe defaults
- **Run state machine** -- 9 states with guarded transitions via `updateRunStatus()`
- **Runtime validators** -- Type guards for untrusted data (`validateContext()`, `validateResult()`, etc.)
- **Verification engine** -- `verify()` maps expected effects to actual results, `escalate()` generates escalations
- **SKILL.md parser** -- `parseSkillManifest()` extracts structured data from skill markdown files

## Usage

### Create and verify a result

```typescript
import { createContext, createAction, verify, createResult } from '@syner/osprotocol'

const ctx = createContext({ agentId: 'syner/bot', skillRef: '/deploy' })
const action = createAction({
  description: 'Deploy to production',
  expectedEffects: [{ description: 'deployment live', verifiable: true }],
})
const v = verify(action.expectedEffects, { 'deployment live': true })
const result = createResult(ctx, action, v, 'Deployed successfully')
```

### Run state machine

```typescript
import { createRun, updateRunStatus } from '@syner/osprotocol'

let run = createRun({ id: 'run-001' })          // status: 'pending'
run = updateRunStatus(run, 'running')             // ok
run = updateRunStatus(run, 'completed')           // ok
run = updateRunStatus(run, 'running')             // throws: terminal state
```

### Validate untrusted data

```typescript
import { validateResult } from '@syner/osprotocol'

const data: unknown = JSON.parse(untrustedPayload)
if (validateResult(data)) {
  console.log(data.verification.status)  // typed as Result
}
```

### Parse SKILL.md

```typescript
import { parseSkillManifest } from '@syner/osprotocol'

const { skill, warnings } = parseSkillManifest(markdownContent)
// skill.name, skill.preconditions, skill.effects, etc.
```

## Dependencies

| Package | Why | Type |
|---------|-----|------|
| `gray-matter` | Frontmatter parsing in `parseSkillManifest()` | Runtime |

No other runtime dependencies. No peer dependencies.

## Status

| Area | Status |
|------|--------|
| Types, factory functions | Stable. Consumed by `@syner/sdk`, `@syner/ops`, `syner.bot`. |
| Validators | Stable. Hand-written type guards, zero dependencies. |
| Run state machine | Stable. 9 states, guarded transitions. |
| Verification engine | Stable. `verify()` and `escalate()` in production use. |
| SKILL.md parser | Stable with caveat: depends on `gray-matter`. |
| JSON Schema / Zod export | Not implemented. Validators are hand-written. |

See [AGENTS.md](./AGENTS.md) for the full API reference, type definitions, and constraints.
