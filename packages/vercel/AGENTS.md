# @syner/vercel

> AI SDK tool suite and skill execution runtime for isolated Vercel Sandbox containers.

## Exports

```typescript
// Sandbox tools (standalone instances)
import { Bash, Fetch, Read, Write, Edit, Glob, Grep } from '@syner/vercel'

// Execute functions (standalone, ephemeral sandbox)
import { executeBash, executeFetch, executeRead, executeWrite, executeEdit, executeGlob, executeGrep } from '@syner/vercel'

// Execute functions (shared sandbox)
import { executeBashWithSandbox, executeFetchWithSandbox, executeReadWithSandbox, executeWriteWithSandbox, executeGlobWithSandbox, executeGrepWithSandbox } from '@syner/vercel'

// Input schemas (zod)
import { bashInputSchema, fetchInputSchema, readInputSchema, writeInputSchema, globInputSchema, grepInputSchema } from '@syner/vercel'

// Tool factories (take Sandbox, return Tool)
import { createBashTool, createFetchTool, createReadTool, createWriteTool, createEditTool, createGlobTool, createGrepTool } from '@syner/vercel'

// Tool registry (creates all 7 sandbox tools at once)
import { createTools, createToolsByName } from '@syner/vercel'

// Skill execution
import { executeSkill, createSkillTool } from '@syner/vercel'

// Vault tool factories (take VaultStore, return Tool)
import { createVaultRead, createVaultWrite, createVaultDelete, createVaultList, createVaultGlob } from '@syner/vercel'

// Skill loader
import { loadSkill, loadSkills, buildInlineSkillContext, buildSkillInstructions, discoverCommandSkills } from '@syner/vercel'

// Sandbox lifecycle
import { createAgentSandbox, stopSandbox } from '@syner/vercel'

// Next.js integration
import { withSyner } from '@syner/vercel'

// Agent handler
import { createAgentHandler } from '@syner/vercel'

// Types
import type { ToolName, SandboxToolName, SpecialToolName } from '@syner/vercel'
import type { CreateSkillToolOptions, ExecuteSkillOptions } from '@syner/vercel'
import type { SkillConfig, CommandConfig } from '@syner/vercel'
import type { AgentSandbox, SandboxConfig } from '@syner/vercel'
import type { AgentHandlerConfig } from '@syner/vercel'
import type { SynerConfig } from '@syner/vercel'
```

## Types

### SandboxConfig

```typescript
interface SandboxConfig {
  repoUrl: string
  branch?: string          // default: 'main'
  workdir?: string         // default: 'workspace' (relative to sandbox home)
  timeout?: number         // default: 300000 (5 minutes)
  env?: Record<string, string>
}
```

### AgentSandbox

```typescript
type AgentSandbox = Sandbox  // re-export of @vercel/sandbox Sandbox
```

### ExecuteSkillOptions

```typescript
interface ExecuteSkillOptions {
  repoRoot: string
  tools: Record<string, Tool>
  model: LanguageModel
  abortSignal?: AbortSignal
}
```

### CreateSkillToolOptions

```typescript
interface CreateSkillToolOptions {
  repoRoot: string
  availableSkills: string[]
  tools: Record<string, Tool>
  model: LanguageModel
}
```

### SkillConfig

```typescript
interface SkillConfig {
  name: string
  description?: string
  instructions: string
  tools?: string[]
  agent?: string
  context?: 'inline' | 'fork'
  filePath: string
  command?: string
}
```

### CommandConfig

```typescript
interface CommandConfig {
  name: string
  skillName: string
  description: string
  agent: string
}
```

### AgentHandlerConfig

```typescript
interface AgentHandlerConfig {
  agentId: string
  skillRef: string
  manifest?: SkillManifest       // from @syner/osprotocol
  handler: (req: Request, context: Context, action: Action) => Promise<unknown>
  onResult?: (result: Result) => Promise<void>
}
```

### SynerConfig

```typescript
interface SynerConfig {
  skillPath?: string             // default: resolve(cwd, 'SKILL.md')
  manifest?: SkillManifest
}
```

### CreateToolsOptions

```typescript
interface CreateToolsOptions {
  osprotocol?: boolean
  agentId?: string
}
```

### Tool name unions

```typescript
type SandboxToolName = 'Bash' | 'Fetch' | 'Read' | 'Write' | 'Edit' | 'Glob' | 'Grep'
type SpecialToolName = 'Skill' | 'Task'
type ToolName = SandboxToolName | SpecialToolName
```

### Input schemas

Each sandbox tool has a zod schema exported as `{tool}InputSchema`. The shapes:

