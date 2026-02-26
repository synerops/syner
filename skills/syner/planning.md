# Planning Reference

Workflow patterns reference for decision-making.
Based on [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents).

## Prompt Chaining

Sequence of steps where each LLM call processes the output of the previous one. Each step transforms or refines the result before passing it to the next.

**When to use this workflow:**
- Tasks with fixed, known subtasks
- Each step has a clear, defined purpose
- Processing pipeline where order matters

**Examples:**
- `backlog-reviewer` → `backlog-triager` (clean, then prioritize)
- lint → test → commit (sequential validation)
- read notes → filter context → execute task
- parse input → validate → transform → output

## Routing

Classify input and direct it to a specialized task. An initial classifier determines which path to follow.

**When to use this workflow:**
- Distinct categories requiring different treatment
- Varied inputs needing specialized handlers
- Optimization: route to most appropriate model/process

**Examples:**
- Triager item → create issue vs stay in backlog
- User request → specialized skill vs direct execution
- Code change → performance review vs UI review
- Query type → simple lookup vs complex analysis

### Routing: Triager → Issue Creation

```
Triager item (P1/P2 Open)
         │
         ▼
      ROUTING
         │
    ┌────┴────┐
    ▼         ▼
 Actionable   Not actionable
 + Scoped     or vague
    │              │
    ▼              ▼
 gh issue      Stays in
 create +      backlog
 @claude
```

**Routing criteria for issue creation:**
- Status: Open or Partial
- Priority: P1 or P2
- Has identified files/paths
- Defined scope (not an epic)

### Issue Template

When a triager item passes routing as "actionable":

```bash
gh issue create \
  --title "..." \
  --body "## Context
[Context from the backlog item]

## Task
[Clear description of what to do]

## Files
[Relevant files identified by triager]

## Acceptance Criteria
[Success criteria]

---
@claude Please review this issue and implement the task. Use the code-reviewer subagent to validate changes."
```

## Parallelization

Execute multiple tasks simultaneously. Two variants:
- **Sectioning**: independent tasks in parallel
- **Voting**: same task N times for multiple perspectives

**When to use this workflow:**
- Independent subtasks with no dependencies between them
- Exploring multiple paths simultaneously
- Verifications that can run in parallel
- Need for multiple perspectives (voting)

**Examples:**
- Explore multiple code areas simultaneously
- Run lint + tests + type-check in parallel
- Search notes + backlog + code at the same time
- Multiple agents analyzing the same problem (voting)

## Orchestrator-Workers

Central LLM that analyzes the task and delegates to workers dynamically. The orchestrator decides which workers to invoke based on input context.

**When to use this workflow:**
- Complex tasks where subtasks are not predefined
- Need to adapt strategy based on input
- Coordination of multiple specialists
- Tasks requiring dynamic breakdown

**Examples:**
- `/syner` with ambiguous task → delegates to skills based on context
- Large refactor → orchestrates changes across multiple files
- Bug fix → investigates, identifies, delegates correction
- Feature implementation → decomposes and assigns subtasks

## Evaluator-Optimizer

One agent generates, another evaluates, refinement loop until quality criteria met.

**When to use this workflow:**
- Quality requires iteration and refinement
- Clear success criteria for evaluation
- Initial output likely needs improvements
- Creative or generative tasks

**Examples:**
- Write code → code-reviewer → fix → re-review
- Generate plan → verify against requirements → adjust
- Create issue → validate sufficient context → refine
- Draft documentation → review clarity → improve → verify

## Choosing the Right Pattern

| Situation | Pattern |
|-----------|---------|
| Fixed sequence of steps | Prompt Chaining |
| Different types need different handling | Routing |
| Independent tasks, no dependencies | Parallelization |
| Complex task, dynamic subtasks | Orchestrator-Workers |
| Quality requires iteration | Evaluator-Optimizer |

Combining patterns is common: Orchestrator can use Parallelization for its workers, or Prompt Chaining can include a Routing step.
