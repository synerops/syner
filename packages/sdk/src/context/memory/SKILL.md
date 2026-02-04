---
name: memory
description: Session memory for storing and retrieving information
protocol:
  domain: context
  api: memory
---

# Memory

Session-based memory for storing and retrieving information during conversations.

## Capabilities

- Store key-value information
- Retrieve stored information
- Memory scoping (session, user, global)
- Memory expiration

## When to Use

- Need to remember information across turns
- Storing user-provided data for later
- Building context from conversation
