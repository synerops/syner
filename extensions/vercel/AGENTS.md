# @syner/vercel

Vercel Sandbox integration. Implements `Sandbox` from `@syner/sdk/system/env/sandbox`.

## Usage

```typescript
import { createSandbox, getSandbox } from '@syner/vercel/system/sandbox'

// Create sandbox (stores in environment)
const sandbox = await createSandbox()

// Get current sandbox from environment
const current = getSandbox(env)

// Filesystem operations
const stream = await sandbox.filesystem.readFile('src/index.ts')
await sandbox.filesystem.writeFiles([
  { path: 'src/app.ts', content: 'export const app = {}' }
])
```

## Key Files

| File | Purpose |
|------|---------|
| `src/system/sandbox/tools/create.ts` | `createSandbox` tool |
| `src/system/sandbox/tools/files.ts` | `readFile`, `writeFiles` tools |
| `src/system/sandbox/index.ts` | Exports |

## Dependencies

- `@syner/sdk` - Protocol interface (peer dependency)
- `@vercel/sandbox` - Vercel Sandbox SDK
