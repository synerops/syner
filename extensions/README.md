# Syner OS Extensions

Extensions provide vendor-specific implementations of [OS Protocol](https://osprotocol.dev) interfaces.

## OS Protocol

The **Operating System Protocol** is the foundation of all Syner OS extensions. It defines TypeScript interfaces that establish contracts for capabilities like caching, sandboxing, filesystem operations, and more.

- **Website**: [osprotocol.dev](https://osprotocol.dev)
- **GitHub**: [github.com/synerops/protocol](https://github.com/synerops/protocol)
- **npm**: [`@osprotocol/schema`](https://www.npmjs.com/package/@osprotocol/schema)

The protocol is vendor-agnostic — it defines *what* capabilities must do, not *how* they're implemented. This allows extensions to provide alternative implementations (Redis instead of in-memory, Vercel instead of local execution) while maintaining a consistent API.

```typescript
// Protocol defines the interface
import type { Cache } from '@osprotocol/schema/system/data'

// Extensions implement it
import { createUpstashCache } from '@syner/upstash/system/data/cache'
import { createMemoryCache } from '@syner/sdk/system/data/cache'

// Both satisfy the same Cache interface
const cache: Cache = createUpstashCache()  // Redis-backed
const cache: Cache = createMemoryCache()   // In-memory
```

## Architecture

```
OS Protocol (@osprotocol/schema)    ← Defines interfaces (Cache, Sandbox, etc.)
              ↓
SDK (@syner/sdk)                    ← Default implementations (in-memory, local)
              ↓
Extensions (@syner/*)               ← Alternative implementations (Redis, Vercel, etc.)
```

**Key principle**: Extensions implement protocol interfaces, not SDK abstractions. This ensures interoperability across the ecosystem.

## Available Extensions

| Package | Description | Implements |
|---------|-------------|------------|
| `@syner/github` | GitHub OAuth and content API | - |
| `@syner/upstash` | Upstash Redis cache | `Cache` |
| `@syner/vercel` | Vercel sandbox execution | `Sandbox` |

## Creating an Extension

1. Create directory: `extensions/your-vendor/`
2. Add `package.json` with name `@syner/your-vendor`
3. Implement protocol interfaces from `@osprotocol/schema`
4. Export from subpaths matching protocol domains

### Example Structure

```
extensions/your-vendor/
├── package.json
├── AGENTS.md          # Agent-focused docs (concise)
├── README.md          # Human-focused docs (setup, API)
├── src/
│   ├── index.ts
│   └── system/
│       └── data/
│           └── cache/
│               └── index.ts    # implements Cache interface
└── tsconfig.json
```

### Key Rules

- Import interfaces from `@osprotocol/schema`, NOT from `@syner/sdk`
- Export from subpaths matching protocol structure (e.g., `system/data/cache`)
- Peer-depend on `@osprotocol/schema` for interface types

## Development

```bash
# Build all extensions
bunx turbo run build --filter="./extensions/*"

# Typecheck
bunx turbo run typecheck --filter="./extensions/*"
```

## License

MIT
