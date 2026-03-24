---
url: "https://www.anthropic.com/engineering/building-effective-agents"
title: "Building Effective Agents"
description: "A practical guide to building LLM-powered agents, covering workflows, patterns, and when to use them."
source: "anthropic.com"
author: "Erik Schluntz, Barry Zhang"
date_saved: "2026-03-24"
date_published: "2024-12-20"
tags: [ai, agents, guide, anthropic, patterns]
---

# Building Effective Agents

> Practical guide from Anthropic on when and how to build LLM agents — favoring simplicity and composable patterns over complex frameworks.

## Why

Foundational reference for agent architecture. Directly relevant to how syner orchestrates skills and subagents.

## Key Ideas

- **Start simple**: Use single LLM calls with retrieval and context before reaching for agents. Add complexity only when needed.
- **Workflows vs agents**: Workflows are predefined orchestration of LLMs; agents let models dynamically direct their own process. Know which you need.
- **Building blocks**: Augmented LLMs (retrieval, tools, memory) are the atomic unit — everything else composes from these.
- **Proven patterns**: Prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer — each fits specific use cases.
- **Agents for open-ended problems**: True agents (loop of LLM decisions + tool use) shine when problems require flexibility and model-driven decisions.

## Links

- [Original](https://www.anthropic.com/engineering/building-effective-agents)
