---
name: review-plan
description: Review and validate v0.1.0 implementation plans before approval. Use when working through plan files in .syner/plans/, when the user says "review plan", "revisar plan", "next task", "siguiente task", "pulir tasks", or when discussing plan readiness, dependencies, or design decisions. Also triggers when the user asks to approve, refactor, or discuss any plan file.
metadata:
  author: syner
  version: "0.1.0"
  agent: dev
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Bash
  - WebFetch
---

# Review Plan

Review implementation plans for Syner v0.1.0. These plans were written by Claude in a previous session. The user is now validating them — confirming the reasoning, challenging assumptions, and deciding whether to approve or refactor each one.

## Philosophy

These plans are drafts, not gospel. Claude wrote them based on an understanding of the architecture, but the real vision lives in the user's head. This review process is where those two things align. Every plan can change — the types, the dependencies, the approach, everything. The goal is not to defend what was written but to pressure-test it together until it's right.

This mirrors how Stripe builds their Minions system: define the contract first, validate it, then execute. Stripe learned that "investments in human developer productivity over time have returned to pay dividends in the world of agents." Plans that are well-validated produce wolves that execute cleanly. Plans that are rubber-stamped produce wolves that waste tokens and sandboxes.

Two key Stripe insights apply directly here:

1. **Task scoping determines success.** Stripe's Minions succeed because each task is scoped to something a single agent can complete in one shot — clear inputs, clear outputs, clear verification. A plan that's too vague or too coupled will produce a wolf that flails. During review, ask: "Could a wolf pick this up cold and ship it?"

2. **Blueprints = deterministic + agentic nodes.** Not everything needs LLM reasoning. Plans should clearly separate what's deterministic (type definitions, file paths, schemas) from what's agentic (implementation decisions, edge case handling). The deterministic parts are the contract; the agentic parts are where the wolf has freedom.

## The Review Process

### Before starting

Use `Read` to load these files from the project root and understand the full sprint context:

- `{project_root}/.syner/plans/v0.1.0/ACTION.md` — epics, phases, dependency graph, key decisions
- `{project_root}/.syner/plans/v0.1.0/CONTEXT.md` — lifecycle, rules, patterns, picking work
- `{project_root}/.syner/plans/v0.1.0/VERIFICATION.md` — gate architecture, effect-to-check translation

Also use `Read` to load the actual source files that the plan references — understand what exists today before discussing what should be built.

### Find the next plan automatically

Don't ask the user which plan to review. Run the scan script:

```bash
bun run {project_root}/skills/review-plan/scripts/scan-plans.ts
```

This outputs JSON with:
- `next` — the first reviewable plan (draft + all deps met, in execution order)
- `reviewable` — all plans that can be reviewed now
- `plans` — full list with status, deps, and reviewable flag

The script handles YAML frontmatter parsing (via `Bun.YAML.parse()`), dependency resolution across epics, and execution order from ACTION.md.

Present the `next` plan directly. No menus, no "which do you want?" — just show the next plan.

If `next` is null, all plans are blocked by dependencies — explain what's blocking.

### Read existing decisions first

Before reviewing a plan, check if it already has a `## Decisions` section. Plans accumulate decisions across sessions — from refactors, prior reviews, or design discussions.

If a plan has existing decisions:
- **Read them.** They represent choices already made and validated.
- **Incorporate them into the review.** Don't re-litigate settled decisions. Instead, assess whether the plan correctly reflects those decisions in its types, pseudocode, and Definition of Done.
- **Focus on gaps.** The review question shifts from "is the design right?" to "does the plan fully implement the decisions that were already made?"
- **Flag contradictions.** If the plan text contradicts its own decisions (e.g., a decision says "sandbox is conditional" but the code still says "eager sandbox"), call it out.

If a plan has NO existing decisions, this is a fresh review — use the full review process below.

### For each plan

1. **Print the full plan.** The user may be on mobile. Show the complete markdown content so they can read it without opening files.

