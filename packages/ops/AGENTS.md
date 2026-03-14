# @syner/ops

### Exports

```typescript
import {
  logFriction,
  readFrictionLog,
  analyzeFriction,
  evaluate,
  fetchRemoteAgent,
  invokeRemote,
  invokeAndVerify,
  validateRemoteResult,
} from '@syner/ops'

import type {
  Friction,
  Pattern,
  Category,
  Proposal,
  Threshold,
  Decisions,
  Decision,
  Test,
  TestResult,
  Evaluation,
  Metric,
  Instance,
  Invoke,
  InvokeOptions,
} from '@syner/ops'
```

All exports come from the single entry point `@syner/ops`. There are no subpath exports.

### Types

```typescript
// --- Friction ---

interface Friction {
  skillRef: string
  failureType: string
  context: string
  frequency: number
  firstSeen: string   // ISO 8601
  lastSeen: string     // ISO 8601
}

interface Pattern {
  skillRef: string
  pattern: string
  frequency: number
  severity: 'low' | 'medium' | 'high'
  suggestedCategory: Category
}

// --- Change proposals ---

type Category = 'skill-tweak' | 'new-skill' | 'structural'

interface Threshold {
  metric: string
  before: number
  required: number
}

interface Proposal {
  category: Category
  description: string
  diff: string
  metrics: Threshold[]
  skillRef: string
}

// --- Evaluation ---

interface Test {
  name: string
  input: Record<string, unknown>
  expected: Record<string, unknown>
}

interface TestResult {
  name: string
  passed: boolean
  actual?: Record<string, unknown>
  error?: string
}

interface Evaluation {
  proposal: Proposal
  passed: boolean
  testResults: TestResult[]
  regressions: string[]
  metricResults: Metric[]
}

interface Metric {
  metric: string
  actual: number
  required: number
  passed: boolean
}

// --- Supervisor ---

interface Decisions {
  decisions: Approval[]   // Approval from @syner/osprotocol
  patterns: string[]
}

type Decision = Approval  // re-export from @syner/osprotocol

// --- Remote ---

interface Instance {
  name: string
  description: string
  url: string
  version: string
  skills: Array<{ id: string; name: string; description: string }>
}

interface Invoke {
  skill: string
  input: Record<string, unknown>
}

interface InvokeOptions {
  timeout?: number        // ms, default 30000
  parentContext?: string
}
```

### Functions

#### logFriction(result: Result, storagePath?: string): Promise\<Friction\>

Extracts a friction event from a failed/partial osprotocol `Result`. Appends to JSONL at `storagePath` (default: `.syner/ops/friction.jsonl`). Auto-increments `frequency` when the same `skillRef + failureType` pair already exists. Creates parent directories if needed.

#### readFrictionLog(storagePath?: string): Promise\<Friction[]\>

Reads all friction events from the JSONL file. Returns `[]` if the file does not exist.

#### analyzeFriction(events: Friction[], options?: { minFrequency?: number; windowDays?: number }): Pattern[]

Groups events by `skillRef + failureType`. Filters by `windowDays` (default 30) and `minFrequency` (default 3). Returns patterns sorted by frequency descending.

#### evaluate(proposal: Proposal, testCases: Test[], runner: (test: Test) => TestResult): Evaluation

Runs all test cases through `runner`. Computes regressions (failed test names). Evaluates metrics — currently only `verification_pass_rate` is supported. Returns `passed: true` only when zero regressions AND all metric thresholds met.

#### fetchRemoteAgent(url: string): Promise\<Instance\>

GET `{url}/agent`. Returns the remote instance card. Throws on non-2xx response.

#### invokeRemote(url: string, input: Invoke, options?: InvokeOptions): Promise\<Result\>

Full invocation flow:
1. Builds osprotocol Context with `skillRef: remote:{url}/{skill}`
2. Fetches remote agent card, checks skill exists
3. POST `{url}/agent` with the input payload
4. Returns osprotocol Result with timing

Never throws. On failure (network, timeout, missing skill), returns a Result with failed verification.

#### invokeAndVerify(url: string, input: Invoke, options?: InvokeOptions): Promise\<{ remote: Result; local: Verification }\>

Calls `invokeRemote()` then `validateRemoteResult()`. Returns both the remote Result and the local Verification.

#### validateRemoteResult(result: unknown): Verification

Six-check local re-validation of a remote Result:
1. Valid Result structure
2. Context is well-formed (agentId, skillRef present)
3. Action is well-formed (preconditions, expectedEffects present)
4. Verification block is well-formed
5. All assertions map to declared effects
6. Duration is non-negative

Returns `Verification` with `status: 'passed' | 'partial' | 'failed'`. Sets `escalation.strategy: 'escalate'` when any check fails.

### Errors

`@syner/ops` functions do not throw custom error classes. `invokeRemote` catches all errors internally and returns them as failed Results. `fetchRemoteAgent` throws a plain `Error` on non-2xx HTTP responses.

| Function | Throws | When |
|----------|--------|------|
| `fetchRemoteAgent` | `Error` | Non-2xx response from `{url}/agent` |
| `invokeRemote` | Never | Errors captured in Result output |
| `logFriction` | `Error` | Filesystem write failure |
| `readFrictionLog` | Never | Returns `[]` on read failure |
| `analyzeFriction` | Never | Pure computation |
| `evaluate` | Depends on `runner` | If caller-supplied runner throws |
| `validateRemoteResult` | Never | Pure validation |

### Constraints

- Do not call `logFriction()` with a passing Result — it extracts failure details from the verification and will produce meaningless friction events for passed results.
- Do not trust `result.verification` from `invokeRemote()` alone — always use `validateRemoteResult()` or `invokeAndVerify()` to re-validate locally.
- `evaluate()` currently only evaluates thresholds where `metric === 'verification_pass_rate'`. Other metric names are silently ignored.
- `analyzeFriction()` is a pure function — it does not read from disk. Call `readFrictionLog()` first.
- Friction JSONL is append-only. There is no delete or compaction API.

### Deprecated Aliases

These are exported for backward compatibility and will be removed in a future version:

| Deprecated | Use Instead |
|------------|-------------|
| `FrictionEvent` | `Friction` |
| `FrictionPattern` | `Pattern` |
| `ChangeCategory` | `Category` |
| `ChangeProposal` | `Proposal` |
| `MetricThreshold` | `Threshold` |
| `TestCase` | `Test` |
| `EvalResult` | `Evaluation` |
| `MetricResult` | `Metric` |
| `RemoteInstanceCard` | `Instance` |
| `RemoteInvokeInput` | `Invoke` |
| `SupervisorDecision` | `Approval` (from `@syner/osprotocol`) |
| `DecisionCorpus` | `Decisions` |

### Dependencies

| Package | Why |
|---------|-----|
| `@syner/osprotocol` | `Result`, `Verification`, `Approval` types; `createContext`, `createAction`, `verify`, `createResult` builders; `validateResult`, `validateContext`, `validateAction`, `validateVerification` validators |

---

## Status

| Module | Status | Notes |
|--------|--------|-------|
| `friction.ts` | Production | Stable API. JSONL append-only storage. |
| `friction-analyzer.ts` | Production | Configurable thresholds. Pattern detection. |
| `evaluator.ts` | Production | Only `verification_pass_rate` metric supported. |
| `remote.ts` | Experimental | Full flow implemented, untested against live remote instances. |
| `boundary.ts` | Production | Six-check local re-validation. |
| `types/` | Stable | Clean types with deprecated aliases for backward compat. |

