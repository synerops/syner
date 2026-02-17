# @syner/vercel

Vercel Sandbox integration for Syner OS. Provides ephemeral code execution environments with filesystem operations.

## Overview

This extension provides sandbox execution capabilities for Syner OS agents. Agents use the sandbox to:

- **Execute code safely** in isolated ephemeral environments
- **Read and write files** within the sandbox filesystem
- **Reuse existing sandboxes** automatically to optimize resource usage

The sandbox implements the `Sandbox` interface from `@syner/sdk` and provides AI SDK tools for agent integration.

```typescript
import { createSandbox, writeFiles, readFile } from '@syner/vercel/system/sandbox'

// Tools are AI SDK compatible
const tools = {
  createSandbox: createSandbox(),
  writeFiles: writeFiles(),
  readFile: readFile(),
}
```

## Setup

### 1. Get Vercel Access

The Vercel Sandbox SDK requires a Vercel account with access to the Sandbox feature.

### 2. Install the Package

```bash
bun add @syner/vercel
```

### 3. Configure Dependencies

Ensure `@syner/sdk` is available as it provides the `Sandbox` interface and environment management.

## API

### Tools

| Tool | Description |
|------|-------------|
| `createSandbox()` | Create or reuse an ephemeral sandbox environment |
| `writeFiles()` | Write files to the sandbox filesystem |
| `readFile()` | Read a file from the sandbox filesystem |

### Utilities

| Function | Description |
|----------|-------------|
| `getSandbox()` | Get current sandbox from environment |
| `filesystem` | `Filesystem` interface implementation |

## Usage

### Creating a Sandbox

```typescript
import { createSandbox } from '@syner/vercel/system/sandbox'

const tool = createSandbox()
const result = await tool.execute({})
// { message: 'Sandbox created...', sandbox: { id, status, timeout } }
```

The tool automatically reuses existing active sandboxes (returns `reused: true`).

### File Operations

```typescript
import { writeFiles, readFile } from '@syner/vercel/system/sandbox'

// Write files
const write = writeFiles()
await write.execute({
  files: [
    { path: 'src/index.ts', content: 'export const hello = "world"' }
  ]
})

// Read file
const read = readFile()
const result = await read.execute({ path: 'src/index.ts' })
// { exists: true, content: '...', size: 42 }
```

## Dependencies

| Package | Type | Description |
|---------|------|-------------|
| `@syner/sdk` | dependency | Sandbox interface and environment |
| `@vercel/sandbox` | dependency | Vercel Sandbox SDK |
| `ai` | peer | AI SDK for tool definitions |
| `zod` | peer | Schema validation |

## License

MIT
