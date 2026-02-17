# Syner OS Extensions

Extensions provide vendor-specific implementations of OS Protocol interfaces.

## Architecture

```
Protocol (@osprotocol/schema)    ← Defines interfaces (Cache, Sandbox, etc.)
         ↓
SDK (@syner/sdk)                 ← Default implementations (in-memory cache, etc.)
         ↓
Extensions (@syner/*)            ← Alternative implementations (Redis, Vercel, etc.)
```

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
