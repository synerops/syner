# @syner/sdk

> Core runtime library for the Syner ecosystem: resolves intents to skills, loads vault context, discovers agents, and bridges execution.

## Exports

```typescript
// Root — re-exports everything
import {
  execute, type ExecuteOptions, type SkillExecutor,
  logger, log,
  WebhookError, AuthError, ValidationError, ConfigError,
} from '@syner/sdk'

// Skills — registry, resolver, types
import {
  getSkillsRegistry, getSkillsList, getSkillBySlug,
  getCategories, getPublicSkills, getInstanceSkills, getPrivateSkills,
  invalidateSkillsCache,
  resolveSkill, type ResolvedSkill,
  type Skill, type SkillContent, type SkillVisibility,
  groupByCategory,
} from '@syner/sdk/skills'

// Skills (browser) — types only, no Node dependencies
import { type Skill, type SkillContent, groupByCategory } from '@syner/sdk/skills'

// Agents — registry, model selection
import {
  getAgentsRegistry, getAgentsList, getAgentByName, getAgentsByChannel,
  invalidateAgentsCache, type AgentCard,
  getModel, getModelFallbacks, MODEL_IDS, FALLBACK_MODELS,
} from '@syner/sdk/agents'

// Context — vault stores, context resolution
import {
  type VaultStore,
  FileSystemVaultStore, BlobVaultStore,
  type ContextScope, type ContextRequest, type Brief,
  resolveContext,
} from '@syner/sdk/context'

// Logger
import { logger, log } from '@syner/sdk/logger'

// Errors
import { WebhookError, AuthError, ValidationError, ConfigError } from '@syner/sdk/errors'
```

## Types

### Skill

```typescript
type SkillVisibility = 'public' | 'instance' | 'private'

interface Skill {
  slug: string
  name: string
  description: string
  category: string
  version?: string
  author?: string
  visibility: SkillVisibility
  manifest?: SkillManifest  // from @syner/osprotocol
}

interface SkillContent extends Skill {
  content: string  // markdown body (frontmatter stripped)
}
```

### ResolvedSkill

```typescript
interface ResolvedSkill {
  slug: string
  skill: Skill
  confidence: number  // 0-1
  reason: string      // human-readable match explanation
}
```

### AgentCard

```typescript
interface AgentCard {
  name: string
  description?: string
  instructions: string        // markdown body from agents/*.md
  model?: 'opus' | 'sonnet' | 'haiku'
  tools?: string[]
  skills?: string[]
  channel?: string            // Slack channel ID
  metadata?: Record<string, unknown>
  protocol?: {
    version: string
    capabilities: string[]
  }
}
```

### VaultStore

```typescript
interface VaultStore {
  list(pattern: string): Promise<string[]>
  read(path: string): Promise<string | null>
  write(path: string, content: string): Promise<void>
  delete(path: string): Promise<void>
}
```

### Context

```typescript
type ContextScope = 'none' | 'targeted' | 'app' | 'full'

interface ContextRequest {
  scope: ContextScope
  app?: string    // required when scope = 'app'
  query?: string  // required when scope = 'targeted'
}

interface Brief {
  content: string     // concatenated vault markdown, ready for system prompt injection
  sources: string[]   // file paths that were loaded
  scope: ContextScope // scope that was actually resolved
  gaps: string[]      // topics requested but not found
}
```

### ExecuteOptions

```typescript
type SkillExecutor<T extends Record<string, unknown> = Record<string, unknown>> = (
  skillSlug: string,
  task: string,
  options: T
) => Promise<Result<string>>  // Result from @syner/osprotocol

interface ExecuteOptions<T extends Record<string, unknown> = Record<string, unknown>> {
  intent: string              // skill name ("/find-ideas") or natural language
  task: string                // passed to the skill subagent
  executor: SkillExecutor<T>  // typically executeSkill from @syner/vercel
  executorOptions: T          // passed through to executor
  projectRoot: string         // for skill discovery
  vaultStore: VaultStore      // for context resolution
  contextScope?: ContextScope // defaults to 'none'
  contextApp?: string         // for app-scoped context
}
```

### Errors

