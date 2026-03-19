# @syner/osprotocol

> Type definitions, runtime validators, and a SKILL.md parser for the agent execution protocol lifecycle.

## Exports

```typescript
import {
  // Types
  type Context,
  type ContextSource,
  type Action,
  type Precondition,
  type Effect,
  type Verification,
  type Assertion,
  type Escalation,
  type Result,
  type Run,
  type RunStatus,
  type RunActivity,
  type Progress,
  type Timeout,
  type Retry,
  type Approval,
  type SkillManifest,
  type InputField,
  type OutputField,
  type ParseResult,

  // Factory functions
  createContext,
  createAction,
  createResult,
  createRun,

  // State machine
  updateRunStatus,

  // Verification
  verify,
  escalate,
  checkPreconditions,

  // Validators
  validateContext,
  validateAction,
  validateVerification,
  validateResult,
  validateRun,
  validateApproval,

  // Parser
  parseSkillManifest,

  // Deprecated aliases (do not use)
  type OspContext,    // use Context
  type OspAction,     // use Action
  type OspVerification, // use Verification
  type OspResult,     // use Result
  type SkillManifestV2, // use SkillManifest
} from '@syner/osprotocol'
```

There is one import path: `@syner/osprotocol`. No subpath exports exist.

## Types

### Context

Describes what an agent loaded before acting.

```typescript
interface ContextSource {
  type: 'vault' | 'file' | 'api' | 'skill'
  ref: string
  summary?: string
}

interface Context {
  agentId: string
  skillRef: string
  loaded: ContextSource[]
  missing: string[]
  timestamp: string       // ISO 8601
  parentContext?: string
}
```

### Action

Describes what an agent intends to do, with preconditions and expected effects.

```typescript
interface Precondition {
  check: string
  met: boolean
  detail?: string
}

interface Effect {
  description: string
  verifiable: boolean
}

interface Action {
  description: string
  preconditions: Precondition[]
  expectedEffects: Effect[]
  rollbackStrategy?: 'revert' | 'escalate' | 'noop'
}
```

### Verification

The outcome of checking expected effects against actual results.

```typescript
interface Assertion {
  effect: string
  result: boolean
  evidence?: string
}

interface Escalation {
  strategy: 'rollback' | 'escalate' | 'retry'
  target?: string
  reason: string
}

interface Verification {
  status: 'passed' | 'failed' | 'partial'
  assertions: Assertion[]
  escalation?: Escalation
}
```

### Result

A complete execution record: context + action + verification + output.

```typescript
interface Result<T = unknown> {
  context: Context
  action: Action
  verification: Verification
  output?: T
  duration: number    // milliseconds
  chain?: string
}
```

### Run

A stateful execution container with lifecycle management.

```typescript
type RunStatus =
  | 'pending'
  | 'running'
  | 'waiting_approval'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'timed_out'

type RunActivity = 'idle' | 'executing' | 'waiting' | 'thinking'

interface Progress {
  current: number
  total: number
  label?: string
}

interface Timeout {
  duration: number                      // milliseconds
  strategy: 'fail' | 'escalate' | 'cancel'
  target?: string
}

interface Retry {
  maxAttempts: number
  delay: number                         // milliseconds
  backoff?: 'linear' | 'exponential'
}

interface Approval {
  required: boolean
  reviewer?: string                     // agent ID
  decision?: 'approved' | 'rejected'
  reason?: string
  timestamp?: string                    // ISO 8601
}

interface Run<T = unknown> {
  id: string
  status: RunStatus
  results: Result<T>[]
  progress?: Progress
  approval?: Approval
  timeout?: Timeout
  retry?: Retry
  startedAt: string                     // ISO 8601
  completedAt?: string                  // ISO 8601
  chain?: string
  activity?: RunActivity
  lastHeartbeat?: string                // ISO 8601
}
```

### SkillManifest

Parsed representation of a SKILL.md file.

```typescript
interface InputField {
  name: string
  type: string
  required?: boolean
  description?: string
}

interface OutputField {
  name: string
  type: string
  description?: string
}

interface SkillManifest {
  name?: string
  description?: string
  category?: string
  metadata?: {
    version?: string
    author?: string
  }
  preconditions?: string[]
  effects?: string[]
  verification?: string[]
  inputs?: InputField[]
  outputs?: OutputField[]
  visibility?: 'public' | 'private' | 'instance'
  notFor?: string[]
}
```

## Functions

### createContext(partial)

```typescript
function createContext(
  partial: Partial<Context> & Pick<Context, 'agentId' | 'skillRef'>
): Context
```

