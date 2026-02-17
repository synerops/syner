# Extensions

Extensions provide alternative implementations of OS Protocol interfaces.

## Available Extensions

| Extension | Purpose | Key Export |
|-----------|---------|------------|
| `@syner/github` | GitHub OAuth + cached content API | `getFileContent`, `createAuthorizationUrl` |
| `@syner/upstash` | Distributed Redis cache | `createUpstashCache` |
| `@syner/vercel` | Vercel sandbox execution | `createSandbox` |

## When to Use

- **Need GitHub API?** → `@syner/github` (with `@syner/upstash` for caching)
- **Need distributed cache?** → `@syner/upstash` (implements `Cache` from protocol)
- **Need code execution?** → `@syner/vercel` (implements `Sandbox` from protocol)

## Import Pattern

Extensions export from subpaths matching protocol domains:

```typescript
import { createUpstashCache } from '@syner/upstash/system/data/cache'
import { getFileContent } from '@syner/github'
```

See individual extension AGENTS.md for usage details.
