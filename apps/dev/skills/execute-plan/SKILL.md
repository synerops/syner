---
name: execute-plan
description: Execute approved plans directly. Use when "execute plan", "ejecutar plan", "run plan", "implement plan", "next execution", or when an approved plan with done dependencies is ready for implementation. Also triggers when discussing plan execution strategy.
metadata:
  author: syner
  version: "0.2.0"
  agent: dev
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - Bash
  - Skill
skills:
  - github-create-pr
---

# Execute Plan

Take an approved plan and implement it. One plan, one PR.

## Philosophy

You don't delegate plan execution — you do it yourself. You read the plan like a senior developer reads a spec: understand the context, make the changes, verify the result. The plan is the contract. AGENTS.md files are your reference manuals. VERIFICATION.md teaches you what kinds of checks exist, but each plan is a particular case — you derive what applies.

The loop is always the same: Context → Action → Verify → Iterate. If verification fails, you fix it and try again. If you can't fix it, you ship what you have with notes.

## Step 1: Find the Next Plan

```bash
bun run skills/syner/scripts/plans/scan.ts --mode execute
```

This finds plans where `status === "approved"` and all dependencies are strictly `done`. Take the `next` plan. If null, explain what's blocking.

## Step 2: Load Context

Read the plan file. Then load everything you need to execute it:

1. **Source files** from the plan's "How" and "Deliveries" — understand what exists today before changing it.

2. **AGENTS.md for affected packages/apps.** Parse "Files to create/modify" to identify which areas the plan touches. Read each `AGENTS.md` — exports, types, constraints, conventions. If the plan modifies `packages/osprotocol/src/schemas.ts`, read `packages/osprotocol/AGENTS.md`.

3. **Sprint context** — CONTEXT.md for lifecycle rules and conventions. VERIFICATION.md as reference for deriving checks.

Don't over-load. If the plan only touches one file in one package, you only need that package's AGENTS.md and the file itself.

## Step 3: Derive Verification

Before writing any code, decide how you'll verify it worked. Consult VERIFICATION.md as a reference, then reason about what THIS plan needs:

- **What could break?** Exports → verify they exist. Types → verify build passes.
- **What proves it worked?** Map each Definition of Done item to a concrete check.
- **What's advisory vs blocking?** Lint is advisory. Build and tests block.

Different plan types need different checks:

| Type | Signal | Checks |
|------|--------|--------|
| CODE | `.ts` deliveries | `bun run build`, exports exist, types compile |
| INSTRUCTIONS | `.md` agent/skill files | File exists, frontmatter valid, references correct |
| INTEGRATION | Multiple packages | Build across packages, no circular deps |
| SCAFFOLD | New directory structure | Structure matches, `package.json` valid, installs clean |

## Step 4: Execute

### Mark in-progress

Update the plan's frontmatter before starting:

```yaml
---
status: in-progress
---
```

### Implement

Follow the plan's "How" and "Content Structure" sections. The plan is the spec — implement what it says, not what seems like a good idea. If the plan is wrong, the fix is in `/review-plan`, not here.

Stay within scope. The plan's "Deliveries" table lists exactly which files to create or modify. Don't touch files outside that list unless the "How" section explicitly calls for it.

### Verify

Run the checks you derived in Step 3. If something fails, fix it and re-verify. If you can't fix it after two attempts, note the failure and move on.

## Step 5: Close

### Create PR

Use `/syner github create pr`. Include:
- Plan reference (epic and plan name)
- Verification results

One plan = one PR.

### Mark review

```yaml
---
status: review
pr: https://github.com/synerops/syner/pull/NNN
---
```

Add a decision entry:

```markdown
- **[YYYY-MM-DD]** Executed. PR #NNN. Verification: passed.
```

## Dry Run

If the user asks to "just show what you'd do" or uses `--dry-run`, complete steps 1-3 and describe your execution plan without making changes. This lets the user validate your understanding before you start.

## Edge Cases

- **No executable plans**: Explain what's blocking. Suggest `/syner plan review` if plans need approval.
- **Plan already in-progress without a PR**: May be stale. Ask the user whether to resume or reset.
- **Verification fails after retries**: Create the PR anyway with failure details. Human reviews.

## Boundaries

- **One plan at a time.** Don't batch-execute.
- **The plan is the spec.** Don't improvise beyond what it says.
- **Deps must be done, not just approved.** The code must be in the codebase, not just reviewed.
