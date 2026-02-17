# @syner/upstash

Upstash Redis cache implementing `Cache` from `@osprotocol/schema/system/data`.

## Usage

```typescript
import { createUpstashCache } from '@syner/upstash/system/data/cache'

const cache = createUpstashCache()

// Set with invalidation key for bulk invalidation
await cache.set('github:content:owner/repo:main:README.md', {
  data: { content: '# Hello' },
  metadata: { invalidationKey: 'owner/repo' },
})

// Get
const entry = await cache.get<MyType>('my-key')

// Invalidate all entries for a repo
await cache.invalidate('owner/repo')
```

## Key Files

| File | Purpose |
|------|---------|
| `src/system/data/cache/upstash.ts` | `createUpstashCache()` implementation |
| `src/system/data/cache/index.ts` | Exports |

## Environment

Requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
