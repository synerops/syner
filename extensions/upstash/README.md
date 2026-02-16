# @syner/upstash

Upstash Redis integration for Syner OS. Provides a distributed cache implementation with efficient Set-based invalidation.

## Setup

### 1. Create an Upstash Redis Database

1. Go to [Upstash Console](https://console.upstash.com/)
2. Click **Create Database**
3. Choose a name and region (select the region closest to your deployment)
4. Select **TLS** enabled (recommended)
5. Click **Create**

### 2. Get Your Credentials

After creating the database, go to the **REST API** section and copy:

- **UPSTASH_REDIS_REST_URL** - The REST API endpoint
- **UPSTASH_REDIS_REST_TOKEN** - The REST API token

### 3. Configure Environment Variables

Add these to your `.env` or deployment environment:

```env
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### 4. Install the Package

```bash
bun add @syner/upstash
```

> **Vercel Users**: You can use the [Upstash Integration](https://vercel.com/integrations/upstash) to automatically provision a database and inject environment variables into your project.

## Usage

```typescript
import { createUpstashCache } from '@syner/upstash/cache'

const cache = createUpstashCache()

// Store a cache entry
await cache.set('github:content:owner/repo:main:README.md', {
  data: { content: '# Hello' },
  etag: '"abc123"',
  metadata: { invalidationKey: 'owner/repo' },
})

// Retrieve
const entry = await cache.get('github:content:owner/repo:main:README.md')

// Invalidate all entries for a repo (uses Set-based index)
const count = await cache.invalidate('owner/repo')

// Check stats
const stats = await cache.stats()
console.log(`Hits: ${stats.hits}, Misses: ${stats.misses}`)
```

### Custom Redis Client

```typescript
import { Redis } from '@upstash/redis'
import { createUpstashCache } from '@syner/upstash/cache'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const cache = createUpstashCache({
  redis,
  defaultTtl: 60 * 60 * 24, // 1 day
  prefix: 'myapp:cache:',
})
```

## API

### `createUpstashCache(options?)`

Creates a `Cache` instance backed by Upstash Redis.

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `redis` | `Redis` | `Redis.fromEnv()` | Upstash Redis client |
| `defaultTtl` | `number` | `2592000` (30 days) | Default TTL in seconds |
| `prefix` | `string` | `"cache:"` | Key prefix for all entries |

### Cache Methods

| Method | Description |
|--------|-------------|
| `get<T>(key)` | Get a cache entry |
| `set<T>(key, entry, ttl?)` | Store an entry |
| `delete(key)` | Delete an entry |
| `has(key)` | Check if key exists |
| `invalidate(pattern)` | Invalidate by key or glob pattern |
| `stats()` | Get cache statistics |

## Invalidation Strategy

The cache uses Set-based indexing for efficient invalidation:

1. **Fast path**: When `metadata.invalidationKey` is provided, entries are indexed in a Redis Set
2. **Invalidation**: `cache.invalidate('owner/repo')` looks up the Set and deletes all indexed keys
3. **Slow path**: Glob patterns (containing `*` or `?`) fall back to SCAN

### Redis Key Structure

```
cache:{key}              → JSON-serialized CacheEntry
cache:index:{invKey}     → Set of cache keys with that invalidationKey
```

## License

MIT
