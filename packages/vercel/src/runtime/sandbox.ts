import { Sandbox, Snapshot } from '@vercel/sandbox'

export type SandboxInstance = Sandbox

export interface SandboxConfig {
  repoUrl: string
  branch?: string
  timeout?: number
  /** Environment variables injected into the sandbox */
  env?: Record<string, string>
}

// In-memory snapshot cache keyed by "repoUrl#branch"
const snapshotCache = new Map<string, string>()

function cacheKey(repoUrl: string, branch: string): string {
  return `${repoUrl}#${branch}`
}

/**
 * Validate that a cached snapshot still exists and is usable.
 * Returns the snapshotId if valid, null otherwise.
 */
async function validateSnapshot(snapshotId: string): Promise<string | null> {
  try {
    const snap = await Snapshot.get({ snapshotId })
    if (snap.status === 'created') return snapshotId
    return null
  } catch {
    return null
  }
}

/**
 * Create a sandbox from scratch: clone repo and take a snapshot for future reuse.
 * The source sandbox is stopped by snapshot(), so we create a second one from the snapshot.
 */
async function createAndSnapshot(config: SandboxConfig & { key: string }): Promise<{ sandbox: SandboxInstance; workdir: string }> {
  const {
    repoUrl,
    branch = 'main',
    timeout = 300000,
    env,
    key,
  } = config

  console.log(`[Sandbox] Cold start: creating sandbox with git source...`)

  // 1. Create sandbox with repo already cloned via source
  const setupSandbox = await Sandbox.create({
    source: { url: repoUrl, type: 'git' },
    runtime: 'node24',
    timeout,
    env,
  })

  // 2. Discover the working directory
  const homeResult = await setupSandbox.runCommand('sh', ['-c', 'echo $HOME'])
  const home = (await homeResult.stdout()).trim() || '/root'

  // Find where the repo was cloned (Vercel typically uses /vercel/sandbox or $HOME)
  const findResult = await setupSandbox.runCommand('sh', ['-c', 'ls -d /vercel/sandbox 2>/dev/null || echo $HOME'])
  const workdir = (await findResult.stdout()).trim() || home

  console.log(`[Sandbox] Repo cloned, workdir: ${workdir}`)
  console.log(`[Sandbox] Taking snapshot for future reuse...`)

  // 3. Snapshot (this stops setupSandbox automatically)
  const snapshot = await setupSandbox.snapshot()
  const snapshotId = snapshot.snapshotId
  snapshotCache.set(key, snapshotId)

  console.log(`[Sandbox] Snapshot created: ${snapshotId}`)

  // 4. Create a fresh sandbox from the snapshot (instant)
  const sandbox = await Sandbox.create({
    source: { type: 'snapshot', snapshotId },
    runtime: 'node24',
    timeout,
    env,
  })

  console.log(`[Sandbox] Sandbox ready from snapshot`)
  return { sandbox, workdir }
}

/**
 * Create a sandbox from an existing snapshot (warm path).
 */
async function createFromSnapshot(
  snapshotId: string,
  config: Pick<SandboxConfig, 'timeout' | 'env'>,
  workdir: string,
): Promise<{ sandbox: SandboxInstance; workdir: string }> {
  console.log(`[Sandbox] Warm start: creating from snapshot ${snapshotId}...`)

  const sandbox = await Sandbox.create({
    source: { type: 'snapshot', snapshotId },
    runtime: 'node24',
    timeout: config.timeout ?? 300000,
    env: config.env,
  })

  console.log(`[Sandbox] Sandbox ready from snapshot (warm)`)
  return { sandbox, workdir }
}

/**
 * Create a sandbox with the repository ready.
 *
 * Uses snapshots to avoid re-cloning on every call:
 * - First call: creates sandbox with git source, snapshots it, then creates from snapshot
 * - Subsequent calls: creates directly from cached snapshot (milliseconds)
 */
export async function createSandbox(config: SandboxConfig): Promise<{ sandbox: SandboxInstance; workdir: string }> {
  const {
    repoUrl,
    branch = 'main',
  } = config

  const key = cacheKey(repoUrl, branch)

  // Try cached snapshot first
  const cachedSnapshotId = snapshotCache.get(key)
  if (cachedSnapshotId) {
    const validId = await validateSnapshot(cachedSnapshotId)
    if (validId) {
      // Warm path — we need to know the workdir from previous creation
      // Since snapshots preserve the filesystem, the workdir is the same
      return createFromSnapshot(validId, config, '/vercel/sandbox')
    }
    // Snapshot expired or deleted, remove from cache
    snapshotCache.delete(key)
    console.log(`[Sandbox] Cached snapshot expired, creating fresh...`)
  }

  // Cold path — create, clone, snapshot
  return createAndSnapshot({ ...config, key })
}

/**
 * Stop and cleanup a sandbox
 */
export async function stopSandbox(sandbox: SandboxInstance): Promise<void> {
  console.log(`[Sandbox] Stopping sandbox...`)
  await sandbox.stop()
  console.log(`[Sandbox] Sandbox stopped`)
}