Creates a `Context` with defaults: `loaded: []`, `missing: []`, `timestamp: new Date().toISOString()`. Override any field via `partial`.

```typescript
const ctx = createContext({ agentId: 'syner/bot', skillRef: '/deploy' })
// => { agentId: 'syner/bot', skillRef: '/deploy', loaded: [], missing: [], timestamp: '2026-03-14T...' }
```

### createAction(partial)

```typescript
function createAction(
  partial: Partial<Action> & Pick<Action, 'description'>
): Action
```

Creates an `Action` with defaults: `preconditions: []`, `expectedEffects: []`.

```typescript
const action = createAction({
  description: 'Deploy to production',
  expectedEffects: [{ description: 'deployment live', verifiable: true }],
})
```

### createResult(context, action, verification, output?)

```typescript
function createResult<T = unknown>(
  context: Context,
  action: Action,
  verification: Verification,
  output?: T
): Result<T>
```

Creates a `Result` with `duration: 0`. Set the real duration after execution completes.

### createRun(partial)

```typescript
function createRun(
  partial: Partial<Run> & Pick<Run, 'id'>
): Run
```

Creates a `Run` with defaults: `status: 'pending'`, `results: []`, `startedAt: new Date().toISOString()`.

### updateRunStatus(run, newStatus)

```typescript
function updateRunStatus(run: Run, newStatus: RunStatus): Run
```

Returns a new `Run` with the updated status. Throws `Error` if the transition is invalid.

Valid transitions:

```
pending         -> running
running         -> completed | failed | cancelled | waiting_approval | timed_out
waiting_approval -> approved | rejected
approved        -> running
rejected        -> cancelled | running
```

Terminal states (`completed`, `failed`, `cancelled`, `timed_out`) have no outbound transitions. Attempting an invalid transition throws `Error: Invalid transition from {current} to {target}`.

```typescript
let run = createRun({ id: 'run-001' })
run = updateRunStatus(run, 'running')     // ok: pending -> running
run = updateRunStatus(run, 'completed')   // ok: running -> completed
run = updateRunStatus(run, 'running')     // throws: completed has no outbound transitions
```

### checkPreconditions(action)

```typescript
function checkPreconditions(action: Action): { pass: boolean; unmet: Precondition[] }
```

Filters `action.preconditions` for entries where `met === false`. Returns `pass: true` when all preconditions are met. Does not evaluate conditions -- it reads the `met` field that the caller must set.

```typescript
const action = createAction({
  description: 'deploy',
  preconditions: [
    { check: 'tests pass', met: true },
    { check: 'branch is clean', met: false },
  ],
})
const { pass, unmet } = checkPreconditions(action)
// pass: false, unmet: [{ check: 'branch is clean', met: false }]
```

### verify(effects, results)

```typescript
function verify(
  effects: Effect[],
  results: Record<string, boolean>
): Verification
```

Maps each effect's `description` to a boolean in `results`. Missing keys default to `false`. Returns `status: 'passed'` when all assertions are true, `'failed'` when none are, `'partial'` otherwise.

```typescript
const v = verify(
  [
    { description: 'file created', verifiable: true },
    { description: 'tests pass', verifiable: true },
  ],
  { 'file created': true, 'tests pass': false }
)
// => { status: 'partial', assertions: [
//   { effect: 'file created', result: true },
//   { effect: 'tests pass', result: false }
// ]}
```

### escalate(verification, target)

```typescript
function escalate(verification: Verification, target: string): Escalation
```

Generates an `Escalation` from failed assertions. Strategy is always `'escalate'`. The `reason` field lists all failed assertion effect descriptions.

```typescript
const esc = escalate(v, 'syner/ops')
// => { strategy: 'escalate', target: 'syner/ops', reason: '1 assertion(s) failed: tests pass' }
```

### parseSkillManifest(content)

```typescript
function parseSkillManifest(content: string): ParseResult

interface ParseResult {
  skill: SkillManifest
  warnings: string[]
}
```

Parses a SKILL.md markdown string into a structured `SkillManifest`. Uses 3-tier priority resolution for extension fields (`preconditions`, `effects`, `verification`, `visibility`, `notFor`, `inputs`, `outputs`):

1. `metadata.*` in frontmatter (preferred, Agent Skills spec compliant)
2. Top-level frontmatter (produces a compliance warning)
3. Markdown body sections (`## Preconditions`, `## Effects`, etc.)

```typescript
const { skill, warnings } = parseSkillManifest(`---
name: deploy
description: Deploy to production
metadata:
  version: '1.0'
  preconditions:
    - tests must pass
---

