import type { OspResult } from '@syner/osprotocol'
import type { ContextScope } from './context/types'
import type { VaultStore } from './context/vault-store'
import { resolveSkill } from './skills/resolver'
import { resolveContext } from './context/resolve'

/**
 * Executor function signature — matches executeSkill() from @syner/vercel.
 * The caller provides this to avoid a circular dependency (vercel → sdk → vercel).
 */
export type SkillExecutor = (
  skillSlug: string,
  task: string,
  options: Record<string, unknown>
) => Promise<OspResult<string>>

export interface ExecuteOptions {
  /** Skill name (e.g. "/find-ideas") or natural language intent */
  intent: string
  /** The task to execute (passed to the skill subagent) */
  task: string
  /** Executor function (typically executeSkill from @syner/vercel) */
  executor: SkillExecutor
  /** Options passed through to the executor (model, tools, repoRoot, etc.) */
  executorOptions: Record<string, unknown>
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
 */
export async function execute(
  options: ExecuteOptions
): Promise<OspResult<string>> {
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
  const brief = await resolveContext(
    {
      scope: contextScope,
      app: contextApp,
      query: contextScope === 'targeted' ? task : undefined,
    },
    vaultStore
  )

  // 3. Build the task with context injected
  const taskWithContext =
    brief.content.length > 0
      ? `${task}\n\n## Vault Context\n\n${brief.content}`
      : task

  // 4. Execute the resolved skill
  return executor(resolved.slug, taskWithContext, executorOptions)
}
