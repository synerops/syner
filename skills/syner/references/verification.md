# Verification Engineering — Rationale

Reference document for the Verification Engineering section in `agents/syner.md`. This contains the detailed reasoning behind the compact decision table and worked examples.

## Why two layers (deterministic + agentic)

Stripe's Minions system runs all deterministic checks before any agentic evaluation. The reasoning: deterministic checks are fast, binary (pass/fail), and catch 80% of issues. Running them first means the agentic layer only activates when the basics already pass — reducing token spend and false positives.

- **Deterministic (Rules):** `bun build`, `bun lint`, `bun typecheck`. These are shell commands with exit codes. No LLM reasoning needed.
- **Agentic (Judge):** LLM evaluates its own output against the Definition of Done. This is the evaluator-optimizer pattern from Self-Provisioning vocabulary — execute, evaluate, iterate.

The two layers map conceptually to OSProtocol's Checks domain:
- Rules = deterministic checks
- Judge = agentic evaluation
- Screenshot = visual verification (future)

This mapping is aspirational — no OSProtocol types are imported. When the protocol matures, the mental model is already aligned.

## Why AGENTS.md as primary verification source

Each package can define health criteria in its AGENTS.md — what "healthy" looks like for that territory. This follows the same ambient context principle from Context Engineering: AGENTS.md is always loaded when working in an area, so verification criteria are available before execution starts.

If a package lacks an AGENTS.md, that's a finding worth surfacing — missing ambient context means missing verification criteria. In that case, apply generic checks (build + lint + typecheck).

## Self-check vs external gate

Two independent verification mechanisms:

1. **Self-check (Verification Engineering):** Syner verifies its own work before reporting completion. This is internal — part of the Execution Loop's "Verify" step.
2. **External gate (VERIFICATION.md):** A post-execution gate that runs outside the agent loop. The agent cannot skip or modify it. It runs shell commands and checks exit codes — deterministic, no judgment.

Belt and suspenders: self-checking makes the external gate more likely to pass, but the gate exists independently as a safety net. Even if self-checking is perfect, the gate still runs.

## Complexity scaling

Verification effort should match task complexity:

| Complexity | What happens |
|---|---|
| Routing/delegation | No verification — just confirm the delegate received the task |
| Single file edit | One build check. Fast, sufficient |
| Multi-file, single package | Build + lint + typecheck. Catches cross-file issues |
| Cross-package | Full deterministic suite + agentic DoD review. The only case where agentic verification is warranted |

Over-verifying wastes tokens. Under-verifying misses issues. The decision table in syner.md encodes this scaling.

## Failure-type-to-response mapping

Different failures require different responses:

| Failure | Why this response |
|---|---|
| Build failure → fix and re-run | Most common, usually a typo or import. Quick fix |
| Lint/type error → fix specific issue | Targeted, don't re-run everything |
| DoD mismatch → re-read criteria, iterate | The work is technically correct but doesn't satisfy the mission. Needs reasoning, not fixing |
| Unexpected side effect → revert, narrow scope | Something broke that shouldn't have. The approach is wrong, not the execution |

This connects to the Execution Loop steps 3-4 (Verify → Iterate). Verification isn't just a gate — it's an iteration trigger.
