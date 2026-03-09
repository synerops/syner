# @syner/vercel

AI SDK tools for syner agents, running in Vercel Sandbox.

## Tools

<!-- auto:tools -->
| Tool | Description |
|------|-------------|
| `Bash` | Execute commands in isolated sandbox |
| `Fetch` | Fetch URL content as markdown (truncated to 50k chars) |
| `Read` | Read files with optional line offset and limit |
| `Write` | Write content to files (creates parent directories) |
| `Glob` | Find files matching a glob pattern |
| `Grep` | Search for pattern in files using regex |
<!-- /auto:tools -->

All tools run in Vercel Sandbox for security isolation.

## Usage

### Standalone (ephemeral sandbox per call)

```typescript
import { Bash, Fetch, Read, Write, Glob, Grep } from '@syner/vercel'

const tools = { Bash, Fetch, Read, Write, Glob, Grep }
```

### Shared sandbox (reuse across calls)

```typescript
import { createAgentSandbox, createTools, stopSandbox } from '@syner/vercel'

// Create sandbox with repo cloned
const { sandbox, workdir } = await createAgentSandbox({
  repoUrl: 'https://github.com/org/repo.git',
  branch: 'main',
})

// Create tools that share this sandbox
const tools = createTools(sandbox)

// Use tools...
// tools.Bash, tools.Read, etc.

// Cleanup when done
await stopSandbox(sandbox)
```

### Select specific tools

```typescript
import { createAgentSandbox, createToolsByName, stopSandbox } from '@syner/vercel'

const { sandbox } = await createAgentSandbox({ repoUrl: '...' })
const tools = createToolsByName(sandbox, ['Bash', 'Read', 'Grep'])
```

## Requirements

- `vercel link` + `vercel env pull` for Sandbox auth