2. **Explain from zero.** The user doesn't have perfect recall of every type, file, and interface in the codebase. The review output must be self-explanatory without requiring them to have read the source code recently. Specifically:
   - **Don't reference code constructs without explaining them.** If the plan imports `Run` from OSProtocol, explain what `Run` is and what it does — don't just say "it uses Run." Same for any type, function, or pattern from the codebase.
   - **Lead with the problem, not the solution.** Before explaining what a type does, explain what gap it fills. "Today, Syner can load agent definitions but can't launch them" is better than "SpawnOptions defines the input to spawn()."
   - **Use analogies and plain language.** "WolfHandle is like a job ticket — you get it immediately when you submit work, and you can check its status or cancel it later" is more useful than listing interface fields.
   - **Make decisions self-contained.** Each point in the review should carry enough context that the user can evaluate it from their phone without opening a terminal. If you're questioning a design choice, explain both sides with enough background that the tradeoff is obvious.

3. **Present the reasoning.** For each plan, cover:
   - **Why this plan exists** — what capability gap does it fill? What can't Syner do today that this enables?
   - **Why it's shaped this way** — what design decisions led to this structure? What alternatives were considered?
   - **Dependencies** — what must be done first and why? What does this unblock downstream?
   - **Relationship to the epic** — where does this sit in the dependency graph? How does it connect to the bigger picture?

4. **Offer your assessment.** You wrote these plans — now pressure-test them. But present your conclusions as reasoned assessments, not open-ended code questions. Instead of "Should WolfHandle.run expose Run directly?", say "WolfHandle exposes the underlying Run object directly (the state machine that tracks pending → in-progress → completed). This means consumers get full protocol access without an extra wrapper. The tradeoff is tighter coupling — but Run is already the public contract, so wrapping it would just add indirection. I'd keep it as-is." Give the user enough context to agree, disagree, or ask deeper.

5. **Discuss, don't implement.** The conversation is about design and reasoning. Don't write code. Don't suggest implementation changes unless the user asks. The question is "is this the right thing to build?" not "how do we build it."

6. **Wait for the verdict.** The user decides one of:
   - **Approved** — plan is good, add frontmatter `status: approved`
   - **Refactor** — plan needs changes, discuss what and why, then edit
   - **Defer** — plan is valid but not needed yet, leave as draft

   CONTEXT.md is the authoritative source for plan lifecycle — status values, transition rules, and what each state means. When in doubt about lifecycle behavior, read it rather than inferring from this skill.

## Recording Decisions

Every decision made during review gets recorded at the bottom of the plan file itself. This creates a traceable history of why the plan looks the way it does — not just what was decided, but the reasoning behind it.

Add a `## Decisions` section at the end of the plan file. Each decision is a timestamped entry with the decision and its rationale:

```markdown
## Decisions

- **[2026-03-18]** Approved as-is. Types match the OSProtocol Run contract and the adapter pattern gives us runtime flexibility without leaking Vercel details into the SDK.

- **[2026-03-18]** Changed: Removed `priority` field from SpawnOptions. Wolves don't need priority ordering — the orchestrator decides execution order before spawning. Adding priority here would create a false abstraction.

- **[2026-03-18]** Deferred: WolfHandle.pause() considered but deferred. Current sandbox model doesn't support pause/resume. Revisit when Vercel adds snapshot support.
```

Decisions are append-only. Don't delete previous decisions — they form the audit trail. If a later decision reverses an earlier one, add a new entry referencing the old one.

## Marking as Approved

When the user says a plan is approved:

1. Add YAML frontmatter with `status: approved`
2. Add the approval decision to the `## Decisions` section
3. Update VERIFICATION.md with the plan's specific checks under the appropriate epic section

```yaml
---
status: approved
---
```

Only the user can approve. Never self-approve. If you think a plan is ready, say so — but wait for the explicit go-ahead.

## Navigating Plans

Plans follow this order within each epic. Use the epic README and ACTION.md to understand the dependency graph.

To find the next reviewable plan:
1. Check which plans are still `draft` (no frontmatter)
2. Among those, identify which have no unmet dependencies (or whose dependencies are already `approved`/`done`)
3. Suggest the next one based on the execution order in ACTION.md

## What "Ready for a Wolf" Means

A plan is ready for a wolf when it passes these checks (borrowed from Stripe's task scoping):

- **Self-contained**: A wolf can read this plan and nothing else to do the work
- **Clear inputs**: What files to read, what types to import, what patterns to follow
- **Clear outputs**: Exact file paths to create/modify, exact exports to add
- **Clear verification**: Definition of Done is testable, not subjective
- **Right-sized**: Completable in a single agent session (not a multi-day epic)
- **Dependencies met**: Everything it needs is merged and available
