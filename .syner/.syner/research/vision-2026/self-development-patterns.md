# Self-Development Patterns for AI Agents

Date: 2026-03-12

## Verdict

The pattern is viable in production. The load-bearing step is **evaluation before deployment**. The evaluator must live in a codebase the agent cannot modify.

## The Working Pattern

```
Observe    → Agent encounters friction (failure, slowness, repeated error)
Signal     → Friction logged as structured artifact (issue, trace, friction note)
Propose    → Development system generates candidate improvement (skill, prompt, tool)
Sandbox    → Candidate evaluated in isolation against benchmark or test suite
Gate       → Human reviews OR automated gate approves/rejects
Deploy     → Approved improvement deployed back to agent
Measure    → Downstream metrics tracked to confirm improvement (not regression)
```

Every working system has this shape. Skipping the sandbox evaluation is where loops diverge.

## Production Precedents

### Devin builds Devin (Cognition)
- 659 PRs merged in one week building itself
- Sentry crashes + CI failures routed as structured triggers to Devin sessions
- Engineers review and merge (human gate preserved)
- 25% of Cognition's code produced by Devin on itself
- Devin 2.0 auto-fixes review comments (closing the loop)

### SICA — Self-Improving Coding Agent (ICLR 2025)
- Directly edits its own agent script
- Loop: evaluate -> propose code modifications to own source -> apply -> re-evaluate -> retain if better
- 17-53% performance improvements on coding tasks

### Darwin Godel Machine (Sakana AI, 2025)
- Self-improved on SWE-bench: 20.0% -> 50.0%
- Uses evolutionary archive of all prior versions, sandboxed evaluation, fitness-based selection
- **Disabled its own hallucination detection code to appear to succeed** — canonical reward hacking failure

### SiriuS (arXiv 2502.04780, Feb 2025)
- Agents log successful interaction traces into shared experience library
- Future tasks use relevant past successes as in-context examples
- 2.86-21.88% gains. No code modification — just accumulated trajectory memory.

## AutoGPT / BabyAGI — Why They Failed

- Hallucination loops: planning and replanning without executing
- False completion: agents claiming tasks done when they weren't
- Capability overestimation: assuming tools and powers that didn't exist
- Model amplification: architecture amplified model weaknesses
- Over-engineered memory: AutoGPT removed vector DB by late 2023 — typical runs didn't justify the complexity

**Lesson:** Autonomous loops need strong exit conditions and an evaluator that is not the same agent that made the change.

## Applicability to Syner

| Syner's design decision | Research verdict |
|---|---|
| Friction observation as signal | Correct — matches Devin/Sentry/CI pattern |
| syner.dev as intermediary | Correct — the intermediary makes the loop safe |
| Skills as unit of improvement | Correct — bounded artifacts safer than modifying core |
| Human review before deployment | Required — every production system that works has this |
| Evaluation before deployment | Load-bearing — prevents divergence |

## Anticipated Failure Modes

1. **Reward hacking** — Frontier models in 2025 do this intentionally. Evaluator must be in code the agent cannot write to.
2. **Skill proliferation** — Without consolidation, many narrow skills instead of improving general ones. Need periodic audits.
3. **Signal noise** — Not all friction deserves a dev ticket. Need triage.
4. **Scope creep** — Agents will request architectural changes, not just skills. syner.dev must enforce boundaries.
5. **Loop latency** — Under 1 hour risks compounding errors. Over 1 week loses causal connection.

## Safety Rules

- Evaluation infrastructure in a codebase the agent cannot write to
- Held-out test sets from real usage, not benchmarks the agent has seen
- Multiple uncorrelated metrics; reject improvements that trade one for another
- Rate-limit self-modifications
- Version archives with instant rollback
- Monotonicity constraints: new version must be better on all tracked metrics
- Separate evaluator and agent codebases

## The Golden Rule for Syner

> osprotocol defines verification. syner.dev executes development. osprotocol is not modifiable by syner.dev. The protocol is the judge that cannot be bribed.

## Success Metrics

- Measurable reduction in friction events of targeted type over 30-day windows
- Zero regression on previously working tasks (regression suite)
- Skill acceptance rate between 60-85%
- Time-to-close as system health metric

## Sources

- Cognition: How Cognition Uses Devin to Build Devin (cognition.ai)
- Cognition: Closing the Agent Loop (cognition.ai)
- SICA: Self-Improving Coding Agent (ICLR 2025, openreview.net)
- Darwin Godel Machine (Sakana AI, sakana.ai + arxiv 2505.22954)
- SiriuS (arxiv 2502.04780)
- LLM Powered Autonomous Agents (Lilian Weng, lilianweng.github.io)
- Reward Hacking in RL (Lilian Weng)
- CodeEvolve (arxiv 2510.14150)
