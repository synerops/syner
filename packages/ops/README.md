# @syner/ops

> Operational primitives for agent self-development. Human developers use this to understand how agents observe failures and propose improvements. Agents use this to log friction, detect patterns, evaluate proposals, invoke remote instances, and verify responses across trust boundaries.

## Quick Start

```typescript
import {
  logFriction,
  readFrictionLog,
  analyzeFriction,
  evaluate,
  invokeAndVerify,
  validateRemoteResult,
} from '@syner/ops'
```

Single dependency: `@syner/osprotocol` (workspace).

```
// package.json (workspace dependency)
"@syner/ops": "workspace:*"
```

## For Developers

### What Problem This Solves

Agents fail. Skills produce partial results, verifications break, remote instances return garbage. Without structured observation, these failures are invisible — you fix symptoms instead of patterns.

`@syner/ops` gives agents a feedback loop: log what went wrong, find recurring patterns, propose and evaluate changes, call other agents, and never trust a remote response without local re-validation.

### Architecture

```
osprotocol Result (failed/partial)
        |
        v
  logFriction()          --> .syner/ops/friction.jsonl
        |
        v
  analyzeFriction()      --> Pattern[] (severity + suggested category)
        |
        v
  evaluate()             --> Evaluation (pass/fail + regressions)
        |
        v
  invokeRemote()         --> Result from remote instance
        |
        v
  validateRemoteResult() --> local Verification (never trust remote claims)
```

### Common Workflows

**Track friction from a failed skill execution:**

```typescript
import { logFriction, readFrictionLog } from '@syner/ops'
import type { Result } from '@syner/osprotocol'

// After a skill execution returns a failed/partial Result:
const event = await logFriction(failedResult)
// => { skillRef: 'my-skill', failureType: 'verification_failed',
//      context: 'assertion details', frequency: 3,
//      firstSeen: '2026-01-15T...', lastSeen: '2026-03-14T...' }

// Read all accumulated friction events:
const events = await readFrictionLog()
// Default path: .syner/ops/friction.jsonl
// Custom path:  readFrictionLog('/path/to/friction.jsonl')
```

**Detect patterns in accumulated friction:**

```typescript
import { readFrictionLog, analyzeFriction } from '@syner/ops'

const events = await readFrictionLog()
const patterns = analyzeFriction(events, {
  minFrequency: 3,   // ignore noise below 3 occurrences (default: 3)
  windowDays: 30,     // only look at last 30 days (default: 30)
})
// => [{ skillRef: 'vault-search',
//       pattern: 'verification_failed',
//       frequency: 12,
//       severity: 'high',
//       suggestedCategory: 'structural' }]
```

Severity thresholds: `low` (<5), `medium` (5-9), `high` (>=10).
Category mapping: `skill-tweak` (<5), `new-skill` (5-9), `structural` (>=10).

**Evaluate a proposed change:**

```typescript
import { evaluate } from '@syner/ops'
import type { Proposal, Test } from '@syner/ops'

const proposal: Proposal = {
  category: 'skill-tweak',
  description: 'Improve vault-search prompt specificity',
  diff: '- search broadly\n+ search with exact match first, fuzzy fallback',
  metrics: [{ metric: 'verification_pass_rate', before: 0.6, required: 0.9 }],
  skillRef: 'vault-search',
}

const tests: Test[] = [
  { name: 'exact match', input: { q: 'project-x' }, expected: { found: true } },
  { name: 'fuzzy match', input: { q: 'projct x' }, expected: { found: true } },
  { name: 'no match',    input: { q: 'zzzzz' },    expected: { found: false } },
]

const evaluation = evaluate(proposal, tests, (test) => {
  // Your runner — execute the skill and compare actual vs expected
  const actual = runSkill(test.input)
  return { name: test.name, passed: deepEqual(actual, test.expected) }
})

// evaluation.passed       => true/false
// evaluation.regressions  => ['fuzzy match'] (names of failed tests)
// evaluation.metricResults => [{ metric: 'verification_pass_rate',
//                                actual: 0.67, required: 0.9, passed: false }]
```

**Invoke a remote agent and verify its response:**

```typescript
import { fetchRemoteAgent, invokeRemote, invokeAndVerify } from '@syner/ops'

// 1. Discover what a remote instance offers
const instance = await fetchRemoteAgent('https://other.syner.dev')
// => { name: 'other-agent', description: '...', url: '...',
//      version: '1.0', skills: [{ id: 'summarize', name: '...', description: '...' }] }

// 2. Invoke a skill on the remote instance
const result = await invokeRemote(
  'https://other.syner.dev',
  { skill: 'summarize', input: { text: 'long document...' } },
  { timeout: 15000, parentContext: 'my-workflow-id' }
)
// result is a full osprotocol Result

// 3. Or: invoke + locally verify in one call
const { remote, local } = await invokeAndVerify(
  'https://other.syner.dev',
  { skill: 'summarize', input: { text: 'long document...' } },
  { timeout: 15000 }
)
// local.status => 'passed' | 'partial' | 'failed'
// local.assertions => up to 6 checks (structure, context, action, verification, effect-mapping, duration)
// local.escalation => { strategy: 'escalate', reason: '...' } when status !== 'passed'
```

### Storage

Friction events are stored as JSONL (one JSON object per line) at `.syner/ops/friction.jsonl` by default. The path is configurable per call. The directory is created automatically if it does not exist.

### Troubleshooting

**"Failed to fetch remote agent at {url}/agent: 404"**
The remote instance does not expose an `agent.json` endpoint. Verify the URL and that the remote instance is running.

**`invokeRemote` returns a Result with all effects failed**
Either the remote skill does not exist on the instance (check `fetchRemoteAgent()` first), the HTTP call failed, or the request timed out. Check `result.output.error` for details.

**`analyzeFriction` returns empty patterns**
No friction events meet the `minFrequency` threshold within the `windowDays` window. Lower `minFrequency` or widen `windowDays`.
