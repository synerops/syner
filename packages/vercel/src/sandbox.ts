import { Sandbox } from '@vercel/sandbox'

export type AgentSandbox = Sandbox

export interface SandboxConfig {
  repoUrl: string
  branch?: string
  workdir?: string
  timeout?: number
}

/**
 * Create a sandbox with the repository cloned
 * This sandbox can be reused across multiple tool calls
 */
export async function createAgentSandbox(config: SandboxConfig): Promise<{ sandbox: AgentSandbox; workdir: string }> {
  const {
    repoUrl,
    branch = 'main',
    workdir = 'workspace', // relative to home
    timeout = 300000 // 5 minutes
  } = config

  console.log(`[Sandbox] Creating sandbox...`)
  const sandbox = await Sandbox.create({ runtime: 'node24', timeout })

  // Get home directory
  const homeResult = await sandbox.runCommand('sh', ['-c', 'echo $HOME'])
  const home = (await homeResult.stdout()).trim() || '/root'
  const fullWorkdir = `${home}/${workdir}`

  console.log(`[Sandbox] Home: ${home}, Workdir: ${fullWorkdir}`)
  console.log(`[Sandbox] Cloning ${repoUrl} (branch: ${branch})...`)

  const cloneResult = await sandbox.runCommand('git', [
    'clone',
    '--depth', '1',
    '--branch', branch,
    repoUrl,
    fullWorkdir
  ])

  if (cloneResult.exitCode !== 0) {
    const stderr = await cloneResult.stderr()
    await sandbox.stop()
    throw new Error(`Failed to clone repo: ${stderr}`)
  }

  console.log(`[Sandbox] Repository cloned to ${fullWorkdir}`)

  return { sandbox, workdir: fullWorkdir }
}

/**
 * Stop and cleanup a sandbox
 */
export async function stopSandbox(sandbox: AgentSandbox): Promise<void> {
  console.log(`[Sandbox] Stopping sandbox...`)
  await sandbox.stop()
  console.log(`[Sandbox] Sandbox stopped`)
}
