---
name: syner-vercel-context
description: Context from Vercel deployments, project status, and logs. Use when the task involves deployment status, preview environments, production monitoring, or Vercel project configuration.
---

Gather context from Vercel relevant to the current task.

## What This Provides

- Current deployment status
- Recent deploy logs and errors
- Preview environment URLs
- Project configuration
- Environment variables (names only, not values)

## How to Gather

Use the Vercel CLI:

```bash
# List recent deployments
vercel list

# View deployment details
vercel inspect <deployment-url>

# View logs
vercel logs <deployment-url>

# View project info
vercel project ls
```

## Output

Condense findings into a deployment status summary:

- Current production deployment status
- Recent preview deployments
- Any failed deployments with error summary
- Relevant environment configuration
