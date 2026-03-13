# Orchestration Friction Observations

Raw observations of orchestration decisions that lacked clear criteria.
These will be reviewed for patterns → proposals → principles.

---

## 2026-03-10 - overlap

**Friction:** Agent and skill doing the same thing - `syner` agent and `/syner` skill both exist as orchestrators
**Context:** Discovered during codebase exploration that `agents/syner.md` and `skills/syner/SKILL.md` serve overlapping purposes. Both route tasks, both load context, both delegate.
**Would have helped:** Clear criteria for when something should be an agent vs a skill. Principle that prevents creating both for the same capability.

**Research evidence:** `.syner/research/syner-agent-vs-skill.md`
- Ambas descripciones casi idénticas ("main orchestrator" vs "orchestrator for tasks")
- Agent carga el skill (`skills: - syner`) sin razón clara
- Diferencias reales existen pero no documentadas:
  - Skill: interactive, hereda model, no tiene Agent() tool
  - Agent: background/autonomous, opus explícito, tiene Agent() tool
- Invocación confusa: `/syner` (skill) vs `Task(syner)` (agent)

**Proposed principle (from research):**
- Skill = user-facing interactive entry point
- Agent = autonomous/background orchestration (CI, webhooks, schedules)

---
