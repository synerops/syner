# @syner/upstash

Upstash Redis integration for Syner OS — implements the Cache capability from the OS Protocol.

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

This extension provides `createUpstashCache()` which returns an object satisfying the `Cache` interface from `@osprotocol/schema`. It is a production-grade replacement for the SDK's in-memory cache (`createMemoryCache`).

## Verification

After updating imports, run:

```bash
bunx turbo run typecheck --filter=@syner/upstash
```

The `Cache` interface is identical between `@osprotocol/schema` and what `@syner/sdk` re-exports — the SDK itself re-exports from the protocol. But extensions should import from the protocol directly.