```typescript
class WebhookError extends Error {
  statusCode: number   // default 500
  shouldRetry: boolean // default false
}

class AuthError extends WebhookError {}     // statusCode: 401, shouldRetry: false
class ValidationError extends WebhookError {} // statusCode: 400, shouldRetry: false
class ConfigError extends WebhookError {}   // statusCode: 500, shouldRetry: false
```

## Functions

### resolveSkill(projectRoot, intent): Promise\<ResolvedSkill | null\>

Resolves an intent string to the best matching skill.

**Strategy:**
1. If intent starts with `/`, strip prefix and match slug exactly (confidence 1.0)
2. Otherwise, tokenize intent and score each skill by keyword overlap
3. Return best match above 0.3 threshold, or null

```typescript
const match = await resolveSkill('/app/root', '/find-ideas')
// => { slug: 'find-ideas', confidence: 1.0, skill: {...}, reason: 'Exact match: ...' }

const fuzzy = await resolveSkill('/app/root', 'find ideas about orchestration')
// => { slug: 'find-ideas', confidence: 0.8, skill: {...}, reason: 'Fuzzy match on ...' }
```

### getSkillsRegistry(projectRoot): Promise\<SkillsRegistry\>

Builds and caches the full skill registry by scanning `SKILL.md` files from predefined paths:
- `skills/syner`
- `apps/vaults/skills`
- `apps/dev/skills`
- `apps/bot/skills`
- `packages/github/skills`

Returns a `{ skills: Map<string, { skill, path }>, list: Skill[] }`. Results are cached per projectRoot.

### getSkillBySlug(projectRoot, slug): Promise\<SkillContent | null\>

Returns a single skill with its markdown content (frontmatter stripped). Validates slug format (`/^[a-z0-9-]+$/`) and verifies the file path is within allowed directories.

### getPublicSkills(projectRoot): Promise\<Skill[]\>

Skills with `visibility: 'public'`.

### getInstanceSkills(projectRoot): Promise\<Skill[]\>

Skills with `visibility: 'public'` or `'instance'`.

### getPrivateSkills(projectRoot, app): Promise\<Skill[]\>

Private skills scoped to a specific app directory.

### getCategories(skills): string[]

Extracts sorted unique category names from a skill array.

### groupByCategory(skills): Record\<string, Skill[]\>

Groups skills by their `category` field.

### invalidateSkillsCache(): void

Clears the in-memory skill registry cache.

### resolveContext(request, store): Promise\<Brief\>

Loads vault files matching the requested scope and assembles a Brief.

| Scope | Pattern | Behavior |
|-------|---------|----------|
| `none` | - | Returns empty Brief immediately |
| `app` | `{app}/**/*.md` | All markdown in the app's vault subdirectory |
| `targeted` | `**/*.md` | All vaults, filtered by keyword relevance to `query` |
| `full` | `**/*.md` | All vaults, no filtering |

```typescript
const store = new FileSystemVaultStore('/path/to/.syner/vaults')

const brief = await resolveContext({ scope: 'app', app: 'vaults' }, store)
// brief.content => assembled markdown with <!-- source: path --> headers
// brief.sources => ['vaults/ideas.md', 'vaults/links.md', ...]
```

### FileSystemVaultStore(root)

VaultStore implementation using `fs/promises` and `glob`. The `root` parameter is the vault directory (e.g., `.syner/vaults/`).

### BlobVaultStore(prefix?)

VaultStore implementation using `@vercel/blob`. Default prefix: `'vaults/'`. Uses `picomatch` for glob filtering on blob listings.

Requires `@vercel/blob` as a peer dependency (optional -- only needed if you instantiate `BlobVaultStore`).

### getAgentByName(projectRoot, name): Promise\<AgentCard | undefined\>

Looks up an agent by name from `agents/*.md`. Parses frontmatter into AgentCard.

### getAgentsByChannel(projectRoot): Promise\<Map\<string, AgentCard\>\>

Returns agents indexed by their Slack channel ID. Only includes agents with a `channel` configured in metadata.

### getModel(agent): LanguageModel

Returns an AI SDK `LanguageModel` via `@ai-sdk/gateway` based on the agent's model tier.

| Tier | Model ID |
|------|----------|
| `opus` | `anthropic/claude-opus-4.6` |
| `sonnet` (default) | `anthropic/claude-sonnet-4.6` |
| `haiku` | `anthropic/claude-haiku-4.5` |

