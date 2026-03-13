# Research: Orchestration

> Date: 2026-03-10
> Scope: Concept-agnostic research on orchestration as a discipline
> Status: Reference document

---

## 1. Definition

**Orchestration** is the automated coordination of complex systems, where a central entity manages how different components interact, decides execution order, and handles communication to ensure each component performs its function in the right sequence.

The term comes from music: an orchestrator arranges how different instruments play together to create a unified piece. In software, the orchestrator arranges how different services/agents/components work together to complete a task.

> "Architecture is the fundamental organization of a system embodied in its components, their relationships to each other, and to the environment, and the **principles guiding its design and evolution**."
> — IEEE

---

## 2. Orchestration vs Choreography

The fundamental debate in distributed systems.

| Aspect | Orchestration | Choreography |
|--------|---------------|--------------|
| **Control** | Centralized coordinator | Decentralized, peer-to-peer |
| **Communication** | Command-driven | Event-driven |
| **Coupling** | Tighter (coordinator knows all) | Looser (components independent) |
| **Visibility** | Single point of observation | Distributed, harder to trace |
| **Failure** | Single point of failure | More resilient |
| **Scaling** | Bottleneck risk | Scales horizontally |

### When to Use Orchestration

- Tasks must execute in specific order
- Transactions require atomicity (all or nothing)
- Need to wait for intermediate step completion
- Monitoring and debugging must be centralized
- Strong dependencies between components

**Example:** A purchase transaction requiring payment → inventory → shipping → delivery in sequence. If payment fails, everything rolls back.

### When to Use Choreography

- Work is asynchronous and independent
- Components can be decoupled
- High scale with few error conditions
- Frequent addition/removal of components
- Real-time, event-driven patterns

**Example:** Netflix's microservices - when a new movie is added, an event is published and multiple services (recommendations, notifications, analytics) react independently.

### The Hybrid Reality

