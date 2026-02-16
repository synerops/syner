# @syner/upstash

## Overview

Upstash Redis extension implementing the SDK's `Cache` interface with Set-based indexing for efficient pattern invalidation.

## Architecture

```
Consumer (@syner/github)                    @syner/upstash
┌─────────────────────────────┐            ┌──────────────────────────────┐
│ cache.set(key, {            │            │  Redis Keys:                 │
│   data: content,            │───────────▶│  cache:{key} → CacheEntry    │
│   metadata: {               │            │  cache:index:{invKey} → Set  │
│     invalidationKey: 'o/r'  │            └──────────────────────────────┘
│   }                         │
│ })                          │            Invalidation:
│                             │            cache.invalidate('owner/repo')
│ cache.invalidate('o/r')     │───────────▶ SMEMBERS + DEL (O(n) keys in group)
└─────────────────────────────┘
```

## Redis Key Structure

| Pattern | Type | Description |
|---------|------|-------------|
| `cache:{key}` | String | JSON-serialized `CacheEntry` |
| `cache:index:{invalidationKey}` | Set | Cache keys sharing this invalidation key |

## Invalidation Strategy

1. **Set-based (Fast)**: When `invalidate(pattern)` is called, first check for `cache:index:{pattern}` Set
2. **SCAN-based (Slow)**: If no Set exists and pattern contains `*` or `?`, fall back to SCAN

### Complexity

- **Set-based**: O(n) where n = keys in the invalidation group
- **SCAN-based**: O(N) where N = total keys in Redis (avoid in production)

## Implementation Notes

- Stats (`hits`/`misses`) are per-instance, reset on cold start
- Index Set TTL is 1 hour longer than cache entries to ensure cleanup
- `dbsize()` returns total Redis keys, not just cache namespace
- Expired entries are double-checked in `get()` for safety (Redis TTL is primary)

## Files

```
src/
├── index.ts              # Re-exports cache module
├── index.d.ts            # Type declarations
└── cache/
    ├── index.ts          # Module exports
    ├── index.d.ts        # Type declarations
    └── upstash.ts        # Cache implementation
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `UPSTASH_REDIS_REST_URL` | Yes* | Upstash REST API URL |
| `UPSTASH_REDIS_REST_TOKEN` | Yes* | Upstash REST API token |

*Required when using `Redis.fromEnv()` (default behavior).