### getModelFallbacks(agent): string[]

Returns fallback model IDs for the agent's tier.

| Tier | Fallbacks |
|------|-----------|
| `opus` | `claude-opus-4.5`, `claude-opus-4`, `claude-sonnet-4.6` |
| `sonnet` | `claude-sonnet-4.5`, `claude-sonnet-4`, `claude-haiku-4.5` |
| `haiku` | `claude-3.5-haiku` |

### execute\<T\>(options): Promise\<Result\<string\>\>

Full pipeline: resolve intent to skill, load vault context, inject context into task, call executor.

```typescript
import { execute } from '@syner/sdk'
import { executeSkill, type ExecuteSkillOptions } from '@syner/vercel'

const result = await execute<ExecuteSkillOptions>({
  intent: '/find-ideas',
  task: 'Find ideas about orchestration',
  executor: executeSkill,
  executorOptions: { repoRoot, tools, model },
  projectRoot,
  vaultStore: new FileSystemVaultStore('.syner/vaults'),
  contextScope: 'targeted',
})
```

**Behavior:**
1. Calls `resolveSkill()` -- if no match, passes raw intent to executor
2. Calls `resolveContext()` -- vault failures are swallowed (returns empty content)
3. If context is non-empty, appends `## Vault Context` section to task
4. Calls `executor(slug, taskWithContext, executorOptions)`

### logger / log

Structured JSON logger. Each entry includes ISO timestamp, level, message, and optional metadata.

```typescript
import { logger } from '@syner/sdk/logger'

logger.info('Skill resolved', { slug: 'find-ideas', confidence: 1.0 })
// => {"timestamp":"2026-03-14T...","level":"info","message":"Skill resolved","slug":"find-ideas","confidence":1}
```

## Errors

| Error | Status | Retryable | Thrown when |
|-------|--------|-----------|------------|
| `WebhookError` | 500 | false | Base class for all SDK errors |
| `AuthError` | 401 | false | Authentication failure |
| `ValidationError` | 400 | false | Invalid input (bad slug format, missing fields) |
| `ConfigError` | 500 | false | Missing configuration (env vars, paths) |

## Constraints

1. **Do not import `@syner/sdk/skills` in browser code expecting the full registry.** The browser condition export only provides types and `groupByCategory`. The loader and resolver require Node.js (`fs/promises`, `glob`).

2. **Do not call `getSkillBySlug()` with unsanitized input.** Slugs are validated against `/^[a-z0-9-]+$/` and paths are checked against allowed directories, but always sanitize at your API boundary first.

3. **Do not assume vault context is available.** `execute()` swallows vault store errors and proceeds with empty context. If your skill requires vault context, check `brief.content.length` or `brief.sources.length` before proceeding.

4. **Do not instantiate `BlobVaultStore` without `@vercel/blob` installed.** It is an optional peer dependency. The import will fail at runtime if the package is not present.

5. **Skill discovery paths are hardcoded.** The loader only scans 5 predefined directories (`skills/syner`, `apps/vaults/skills`, `apps/dev/skills`, `apps/bot/skills`, `packages/github/skills`). Skills outside these paths are invisible.

6. **The skill registry is cached per `projectRoot`.** If you add or remove skills at runtime, call `invalidateSkillsCache()` to force a rescan. Same applies to `invalidateAgentsCache()` for agents.

7. **Fuzzy resolution does not understand semantics.** It uses token overlap, not embeddings. `/find-ideas` works. "brainstorm concepts" will likely not match `find-ideas`. Prefer slash-command syntax for reliable resolution.

8. **`execute()` requires the caller to provide the executor.** The SDK does not depend on `@syner/vercel` -- it accepts any function matching the `SkillExecutor` signature. This is intentional to avoid circular dependencies.

9. **Agent model selection requires `@ai-sdk/gateway` at runtime.** The `getModel()` function calls `gateway()` from `@ai-sdk/gateway`. This is a direct dependency, not optional.

10. **Context `targeted` scope uses keyword matching, not semantic search.** It splits the query on whitespace and checks if any term appears in the file path or content. This is adequate for explicit queries but will miss synonyms.

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

