# Plan: Vision 2026 — Issue Tree

## What I'll Do

### 1. Create GitHub labels
```
vision-2026, wave-0, wave-1, wave-2, epic, in-progress, backlog
```

### 2. Add workflow section to CLAUDE.md
Add `## Vision 2026 Workflow` section to repo CLAUDE.md (on `feat/vision-2026` branch).
Every new Claude session auto-loads this and knows how to find/claim/implement/PR issues.

### 3. Create GitHub issues
- 9 epics (osprotocol, ops, integration, bot, devx, discovery, self-dev, cross-instance, e2e)
- 39 implementation issues (`vision-2026` + wave label)
- 4 backlog issues for E2E tests (`vision-2026` + `backlog`)

---

## Workflow Section for CLAUDE.md

```markdown
## Vision 2026 Workflow

When the user asks to work on vision-2026 issues:

1. **Auth:** `/syner-gh-auth`
2. **Find work:** `gh issue list --repo synerops/syner --label vision-2026 --state open --json number,title,labels,body -L 100`
3. **Filter:**
   - Skip issues labeled `epic` (parent tracking only)
   - Skip issues labeled `in-progress` (another session owns it)
   - Skip issues labeled `backlog` (TODO for later)
   - Parse "## Dependencies" section — check each dep issue is closed: `gh issue view {n} --json state`
   - Pick the first issue with ALL dependencies met
4. **Claim:** `gh issue edit {n} --add-label in-progress`
5. **Branch:** `git checkout -b vision-2026/{n} feat/vision-2026`
6. **Read context:**
   - Read all files listed in "## Research" section
   - Read all files listed in "## Current Code" section
7. **Implement:** Follow "## Implementation" section exactly
8. **Verify:** Run all checks in "## Acceptance" section
9. **PR:** Create PR to `feat/vision-2026` with `Closes #{n}` in body
10. **Close:** After PR is merged, close the issue and remove `in-progress` label:
    - `gh issue close {n} --repo synerops/syner --reason completed`
    - `gh issue edit {n} --repo synerops/syner --remove-label in-progress`
    - ⚠️ `Closes #N` only auto-closes on merge to default branch (`main`). Since these PRs target `feat/vision-2026`, you MUST close manually.