| Tool | Input fields |
|------|-------------|
| Bash | `command: string` |
| Fetch | `url: string` |
| Read | `file_path: string`, `offset?: number`, `limit?: number` |
| Write | `file_path: string`, `content: string` |
| Edit | `file_path: string`, `old_string: string`, `new_string: string`, `replace_all?: boolean` |
| Glob | `pattern: string`, `path?: string` |
| Grep | `pattern: string`, `path?: string`, `glob?: string`, `output_mode?: 'content' \| 'files_with_matches' \| 'count'`, `'-i'?: boolean`, `'-n'?: boolean`, `'-A'?: number`, `'-B'?: number`, `'-C'?: number` |

Vault tools take a path relative to vault root:

| Tool | Input fields |
|------|-------------|
| VaultRead | `path: string` |
| VaultWrite | `path: string`, `content: string` |
| VaultDelete | `path: string` |
| VaultList | `pattern: string` |
| VaultGlob | `pattern: string` |

## Functions

### createAgentSandbox(config: SandboxConfig): Promise<{ sandbox: AgentSandbox; workdir: string }>

Creates a sandbox with `@vercel/sandbox` (node24 runtime), clones the repository into it. Returns the sandbox instance and absolute workdir path. The sandbox is reusable across tool calls.

### stopSandbox(sandbox: AgentSandbox): Promise\<void\>

Stops and cleans up a sandbox. Always call this when done.

### createTools(sandbox: Sandbox, options?: CreateToolsOptions): Record\<SandboxToolName, Tool\>

Creates all 7 sandbox tools bound to a shared sandbox. Returns `{ Bash, Fetch, Read, Write, Edit, Glob, Grep }`. Pass `{ osprotocol: true }` to wrap every tool with context/action/verification tracing.

### createToolsByName(sandbox: Sandbox, toolNames: string[]): Record\<string, Tool\>

Creates a subset of sandbox tools by name. Silently skips `Skill` and `Task` (they require extra params). Logs a warning for unknown tool names.

### executeSkill(ref: string, input: string, options: ExecuteSkillOptions): Promise\<OspResult\<string\>\>

Loads a skill by name from the repo, builds instructions with `$ARGUMENTS` and `$N` substitution, runs a `ToolLoopAgent` subagent (max 10 steps) with the provided tools and model. If the skill's `tools` frontmatter is set, the subagent only gets those tools. Returns an osprotocol Result with context, action, verification, output, and duration. Does not cache loaded skills.

### createSkillTool(options: CreateSkillToolOptions): Tool

Creates an AI SDK tool that delegates to `executeSkill`. Validates skill name against `availableSkills`. Caches loaded SkillConfig instances. Input schema: `{ name: string, task: string }`.

### loadSkill(repoRoot: string, skillName: string): Promise\<SkillConfig | null\>

Searches `skills/` and `apps/*/skills/` for a directory matching `skillName` containing `SKILL.md`. Parses frontmatter with `gray-matter`. Returns null if not found.

### loadSkills(repoRoot: string, skillNames: string[]): Promise\<Map\<string, SkillConfig\>\>

Loads multiple skills by name. Returns a Map of name to SkillConfig, skipping any that are not found.

### buildSkillInstructions(skill: SkillConfig, args: string): string

Replaces `$ARGUMENTS` with the full args string and `$N` with positional arguments (space-split). Returns the processed instruction body.

### buildInlineSkillContext(skills: Map\<string, SkillConfig\>): string

Builds a markdown section listing available skills with descriptions. Used for inline context mode where skills are injected into the system prompt rather than forked as subagents.

### discoverCommandSkills(repoRoot: string): Promise\<CommandConfig[]\>

Scans all skill directories for skills with `command:` in frontmatter. Returns an array of CommandConfig for slash-command registration.

### createAgentHandler(config: AgentHandlerConfig): (req: Request) => Promise\<Response\>

Creates a Request handler that wraps a function in osprotocol lifecycle: builds context, creates action from manifest preconditions/effects, checks preconditions (returns 412 if unmet), runs handler, verifies effects, returns JSON Response with Result. Calls `onResult` callback if provided.

### withSyner(nextConfig?: NextConfig, synerConfig?: SynerConfig): NextConfig

Wraps a Next.js config to add `/agent -> /api/agent` rewrite. Reads `SKILL.md` from project root if no manifest is provided.

### Standalone tool instances

`Bash`, `Fetch`, `Read`, `Write`, `Edit`, `Glob`, `Grep` are pre-built AI SDK `tool()` instances that create an ephemeral sandbox per call (node24, 60s timeout). Use for one-off calls. For multiple calls, prefer `createTools()` with a shared sandbox.

### Vault tool factories

