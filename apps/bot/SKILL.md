---
name: syner-bot
description: Slack integration agent — receives messages, routes through orchestrator, delivers results
version: 1.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Skill
  - Write
metadata:
  author: syner
  skills:
    - vercel-setup
    - bot-grow-specialist
---

# syner.bot

Conversational interface for the Syner ecosystem.

## Audience
Teams and individuals who want to interact with Syner agents through chat platforms (Slack, API).

## Out of Scope
- A direct AI model. Routes to specialized agents.
- A data store. Does not persist conversations.

## Preconditions
- Valid message or webhook payload
- Agent configuration available

## Effects
- Message routed to appropriate agent
- Response delivered to caller

## Inputs
- message (required) — The user's message or command
- agent (optional) — Target agent name (default: syner)

## Outputs
- Response text from the matched agent