```

---

## Issue Structure

### Epic 1: osprotocol — Protocol Core (`packages/osprotocol`)
> Labels: `vision-2026` `epic` `wave-0`
> Pure protocol: types, parser, validators. No operational concerns.

**#1 — Package scaffold `packages/osprotocol`**
- Wave: 0 | Deps: none
- Research: `osprotocol-positioning.md`, `architecture.md`
- Current Code: `packages/syner/package.json`, `turbo.json`
- Create: `packages/osprotocol/package.json`, `tsconfig.json`, `src/index.ts`
- Implementation: Scaffold `@syner/osprotocol` package following monorepo conventions from `packages/syner`. Add to turbo.json tasks. Export empty barrel file.
- Acceptance: `bun install && bun run build` passes

**#2 — Core type: OspContext**
- Wave: 0 | Deps: #1
- Research: `osprotocol-positioning.md` (Context interface)
- Current Code: `packages/osprotocol/src/index.ts`
- Create: `packages/osprotocol/src/types/context.ts`
- Implementation: Define `OspContext` — what an agent knows before acting. Fields: `agentId: string`, `skillRef: string`, `loaded: ContextSource[]` (what data was loaded — vaults, files, APIs), `missing: string[]` (expected but not found), `timestamp: string` (ISO 8601), `parentContext?: string` (upstream reference for chains). Define `ContextSource { type: 'vault' | 'file' | 'api' | 'skill', ref: string, summary?: string }`. Helper: `createContext(partial: Partial<OspContext>): OspContext` with defaults. Export from `src/index.ts`.
- Acceptance: types compile, `createContext({agentId: 'test', skillRef: 'test'})` returns valid OspContext

**#3 — Core type: OspAction**
- Wave: 0 | Deps: #1
- Research: `osprotocol-positioning.md` (Action interface)
- Create: `packages/osprotocol/src/types/action.ts`
- Implementation: Define `OspAction` — what an agent is about to do. Fields: `description: string`, `preconditions: Precondition[]`, `expectedEffects: Effect[]`, `rollbackStrategy?: 'revert' | 'escalate' | 'noop'`. Define `Precondition { check: string, met: boolean, detail?: string }`. Define `Effect { description: string, verifiable: boolean }`. Helpers: `createAction(partial): OspAction`, `checkPreconditions(action): { pass: boolean, unmet: Precondition[] }`. Export from `src/index.ts`.
- Acceptance: types compile, `checkPreconditions` returns unmet list correctly

**#4 — Core type: OspVerification**
- Wave: 0 | Deps: #1
- Research: `osprotocol-positioning.md` (Verification interface)
- Create: `packages/osprotocol/src/types/verification.ts`
- Implementation: Define `OspVerification` — did the action produce intended outcome. Fields: `status: 'passed' | 'failed' | 'partial'`, `assertions: Assertion[]`, `escalation?: Escalation`. Define `Assertion { effect: string, result: boolean, evidence?: string }`. Define `Escalation { strategy: 'rollback' | 'escalate' | 'retry', target?: string, reason: string }`. Helpers: `verify(effects: Effect[], results: Record<string, boolean>): OspVerification`, `escalate(verification: OspVerification, target: string): Escalation`. Export from `src/index.ts`.
- Acceptance: `verify()` checks effects against results, `escalate()` produces escalation

**#5 — Protocol lifecycle: OspResult**
- Wave: 0 | Deps: #2, #3, #4
- Create: `packages/osprotocol/src/types/result.ts`
- Implementation: Define `OspResult<T = unknown>` — complete lifecycle of one agent action. Fields: `context: OspContext`, `action: OspAction`, `verification: OspVerification`, `output?: T`, `duration: number` (ms), `chain?: string` (links sequence of handoffs). Helper: `createResult(context, action, verification, output?): OspResult`. Export from `src/index.ts`.
- Acceptance: composite type compiles, helper creates valid result

**#6 — SKILL.md v2 schema**
- Wave: 0 | Deps: #1
- Research: `use-cases/third-party-nextjs.md`, `architecture.md`
- Current Code: `packages/syner/src/skills/loader.ts`, `packages/vercel/src/skills/loader.ts`
- Create: `packages/osprotocol/src/types/skill-manifest.ts`
- Implementation: Define `SkillManifestV2` extending current fields with: `preconditions?: string[]`, `effects?: string[]`, `verification?: string[]`, `inputs?: InputField[]`, `outputs?: OutputField[]`, `visibility?: 'public' | 'private' | 'instance'`, `notFor?: string[]`. ALL new fields optional — v1 SKILL.md must still parse. Export from `src/index.ts`.
- Acceptance: type compiles, v1 SKILL.md shape is valid SkillManifestV2

**#7 — SKILL.md v2 parser**
- Wave: 0 | Deps: #6
- Current Code: `packages/syner/src/skills/loader.ts`, `packages/vercel/src/skills/loader.ts`
- Create: `packages/osprotocol/src/parser.ts`
- Implementation: `parseSkillManifest(content: string): SkillManifestV2`. Parse YAML frontmatter via gray-matter. Parse markdown body for structured sections (`## Preconditions`, `## Effects`, `## I am NOT`, `## Inputs`, `## Outputs`). Merge frontmatter + body into SkillManifestV2. Add `gray-matter` as dependency.
- Acceptance: parses existing v1 SKILL.md files from `skills/` and `apps/*/skills/` without error

**#8 — Protocol validators**
- Wave: 0 | Deps: #2, #3, #4
- Create: `packages/osprotocol/src/validators.ts`
- Implementation: Runtime type guards, zero external deps. `validateContext(x): x is OspContext`, `validateAction(x): x is OspAction`, `validateVerification(x): x is OspVerification`, `validateResult(x): x is OspResult`. Check required fields, correct types, enum values. Export from `src/index.ts`.
- Acceptance: validates correct objects, rejects malformed

---

### Epic 2: ops — Operational Layer (`packages/ops`)
> Labels: `vision-2026` `epic` `wave-0`
> Self-development types, friction, supervisor. Separate from protocol spec.

**#9 — Package scaffold `packages/ops`**
- Wave: 0 | Deps: #1
- Current Code: `packages/syner/package.json`, `turbo.json`
- Create: `packages/ops/package.json`, `tsconfig.json`, `src/index.ts`
- Implementation: Scaffold `@syner/ops` package. Depends on `@syner/osprotocol`. Add to turbo.json.
- Acceptance: `bun install && bun run build` passes