`createVaultRead(store)`, `createVaultWrite(store)`, `createVaultDelete(store)`, `createVaultList(store)`, `createVaultGlob(store)` each take a `VaultStore` from `@syner/sdk/context` and return an AI SDK tool. VaultList returns paths with 200-char content previews. VaultGlob returns paths only.

## Errors

| Error condition | Source | Behavior |
|----------------|--------|----------|
| Repo clone fails | `createAgentSandbox` | Stops sandbox, throws `Error("Failed to clone repo: {stderr}")` |
| Skill not found | `executeSkill` | Returns OspResult with verification status `fail`, missing entry `"skill:{ref} -- not found in repository"` |
| Skill not in allowlist | `createSkillTool` | Returns string `"Error: Skill \"{name}\" not available. Available skills: ..."` |
| Subagent throws | `executeSkill` | Returns OspResult with verification status `fail`, output contains error message |
| Edit old_string not found | `executeEditWithSandbox` | Returns `"Error: old_string not found in {file_path}"` |
| Edit old_string not unique | `executeEditWithSandbox` | Returns `"Error: old_string appears {n} times in {file_path}. Use replace_all or provide more context to make it unique."` |
| Fetch response too large | `executeFetchWithSandbox` | Truncates at 50,000 chars, appends `"[Truncated: {n} chars omitted]"` |
| Vault file not found | `createVaultRead` | Returns `{ error: "Vault file not found: {path}" }` |
| Preconditions unmet | `createAgentHandler` | Returns 412 with `{ error: "Preconditions not met", unmet: [...], result }` |
| Handler throws | `createAgentHandler` | Returns 500 with `{ error: "{message}", result }` |
| Unknown tool name | `createToolsByName` | Logs `"[Tools] Unknown tool: {name}"` via console.warn, skips it |

## Constraints

1. **Always stop sandboxes.** Every `createAgentSandbox()` call must have a matching `stopSandbox()`. Sandboxes that are not stopped will run until their timeout (default 5 minutes) and consume resources.

2. **Standalone tools are expensive.** `Bash`, `Fetch`, `Read`, `Write`, `Edit`, `Glob`, `Grep` each create and destroy an ephemeral sandbox per invocation. Use `createTools(sandbox)` with a shared sandbox for any workflow that calls more than one tool.

3. **Skill lookup searches two directories.** `loadSkill` looks in `skills/{name}/SKILL.md` and `apps/*/skills/{name}/SKILL.md` relative to repoRoot. If your skill is not in one of these paths, it will not be found.

4. **ToolLoopAgent step limit is fixed at 10.** `executeSkill` runs subagents with a hard cap of 10 tool-call steps. Skills that require more steps will stop mid-execution. There is no configuration for this limit.

5. **Skill tool filtering is case-insensitive.** When a SKILL.md declares `tools: [bash, grep]`, the subagent receives tools matched case-insensitively against the provided tools record. If `tools` is not set in the manifest, the subagent gets all tools.

6. **Vault tools require a VaultStore instance.** They are factory functions, not standalone tools. You must pass a `VaultStore` from `@syner/sdk/context`. They are not included in `createTools()` output.

7. **osprotocol wrapping is opt-in.** `createTools(sandbox)` returns unwrapped tools by default. Pass `{ osprotocol: true, agentId: 'your-agent' }` to wrap each tool with context/action/verification tracing. The agentId defaults to `'sandbox'` if omitted.

8. **createToolsByName silently skips Skill and Task.** These are "special" tools that require additional configuration beyond a sandbox. They must be created separately via `createSkillTool()` and added to your tools record manually.

9. **withSyner only adds a single rewrite.** It maps `/agent` to `/api/agent`. It reads `SKILL.md` from the project root for manifest parsing but does not use the manifest for routing. The manifest is available via `synerConfig.manifest` for your own handler.

10. **createAgentHandler preconditions are caller-verified.** The handler reads preconditions from the manifest and marks them all as `met: true` by default. The caller is responsible for overriding with actual checks. The `checkPreconditions` call will pass unless you explicitly set `met: false`.

## Dependencies

| Package | Why |
|---------|-----|
| `@vercel/sandbox` | Sandbox container runtime for all tool execution |
| `ai` | AI SDK `tool()` function, `ToolLoopAgent`, `LanguageModel` type |
| `zod` | Input schema definitions for all tools |
| `@syner/osprotocol` | Context/Action/Result types, `verify()`, `createResult()`, `parseSkillManifest()` |
| `@syner/sdk` | `VaultStore` type for vault tool factories |
| `gray-matter` | SKILL.md frontmatter parsing |
| `glob` | File discovery for skill loading |

