# @syner/vercel

Vercel Sandbox extension for Syner OS.

This package provides a vendor-specific implementation of the Sandbox protocol using Vercel Sandbox.

## Installation

```bash
pnpm add @syner/vercel @syner/sdk
```

## Usage

```typescript
import { createVercelSandbox } from '@syner/vercel';
import { run } from '@syner/sdk';

// Create sandbox
const sandbox = await createVercelSandbox({
  runtime: 'node22',
  source: {
    url: 'https://github.com/user/repo.git',
    type: 'git',
  },
});

// Execute run
const result = await run({
  task: 'Change hero of landing page',
  inSandbox: true,
  project: { url: 'https://github.com/user/repo.git' },
  sandbox,
});
```

## Authentication

Vercel Sandbox supports two authentication methods:

### OIDC Token (Recommended)

Use Vercel OIDC token when available. Download a development token:

```bash
vercel link
vercel env pull
```

This creates a `.env.local` file with `VERCEL_OIDC_TOKEN`.

### Access Token

Alternatively, use an access token:

1. Get your team ID from team settings
2. Get your project ID from project settings
3. Create a token at https://vercel.com/account/settings/tokens
4. Set environment variables:
   - `VERCEL_TEAM_ID`
   - `VERCEL_PROJECT_ID`
   - `VERCEL_TOKEN`

Or pass them directly:

```typescript
const sandbox = await createVercelSandbox({
  teamId: process.env.VERCEL_TEAM_ID,
  projectId: process.env.VERCEL_PROJECT_ID,
  token: process.env.VERCEL_TOKEN,
  runtime: 'node22',
});
```

## Requirements

- Node.js 20+
- Vercel account with Sandbox access
- Vercel project linked (for OIDC) or access token