**#10 — Change categories**
- Wave: 0 | Deps: #9
- Research: `decisions.md` (DEC-001)
- Create: `packages/ops/src/types/changes.ts`
- Implementation: `ChangeCategory: 'skill-tweak' | 'new-skill' | 'structural'`. `MetricThreshold { metric, before, required }`. `ChangeProposal { category, description, diff, metrics, skillRef }`. Export from `src/index.ts`.
- Acceptance: types compile, categories match DEC-001

**#11 — Supervisor contract types**
- Wave: 0 | Deps: #10
- Research: `decisions.md` (DEC-001), `self-development-patterns.md`
- Create: `packages/ops/src/types/supervisor.ts`
- Implementation: `SupervisorDecision { proposal, approved, reason, reviewer, timestamp }`. `DecisionCorpus { decisions, patterns }`. JSDoc: supervisor MUST be separate entity from agent being evaluated. Export from `src/index.ts`.
- Acceptance: types compile, decision requires `reason` + `reviewer`

**#12 — Friction logger**
- Wave: 0 | Deps: #9, #5
- Research: `self-development-patterns.md`
- Create: `packages/ops/src/friction.ts`
- Implementation: `logFriction(result: OspResult): FrictionEvent`. `FrictionEvent { skillRef, failureType, context, frequency, firstSeen, lastSeen }`. Storage: `.syner/ops/friction.jsonl`.
- Acceptance: failed OspResults logged as structured friction events

**#13 — Friction analyzer**
- Wave: 0 | Deps: #12
- Create: `packages/ops/src/friction-analyzer.ts`
- Implementation: `analyzeFriction(events): FrictionPattern[]`. Groups by skill+failure, detects recurring patterns (>N failures in M days). `FrictionPattern { skillRef, pattern, frequency, severity, suggestedCategory }`.
- Acceptance: identifies repeated failure patterns from friction log

---

### Epic 3: Package Integration
> Labels: `vision-2026` `epic` `wave-1`

**#14 — Skills loader v2** | Deps: #6, #7
- Modify: `packages/syner/src/skills/loader.ts`
- Add `@syner/osprotocol` dep. Replace raw frontmatter parsing with `parseSkillManifest()`. Keep existing `Skill` type, add `manifest: SkillManifestV2` field. Backwards compatible.
- Acceptance: `bun run build` passes, existing skill loading unchanged, `skill.manifest` available

**#15 — Agents loader v2** | Deps: #5
- Modify: `packages/syner/src/agents/loader.ts`
- Add optional `protocol?: { version: string, capabilities: string[] }` to `AgentCard`. Agents without it work as before.
- Acceptance: existing agents load unchanged, new field available

**#16 — withSyner() Next.js wrapper** | Deps: #6
- Research: `adoption-nextjs.md`
- Create: `packages/vercel/src/with-syner.ts`
- `withSyner(nextConfig): NextConfig`. Reads SKILL.md from project root via `parseSkillManifest()`. Adds `/agent` rewrite. Zero breaking changes. Export from `packages/vercel/src/index.ts`.
- Acceptance: wrapping a config adds `/agent` route without breaking existing routes

**#17 — Agent route handler** | Deps: #2, #3, #4, #5
- Create: `packages/vercel/src/agent-handler.ts`
- `createAgentHandler(config): NextApiHandler`. Request → OspContext → check preconditions → OspAction → execute handler → OspVerification → return OspResult. On precondition failure: return structured error with unmet list.
- Acceptance: handler wraps execution in full osprotocol lifecycle

**#18 — Skill tool v2** | Deps: #5
- Modify: `packages/vercel/src/tools/skill.ts`
- Wrap subagent invocation in osprotocol lifecycle. Return OspResult. Raw text still via `result.output`.
- Acceptance: skill tool returns OspResult, existing behavior preserved

**#19 — Sandbox tools v2** | Deps: #3, #4
- Modify: `packages/vercel/src/tools/index.ts`
- Optional osprotocol wrapping per tool. Only active when `osprotocol: true` in config.
- Acceptance: tools work as before by default, osprotocol mode adds action/verification

---

### Epic 4: Bot osprotocol Lifecycle
> Labels: `vision-2026` `epic` `wave-1`

