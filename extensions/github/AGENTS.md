# @syner/github

GitHub OAuth and API integration for Syner OS — uses the Cache capability from the OS Protocol for ETag-based API response caching.

## Important: Interface Source

`@osprotocol/schema` is the single source of truth for all capability interfaces.

Import Cache types from the protocol, NOT from `@syner/sdk`:

```typescript
// Correct
import type { Cache, CacheEntry, CacheStats } from '@osprotocol/schema/system/data'

// Wrong — do not import interfaces from the SDK
import type { Cache } from '@syner/sdk/system/data/cache'
```

## Architecture

This extension uses the `Cache` interface for ETag-based revalidation of GitHub API responses. The cache implementation is injected — the extension doesn't care whether it's in-memory (SDK) or Redis (Upstash).

Key files:
- `src/cache/cache.ts` — `getCachedContent()` with ETag revalidation
- `src/cache/keys.ts` — Cache key generators (`github:content:owner/repo:ref:path`)
- `src/api/content.ts` — GitHub Content API with caching

## Verification

After updating imports, run:

```bash
bunx turbo run typecheck --filter=@syner/github
```
