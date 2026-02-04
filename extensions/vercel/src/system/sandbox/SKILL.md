---
name: vercel-sandbox
description: Cloud-based sandbox execution via Vercel infrastructure
protocol:
  domain: system
  api: sandbox
extends: system/sandbox
---

# Vercel Sandbox

Cloud-based sandbox execution using Vercel's ephemeral environments.

## Capabilities

- Create cloud-based isolated environments
- Execute code on Vercel's edge infrastructure
- File system operations within sandbox
- Automatic cleanup and resource management

## When to Use

- Need cloud execution (not local)
- Require Vercel-specific features
- Production-grade isolation needed
- Multi-file code execution

## Requirements

- Vercel account with sandbox access
- `VERCEL_TOKEN` environment variable