**#20 — Session v2** | Deps: #5
- Modify: `apps/bot/lib/session.ts`
- `session.generate()` returns `OspResult`. Keep `GenerateResult` as `result.output`.
- Acceptance: session.generate() returns OspResult, Slack/GitHub handlers still work

**#21 — Verified handoff chain** | Deps: #20
- Research: `use-cases/slides-from-slack.md`
- Create: `apps/bot/lib/handoff.ts`
- `executeChain(steps): OspResult[]`. Chain breaks on failure with escalation. Results linked via `chain` ID.
- Acceptance: chain of 3 steps produces 3 linked OspResults, breaks on failure

**#22 — Slack handler v2** | Deps: #20
- Modify: `apps/bot/app/api/webhooks/slack/route.ts`
- After session.generate(): verify delivery, log OspResult, escalate on failure.
- Acceptance: Slack responses include verification, failures logged

**#23 — GitHub handler v2** | Deps: #20
- Modify: `apps/bot/app/api/webhooks/github/route.ts`
- Same pattern as #22 for GitHub.
- Acceptance: GitHub responses include verification, failures logged

**#24 — Bot as discoverable agent** | Deps: #6, #16
- Create: `apps/bot/SKILL.md` (v2), `apps/bot/app/agent/route.ts`
- Acceptance: GET `/agent/bot` returns SkillManifestV2

---

### Epic 5: Developer Experience
> Labels: `vision-2026` `epic` `wave-1`

**#25 — Dev app as discoverable agent** | Deps: #6, #16
- Create: `apps/dev/SKILL.md` (v2), `apps/dev/app/agent/route.ts`
- Acceptance: GET `/agent/dev` returns SkillManifestV2

**#26 — Skills API v2** | Deps: #6, #14
- Modify: `apps/dev/app/api/skills/route.ts`, `[slug]/route.ts`
- Return SkillManifestV2 instead of raw frontmatter.
- Acceptance: API returns manifest with preconditions/effects

**#27 — npx create-syner-agent** | Deps: #6, #16, #17
- Research: `adoption-nextjs.md`
- Create: `packages/create-syner-agent/`
- Interactive scaffolding. Generates: SKILL.md template, `app/agent/route.ts`, `next.config.js` with `withSyner()`.
- Acceptance: generates working agent scaffold

---

### Epic 6: Discovery
> Labels: `vision-2026` `epic` `wave-2`

**#28 — /agent listing** | Deps: #24, #25
- Enhance: `apps/bot/app/agent/route.ts`
- GET `/agent` returns JSON array of all public SkillManifestV2 summaries.
- Acceptance: GET `/agent` returns array of public skills

**#29 — /.well-known/agent.json** | Deps: #28
- Research: `decisions.md` (DEC-002)
- Create: `apps/bot/app/.well-known/agent.json/route.ts`
- A2A-compatible Agent Card. Dynamic: reads current public skills per request.
- Acceptance: GET `/.well-known/agent.json` returns valid A2A Agent Card

**#30 — Skill visibility control** | Deps: #6, #14
- Modify: `packages/syner/src/skills/loader.ts`
- Filter by `visibility` field: public/instance/private. Default: instance. New helpers: `getPublicSkills()`, `getInstanceSkills()`, `getPrivateSkills(app)`.
- Acceptance: skills correctly filtered by visibility

---

### Epic 7: Self-Development
> Labels: `vision-2026` `epic` `wave-2`

**#31 — Candidate generator** | Deps: #10, #13
- Create: `apps/dev/lib/self-dev/candidate.ts`
- `generateCandidate(pattern, skill): ChangeProposal`. Categorizes change, includes expected metrics.
- Acceptance: generates typed ChangeProposal from friction pattern

**#32 — Sandbox evaluator** | Deps: #31
- Research: `self-development-patterns.md` (sandbox section)
- Create: `apps/dev/lib/self-dev/evaluator.ts`
- `evaluate(proposal, testCases): EvalResult`. Critical: evaluator logic lives in `packages/ops`, NOT in skill being evaluated.
- Acceptance: evaluates candidate, detects regressions

**#33 — Supervisor gate** | Deps: #11, #32
- Create: `apps/dev/lib/self-dev/supervisor.ts`, `apps/bot/lib/supervisor-prompt.ts`
- `requestApproval(proposal, evalResult): SupervisorDecision`. Sends to human via syner.bot.
- Acceptance: proposal sent to Slack, human approves/rejects, decision logged