## Effects
- deployment goes live
- slack notification sent
`)
// skill.name => 'deploy'
// skill.preconditions => ['tests must pass']     (from metadata)
// skill.effects => ['deployment goes live', 'slack notification sent']  (from body)
// warnings => []
```

This is the only function that uses a runtime dependency (`gray-matter`).

## Validators

Runtime type guards for untrusted input. Each narrows `unknown` to the corresponding type.

| Function | Validates | Required fields checked |
|----------|-----------|------------------------|
| `validateContext(x)` | `Context` | `agentId: string`, `skillRef: string`, `loaded: array`, `missing: array`, `timestamp: string` |
| `validateAction(x)` | `Action` | `description: string`, `preconditions: array`, `expectedEffects: array`, `rollbackStrategy` in `['revert','escalate','noop']` if present |
| `validateVerification(x)` | `Verification` | `status` in `['passed','failed','partial']`, `assertions: array` |
| `validateResult(x)` | `Result` | Valid `context` + valid `action` + valid `verification` + `duration: number` |
| `validateRun(x)` | `Run` | `id: string`, `status` in 9 valid statuses, `results: array`, `startedAt: string`, valid `approval`/`timeout`/`retry`/`activity`/`lastHeartbeat` if present |
| `validateApproval(x)` | `Approval` | `required: boolean`, optional `reviewer: string`, optional `decision` in `['approved','rejected']`, optional `reason: string`, optional `timestamp: string` |

```typescript
import { validateRun } from '@syner/osprotocol'

const data: unknown = JSON.parse(untrustedPayload)
if (validateRun(data)) {
  // data is now typed as Run
  console.log(data.status, data.results.length)
}
```

## Errors

| Error | Thrown by | When |
|-------|-----------|------|
| `Error: Invalid transition from {current} to {target}` | `updateRunStatus()` | Attempting a state transition not in the valid transitions map |

All validator functions return `boolean` -- they never throw. Factory functions never throw.

## Constraints

1. **Do not import deprecated aliases.** `OspContext`, `OspAction`, `OspVerification`, `OspResult`, and `SkillManifestV2` exist only for backward compatibility. Import `Context`, `Action`, `Verification`, `Result`, and `SkillManifest` instead.

2. **Do not construct types manually when factory functions exist.** Use `createContext()`, `createAction()`, `createResult()`, `createRun()`. They set correct defaults (`timestamp`, `status: 'pending'`, empty arrays). Manual construction risks missing required fields that validators will reject.

3. **Do not skip validation on untrusted data.** Every type has a corresponding `validate*()` function. If data crosses a trust boundary (remote agent, API input, deserialized JSON), validate before casting. The validators are type guards -- they narrow `unknown` to the correct type.

4. **Do not mutate Run status directly.** Use `updateRunStatus(run, newStatus)`. It enforces the state machine. Invalid transitions throw. Terminal states (`completed`, `failed`, `cancelled`, `timed_out`) have no outbound transitions.

5. **Do not call `verify()` without mapping effects to results.** `verify(effects, results)` expects a `Record<string, boolean>` keyed by the exact `effect.description` string. Missing keys default to `false`. Mismatched keys silently fail assertions. Note: calling `verify()` with an empty `effects` array returns `status: 'passed'` (vacuous truth — 0/0 passed).

6. **Do not assume `parseSkillManifest()` is dependency-free.** It is the one function that pulls in `gray-matter` (the package's single runtime dependency). If you only need types and validators, you still import from `@syner/osprotocol` but be aware the parser module is in the bundle.

7. **Do not add fields to existing types without making them optional.** Every new field on `Context`, `Action`, `Result`, `Verification`, or `Run` must be optional (`?`). Existing validators must continue to pass with old data.

8. **`Result.duration` is in milliseconds and must be a number.** `validateResult()` rejects results where `duration` is not `typeof number`. Do not pass strings, do not omit it. `createResult()` defaults to `0` -- set the real value after execution.

9. **Single import path only.** The package exports everything from `@syner/osprotocol`. There are no subpath exports. Do not attempt `@syner/osprotocol/types` or `@syner/osprotocol/validators`.

10. **`checkPreconditions()` does not run checks -- it reads them.** It filters `action.preconditions` for entries where `met === false`. The caller is responsible for evaluating conditions and setting `met` before calling it.

## Dependencies

| Package | Why | Type |
|---------|-----|------|
| `gray-matter` | Frontmatter parsing in `parseSkillManifest()` | Runtime |
| `typescript` | Type checking | Dev only |
| `@types/node` | Node.js type definitions | Dev only |

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

