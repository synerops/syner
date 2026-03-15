# @syner/sdk

> Core runtime library for the Syner ecosystem: resolves intents to skills, loads vault context, discovers agents, and bridges execution.

## Quick Start

```jsonc
// package.json (workspace dependency)
"@syner/sdk": "workspace:*"
```

```typescript
import { execute } from '@syner/sdk'
import { resolveSkill } from '@syner/sdk/skills'
import { getAgentByName, getModel } from '@syner/sdk/agents'
import { FileSystemVaultStore, resolveContext } from '@syner/sdk/context'
```

## Key Features

- **Skill resolution** -- resolve natural language or `/slash-command` intents to skills with confidence scoring
- **Vault context** -- load markdown notes from local filesystem or Vercel Blob, scoped by app or query
- **Agent registry** -- discover agents from `agents/*.md` frontmatter, with model selection via AI Gateway
- **Execution bridge** -- full pipeline from intent to skill execution with context injection

## Usage

### Resolve a skill

```typescript
import { resolveSkill } from '@syner/sdk/skills'

const match = await resolveSkill('/app/root', '/find-ideas')
// => { slug: 'find-ideas', confidence: 1.0, skill: {...}, reason: 'Exact match: ...' }

const fuzzy = await resolveSkill('/app/root', 'find ideas about orchestration')
// => { slug: 'find-ideas', confidence: 0.8, skill: {...}, reason: 'Fuzzy match on ...' }
```

### Load vault context

```typescript
import { FileSystemVaultStore, resolveContext } from '@syner/sdk/context'

const store = new FileSystemVaultStore('.syner/vaults')
const brief = await resolveContext({ scope: 'app', app: 'vaults' }, store)
// brief.content => assembled markdown
// brief.sources => ['vaults/ideas.md', ...]
```

### Execute the full pipeline

```typescript
import { execute } from '@syner/sdk'
import { executeSkill } from '@syner/vercel'

const result = await execute({
  intent: '/find-ideas',
  task: 'Find ideas about orchestration',
  executor: executeSkill,
  executorOptions: { repoRoot, tools, model },
  projectRoot,
  vaultStore: new FileSystemVaultStore('.syner/vaults'),
  contextScope: 'targeted',
})
```

### Agent model selection

```typescript
import { getAgentByName, getModel } from '@syner/sdk/agents'

const agent = await getAgentByName(projectRoot, 'syner')
const model = getModel(agent)  // returns LanguageModel via @ai-sdk/gateway
```

## Import Paths

| Path | Contents |
|------|----------|
| `@syner/sdk` | Root barrel -- `execute`, `logger`, errors |
| `@syner/sdk/skills` | Skill registry, resolver, types |
| `@syner/sdk/agents` | Agent registry, model selection |
| `@syner/sdk/context` | VaultStore, context resolution, Brief |
| `@syner/sdk/logger` | Structured JSON logger |
| `@syner/sdk/errors` | WebhookError, AuthError, ValidationError, ConfigError |

Browser-safe: `@syner/sdk/skills` exports types and `groupByCategory` only (no Node.js dependencies).

## Dependencies

| Package | Why |
|---------|-----|
| `@syner/osprotocol` | `SkillManifest` type, `parseSkillManifest()` for SKILL.md parsing |
| `ai` | `LanguageModel` type for `getModel()` return |
| `@ai-sdk/anthropic` | Anthropic provider for model instantiation |
| `@ai-sdk/gateway` | AI Gateway for model routing with fallbacks |
| `glob` | Filesystem glob for skill and agent discovery |
| `gray-matter` | YAML frontmatter parsing for skills and agents |
| `picomatch` | Glob pattern matching in `BlobVaultStore` |
| `@vercel/blob` (optional peer) | Required only if using `BlobVaultStore` |

## Status

| Component | State | Notes |
|-----------|-------|-------|
| Skill loader/resolver | Production | Used in bot + dev apps in deployed E2E flows |
| Vault context resolution | Production | Keyword filtering is functional but basic |
| Agent card registry | Production | Powers Slack routing and model selection |
| Execution bridge | Production | Ships in E2E Slack orchestration |
| FileSystemVaultStore | Production | Local development and CI |
| BlobVaultStore | Experimental | Interface stable, not yet deployed in serverless |
| Fuzzy resolver | Functional | Token overlap only, no semantic matching |

See [AGENTS.md](./AGENTS.md) for the full API reference, type definitions, and constraints.