**#34 — Decision corpus** | Deps: #11
- Create: `apps/dev/lib/self-dev/corpus.ts`
- `logDecision()`, `getCorpus()`, `findSimilar()`. Storage: `.syner/ops/decisions.jsonl`.
- Acceptance: decisions persisted, similar decisions retrievable

**#35 — Deploy pipeline** | Deps: #33
- Create: `apps/dev/lib/self-dev/deploy.ts`
- `deploy(proposal, decision): DeployResult`. Only if `decision.approved === true`.
- Acceptance: approved deployed, rejected blocked

**#36 — Metric tracker** | Deps: #35
- Create: `apps/dev/lib/self-dev/metrics.ts`
- `track(skillRef, window): MetricTimeline`. Rolling window, regression detection.
- Acceptance: tracks performance, detects regressions

---

### Epic 8: Cross-Instance
> Labels: `vision-2026` `epic` `wave-2`

**#37 — Instance-as-agent** | Deps: #29
- Research: `decisions.md` (DEC-002)
- Create: `apps/bot/lib/instance.ts`
- `getInstanceCard()`: aggregates public skills, hides internals.
- Acceptance: instance presents as single agent externally

**#38 — Skill visibility enforcement** | Deps: #30
- Modify: `apps/bot/app/agent/route.ts`
- External requests see only `public` skills. Internal see `instance` + `public`.
- Acceptance: external caller cannot see private/instance skills

**#39 — Cross-instance invocation** | Deps: #17, #37
- Create: `packages/ops/src/remote.ts`
- `invokeRemote(url, input): OspResult`. Fetches remote agent.json, checks preconditions, sends task, validates response.
- Acceptance: can invoke skill on remote syner instance

**#40 — Verified boundary crossing** | Deps: #39
- Create: `packages/ops/src/boundary.ts`
- `validateRemoteResult(result): OspVerification`. Local verification of remote output. Never trust remote verification alone.
- Acceptance: remote results verified locally before use

---

### Epic 9: E2E Verification (Backlog)
> Labels: `vision-2026` `epic` `backlog`
> TODO: implement when prerequisite features are production-ready.

**#41 — E2E: Slides from Slack** | `backlog`
- Research: `use-cases/slides-from-slack.md`
- TODO: `tests/e2e/slides-from-slack.test.ts`
- Verify chain: user → bot → md → design → bot with linked OspResults

**#42 — E2E: Self-Development** | `backlog`
- Research: `use-cases/self-development.md`
- TODO: `tests/e2e/self-development.test.ts`
- Verify loop: friction → analyze → candidate → sandbox → gate → deploy → metrics

**#43 — E2E: Third-Party Next.js** | `backlog`
- Research: `use-cases/third-party-nextjs.md`
- TODO: `tests/e2e/third-party-nextjs.test.ts`
- Verify: withSyner() + SKILL.md + osprotocol lifecycle end-to-end

**#44 — E2E: Cross-Instance** | `backlog`
- Research: `use-cases/cross-instance.md`
- TODO: `tests/e2e/cross-instance.test.ts`
- Verify: discovery → invocation → verified boundary crossing

---

## Package Boundaries

```
packages/osprotocol          packages/ops
├── types/                   ├── types/
│   ├── context.ts           │   ├── changes.ts
│   ├── action.ts            │   └── supervisor.ts
│   ├── verification.ts      ├── friction.ts
│   ├── result.ts            ├── friction-analyzer.ts
│   └── skill-manifest.ts    ├── remote.ts
├── parser.ts                └── boundary.ts
└── validators.ts
```

**osprotocol** = the contract (what). Pure types + parsing + validation.
**ops** = the operations (how). Friction, supervision, cross-instance execution.

---

## Execution Steps

1. `/syner-gh-auth`
2. Create 7 labels via `gh label create`
3. Add `## Vision 2026 Workflow` section to `CLAUDE.md`
4. Commit CLAUDE.md change
5. Create 9 epic issues, capture numbers
6. Create 40 implementation issues with real dep numbers
7. Create 4 backlog issues
8. Verify: `gh issue list --label vision-2026 --state open`

## Verification

User opens new session → says "busca issues con el label vision-2026 y busca en qué puedes trabajar" → Claude reads CLAUDE.md workflow → finds wave-0 issues → claims one → implements → PRs to `feat/vision-2026`.
