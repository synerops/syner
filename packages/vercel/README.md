# @syner/vercel

AI SDK tools for syner agents, running in Vercel Sandbox.

## Tools

| Tool | Description |
|------|-------------|
| Bash | Execute commands in isolated sandbox |
| Fetch | Fetch URL content as markdown (truncated to 50k chars) |

Both tools run in Vercel Sandbox for security isolation.

## Usage

```typescript
import { Bash, Fetch } from '@syner/vercel'

const tools = { Bash, Fetch }
```

## Requirements

- `vercel link` + `vercel env pull` for Sandbox auth
