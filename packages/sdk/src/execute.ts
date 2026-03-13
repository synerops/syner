import type { Result } from '@syner/osprotocol'
import type { ContextScope } from './context/types'
import type { VaultStore } from './context/vault-store'
import { resolveSkill } from './skills/resolver'
import { resolveContext } from './context/resolve'

/**
 * Executor function signature — matches executeSkill() from @syner/vercel.
 * The caller provides this to avoid a circular dependency (vercel → sdk → vercel).
 *
 * Generic T allows callers to enforce type safety on executor options
 * (e.g. ExecuteSkillOptions from @syner/vercel) without the SDK importing them.
 */
export type SkillExecutor<T extends Record<string, unknown> = Record<string, unknown>> = (
  skillSlug: string,
  task: string,
  options: T
) => Promise<Result<string>>

export interface ExecuteOptions<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Skill name (e.g. "/find-ideas") or natural language intent */
  intent: string
  /** The task to execute (passed to the skill subagent) */
  task: string
  /** Executor function (typically executeSkill from @syner/vercel) */
  executor: SkillExecutor<T>
  /** Options passed through to the executor — type-safe when T is provided */
  executorOptions: T
  /** Project root path (for skill discovery) */
  projectRoot: string
  /** Vault store for context resolution */
  vaultStore: VaultStore
  /** Optional vault context scope (defaults to 'none') */
  contextScope?: ContextScope
  /** Optional app name for app-scoped context */
  contextApp?: string
}

/**
 * Execution bridge: resolve intent to skill, load context, execute.
 *
 * Connects the SDK's resolveSkill() and resolveContext() to an external
 * executor (typically executeSkill from @syner/vercel), providing a single
 * function that goes from intent string to executed result.
 *
 * The caller provides the executor, model, and tools — the SDK does not
 * create these resources, it only orchestrates the resolution pipeline.
 *
 * @example
 * ```typescript
 * import { execute } from '@syner/sdk'
 * import { executeSkill, type ExecuteSkillOptions } from '@syner/vercel'
 *
 * const result = await execute<ExecuteSkillOptions>({
 *   intent: '/find-ideas',
 *   task: 'Find ideas about orchestration',
 *   executor: executeSkill,
 *   executorOptions: { repoRoot, tools, model },
 *   projectRoot, vaultStore,
 * })
 * ```
 */
export async function execute<T extends Record<string, unknown> = Record<string, unknown>>(
  options: ExecuteOptions<T>
): Promise<Result<string>> {
  const {
    intent,
    task,
    executor,
    executorOptions,
    projectRoot,
    vaultStore,
    contextScope = 'none',
    contextApp,
  } = options

  // 1. Resolve intent to a skill
  const resolved = await resolveSkill(projectRoot, intent)

  if (!resolved) {
    // Pass raw intent to executor — it handles the "not found" case
    return executor(intent, task, executorOptions)
  }

  // 2. Resolve vault context (if requested)
  let brief
  try {
    brief = await resolveContext(
      {
        scope: contextScope,
        app: contextApp,
        query: contextScope === 'targeted' ? task : undefined,
      },
      vaultStore
    )
  } catch {
    // Vault store failure should not block execution
    brief = { content: '' }
  }

  // 3. Build the task with context injected
  const taskWithContext =
    brief.content.length > 0
      ? `${task}\n\n## Vault Context\n\n${brief.content}`
      : task

  // 4. Execute the resolved skill
  return executor(resolved.slug, taskWithContext, executorOptions)
}
