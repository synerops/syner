---
url: "https://www.anthropic.com/engineering/building-effective-agents"
title: "Building Effective Agents"
source: "anthropic.com"
date_saved: "2026-03-24"
tags: [orchestration, skills-architecture, agent-patterns]
---

# Building Effective Agents

Anthropic's guide to agent architecture, and it reads like a post-mortem of the exact decisions you already made with syner.

The core argument: don't build an agent that does everything. Build augmented LLMs (model + tools + retrieval) and compose them. That's what syner calls skills. The article names five workflow patterns — prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer — and `/syner` already implements routing and orchestrator-workers natively.

Where it gets interesting is the distinction between **workflows** (you define the path) and **agents** (the model defines the path). Right now syner is almost entirely workflows: the user invokes `/find-ideas`, the skill follows its steps, done. The article argues that for open-ended problems — the kind where you don't know the steps in advance — you need true agents: a loop where the model decides what to do next, uses tools, evaluates, and continues until done.

That's the gap. Syner routes well but doesn't loop. Background agents (PHILOSOPHY.md's "trigger and forget") need that loop pattern to actually work autonomously.

The other takeaway that stings: "the most successful implementations weren't using complex frameworks at all." Syner's markdown-as-primitive philosophy gets validation here — the simpler the orchestration, the more reliable the agent. Every time you're tempted to add abstraction, this article is the counterargument.
