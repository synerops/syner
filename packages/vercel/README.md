# @syner/vercel

AI SDK tools for syner agents.

## Tools

| Tool | Description |
|------|-------------|
| Bash | Execute commands in isolated Vercel Sandbox |
| Fetch | Fetch URL content with Accept: text/markdown |

## Usage

```typescript
import { Bash, Fetch } from '@syner/vercel'

const tools = { Bash, Fetch }
```

## Requirements

- `vercel link` + `vercel env pull` for Sandbox auth
