/** @deprecated Use syner/registry — root detection moved to packages/syner in v0.1.1 */
import { existsSync } from 'fs'
import path from 'path'

let cachedRoot: string | null = null

/**
 * Discover the project root by walking up from cwd() looking for .git.
 * Result is cached for the lifetime of the process.
 */
export function getProjectRoot(): string {
  if (cachedRoot) return cachedRoot

  let dir = process.cwd()
  while (dir !== path.dirname(dir)) {
    if (existsSync(path.join(dir, '.git'))) {
      cachedRoot = dir
      return dir
    }
    dir = path.dirname(dir)
  }

  throw new Error('Could not find project root (.git)')
}
