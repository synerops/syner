---
name: syner-vercel-actions
description: Vercel operations like deploying, creating sandboxes, and managing environments. Use when the task requires deployment operations or Vercel project changes.
---

Execute actions on Vercel.

## Available Actions

- Deploy to preview or production
- Create sandbox environments
- Promote preview to production
- Rollback deployments
- Manage environment variables

## How to Execute

### Deployments

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Promote a preview to production
vercel promote <deployment-url>

# Rollback to previous deployment
vercel rollback
```

### Environment Variables

```bash
# Add environment variable
vercel env add <name> <environment>

# Remove environment variable
vercel env rm <name> <environment>
```

### Sandbox (Vercel Sandbox API)

For sandbox environments, use the Vercel Sandbox SDK when available.

## Verification

After each action, verify with:

```bash
vercel list
vercel inspect <deployment-url>
```