> "Pure orchestration (central control) and pure choreography (distributed autonomy) each have limitations. The winning pattern involves hybrid approaches that use high-level orchestrators for strategic coordination while allowing local mesh networks for tactical execution."
> — [Multi-Agent AI Orchestration: Enterprise Strategy for 2025-2026](https://www.onabout.ai/p/mastering-multi-agent-orchestration-architectures-patterns-roi-benchmarks-for-2025-2026)

Real systems use both: orchestration for dependent workflows, choreography for independent scaling.

---

## 3. Orchestration Patterns

### 3.1 Hub-and-Spoke (Centralized)

A central orchestrator manages all interactions. AWS Transit Gateway and Microsoft's Semantic Kernel use this pattern.

```
        ┌─────────┐
        │  Agent  │
        └────┬────┘
             │
    ┌────────┼────────┐
    │        │        │
┌───┴───┐┌───┴───┐┌───┴───┐
│ Task  ││ Task  ││ Task  │
└───────┘└───────┘└───────┘
```

**Pros:** Simplified debugging, holistic view, easier governance
**Cons:** Bottleneck risk, single point of failure

### 3.2 Mesh (Decentralized)

Components communicate directly, creating resilient systems.

```
┌───────┐     ┌───────┐
│ Agent │◄───►│ Agent │
└───┬───┘     └───┬───┘
    │             │
    └──────┬──────┘
           │
       ┌───┴───┐
       │ Agent │
       └───────┘
```

**Pros:** Fault tolerance, no bottleneck, scales naturally
**Cons:** Harder to monitor, complex debugging

### 3.3 Hierarchical

Layers of orchestrators, each managing a subset of concerns.

```
       ┌─────────────┐
       │ Supervisor  │
       └──────┬──────┘
              │
    ┌─────────┼─────────┐
    │         │         │
┌───┴───┐ ┌───┴───┐ ┌───┴───┐
│ Lead  │ │ Lead  │ │ Lead  │
└───┬───┘ └───┬───┘ └───┬───┘
    │         │         │
  Workers   Workers   Workers
```

**Use case:** Microsoft's healthcare implementations - a central orchestrator manages patient flow while specialized agents handle specific tasks autonomously.

### 3.4 Event-Driven

Actions triggered by events, not commands.

```
Event Bus
═══════════════════════════════
    ↑         ↑         ↑
┌───┴───┐ ┌───┴───┐ ┌───┴───┐
│Producer│ │Consumer│ │Consumer│
└───────┘ └───────┘ └───────┘
```

**Use case:** Real-time data processing, IoT, stock price changes.

---

## 4. Multi-Agent Orchestration (2025-2026)

The rise of AI agents introduces new orchestration challenges.

### Key Patterns

| Pattern | Description |
|---------|-------------|
| **Supervisor-Worker** | Central orchestrator decomposes tasks, delegates to specialists |
| **Sequential** | Tasks in strict order, each depends on previous |
| **Concurrent** | Parallelizable tasks run simultaneously |
| **Adaptive** | Dynamic routing based on runtime conditions |

### Orchestrator Responsibilities

1. Break complex tasks into subtasks
2. Assign subtasks to specialized agents
3. Handle dependencies and data flow
4. Maintain context across interactions
5. Execute in parallel when possible
6. Synthesize final response

### When NOT to Orchestrate

> "Agent architectures exist on a spectrum of complexity, and each level introduces coordination overhead, latency, and cost. Use the lowest level of complexity that reliably meets your requirements."
> — [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/multi_agent/)

Simple tasks don't need orchestration. Over-orchestration introduces unnecessary complexity.

---

## 5. Maturity Models

Organizations evolve through orchestration maturity levels.

### Camunda's Process Orchestration Maturity Model

| Level | Description |
|-------|-------------|
| **0** | No orchestration. Automation in silos. Fragmented initiatives. |
| **1** | Basic orchestration. Some processes coordinated. |
| **2** | Defined orchestration. Processes mapped and managed. |
| **3** | Managed orchestration. Metrics, governance in place. |
| **4** | Optimized orchestration. Continuous improvement. Self-service. |

> "92% of advanced automation adopters leverage end-to-end orchestration as part of their strategy."
> — Deloitte via [Camunda](https://camunda.com/process-orchestration/maturity/)

### GÉANT's OAV Maturity Model

| Stage | Description |
|-------|-------------|
| **Integrated (Run)** | Standardized APIs, common data models, orchestrated processes |
| **Proactive (Fly)** | Predictive analytics, closed-loop processes |
| **Self-* (Energise)** | Self-discovering, self-optimizing, fully autonomous |

### Key Insight

Maturity is not just about automation - it's about **decision quality**. Higher maturity means better decisions made faster with less human intervention.

---

## 6. Architectural Decision Records (ADRs)

How orchestration decisions are captured and evolved.

### What is an ADR?

An **Architectural Decision Record** documents a single architectural decision: the context, the decision, and its consequences.

```markdown
# ADR-001: Use hub-and-spoke for agent coordination

## Status
Accepted

## Context
We need to coordinate multiple agents for complex tasks...

## Decision
We will use a central orchestrator pattern...

## Consequences
- Simplified debugging
- Single point of failure risk
- Need monitoring for bottleneck
```

### ADR Lifecycle

```
Proposed → Accepted/Rejected → [Superseded]
```

When superseding, don't delete - link both ways. This creates an evolution trail.

### Governance

> "Fitness functions are objective automated checks that verify decisions are being maintained. They make decisions testable and assurable."
> — [AWS Prescriptive Guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html)

ADRs should be:
- Version controlled (like code)
- Reviewed via PR process
- Cross-linked to show evolution
- Tested via fitness functions

---

## 7. Emergent vs Intentional Architecture

Two schools of thought on how orchestration decisions should evolve.

### Intentional Architecture

Decisions made upfront based on anticipated needs.

**Pros:** Addresses scalability early, consistent patterns
**Cons:** Can stifle innovation, may not match reality

### Emergent Architecture

Decisions emerge organically from development experience.

> "Defer architectural decisions to the last responsible moment. Architectural elements put in place to make it easy to extend in the future manifest as accidental complexity until you start using those elements."
> — [Neal Ford, Emergent Design](https://nofluffjuststuff.com/blog/neal_ford/2009/02/emergent_design__evolutionary_architecture_at_developerworks)

**Pros:** Adapts to reality, avoids premature optimization
**Cons:** Can miss scalability concerns, technical debt risk

### Evolutionary Architecture

The synthesis: intentional constraints + emergent decisions.

> "Evolutionary Architecture is forged by the perfect mix between intentional architecture and emergent design."
> — [Stefano Rossini](https://medium.com/@stefano.rossini.mail/agile-architecture-intentional-emergent-evolutionary-architectures-da77905098fc)

**Key principles:**
- Just-in-time elaboration (no predictive activity)
- Utter simplicity (no excess functionality)
- Architecturally minimalistic (architect for now, not future)

---

## 8. Decision Evolution

How orchestration decisions mature over time.

### The Pattern

```
Friction observed
    ↓
Decision proposed
    ↓
Decision tested
    ↓
Decision adopted
    ↓
Decision becomes principle
```

### Friction Types in Orchestration

| Type | Description |
|------|-------------|
| **Routing confusion** | Unclear which component handles what |
| **Boundary ambiguity** | Components doing overlapping work |
| **Context mismatch** | Loading too much/too little context |
| **Delegation hesitation** | Skipping specialists, doing everything inline |
| **Authority overlap** | Multiple components claiming same responsibility |

### From Decision to Principle

A decision becomes a principle when:
1. It's been applied consistently across multiple cases
2. It has clear success criteria
3. It can be tested (fitness function)
4. It's documented and referenced

---

## 9. Key Insights

### 1. Orchestration is about decisions, not just execution

The orchestrator's primary job is deciding **who does what**, not doing everything itself.

### 2. Complexity has cost

Every layer of orchestration adds latency, coordination overhead, and failure modes. Use the minimum complexity that works.

### 3. Hybrid beats pure

Neither pure orchestration nor pure choreography wins. Real systems combine both strategically.

### 4. Decisions evolve

What works today may not work tomorrow. Build systems that can adapt their orchestration patterns.

### 5. Visibility is non-negotiable

If you can't see what's happening, you can't improve it. Audit trails, metrics, and observability are core requirements.

---

## 10. Sources

### Multi-Agent Orchestration
- [Multi-Agent AI Orchestration: Enterprise Strategy for 2025-2026](https://www.onabout.ai/p/mastering-multi-agent-orchestration-architectures-patterns-roi-benchmarks-for-2025-2026)
- [AI Agent Orchestration Patterns - Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)
- [What is AI Agent Orchestration? - IBM](https://www.ibm.com/think/topics/ai-agent-orchestration)
- [OpenAI Agents SDK - Agent Orchestration](https://openai.github.io/openai-agents-python/multi_agent/)
- [Top 10+ Agentic Orchestration Frameworks & Tools 2026](https://aimultiple.com/agentic-orchestration)

### Choreography vs Orchestration
- [Orchestration vs. Choreography - GeeksforGeeks](https://www.geeksforgeeks.org/system-design/orchestration-vs-choreography/)
- [Orchestration vs Choreography - Camunda](https://camunda.com/blog/2023/02/orchestration-vs-choreography/)
- [Microservices Choreography vs. Orchestration - Solace](https://solace.com/blog/microservices-choreography-vs-orchestration/)

### Maturity Models
- [Process Orchestration Maturity Model - Camunda](https://camunda.com/process-orchestration/maturity/)
- [Network Automation & Orchestration Maturity Model - Itential](https://www.itential.com/resource/guide/network-automation-orchestration-maturity-model/)
- [OAV Maturity Model - GÉANT](https://connect.geant.org/2025/04/01/orchestration-automation-and-virtualisation-oav-maturity-model-a-tool-to-assess-where-you-are-and-help-you-reach-the-next-level)

### Architecture Decision Records
- [ADR Process - AWS Prescriptive Guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html)
- [Architecture Decision Record - adr.github.io](https://adr.github.io/)
- [Maintain an ADR - Microsoft Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record)

### Emergent Architecture
- [Evolutionary Architecture: 24 Principles](https://davidfrico.com/evolutionary-architecture-principles.pdf)
- [Emergent Architecture: The Rise of Messy, Inconsistent, and Agile Architecture](https://medium.com/@m.peluso/emergent-architecture-the-rise-of-messy-inconsistent-and-agile-architecture-8e07ebc4d73c)
- [Intentional, Emergent & Evolutionary Architectures](https://medium.com/@stefano.rossini.mail/agile-architecture-intentional-emergent-evolutionary-architectures-da77905098fc)

### General Architecture
- [InfoQ Software Architecture and Design Trends Report 2025](https://www.infoq.com/articles/architecture-trends-2025/)
- [O'Reilly Signals for 2026](https://www.oreilly.com/radar/signals-for-2026/)
