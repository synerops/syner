# @syner/upstash

Upstash Redis KV store implementing `Kv` from `@osprotocol/schema/context/kv`.

## Usage

```typescript
import { createUpstashKv } from '@syner/upstash/context/kv'

const kv = createUpstashKv()

// Set a value
await kv.set('user:123', { 
  name: 'Alice',
  role: 'admin' 
})

// Get a value
const entry = await kv.get<User>('user:123')

// Remove a value
await kv.remove('user:123')

// List keys by prefix
const userKeys = await kv.list('user:')
```

## Key Files

| File | Purpose |
|------|---------|
| `src/context/kv/upstash.ts` | `createUpstashKv()` implementation |
| `src/context/kv/index.ts` | Exports |

## Environment

Requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.