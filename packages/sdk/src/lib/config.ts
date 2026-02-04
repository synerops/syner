/**
 * Project Configuration
 *
 * Handles project root detection using package.json as the boundary marker.
 * Similar to how shadcn detects project root.
 */

import { stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

const PACKAGE_JSON = 'package.json'

/**
 * Check if a file exists
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    const s = await stat(path)
    return s.isFile()
  } catch {
    return false
  }
}

/**
 * Find the project root by searching for package.json upward from cwd.
 *
 * Algorithm (shadcn-style):
 * 1. Start from cwd (or provided path)
 * 2. Search for package.json upward
 * 3. If not found, use cwd and warn
 */
export async function findProjectRoot(cwd?: string): Promise<string> {
  const startDir = cwd ? resolve(cwd) : process.cwd()
  let currentDir = startDir

  while (true) {
    const packagePath = join(currentDir, PACKAGE_JSON)
    if (await fileExists(packagePath)) {
      return currentDir
    }

    const parentDir = dirname(currentDir)
    if (parentDir === currentDir) break // Reached filesystem root
    currentDir = parentDir
  }

  // Fallback to cwd
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[config] No package.json found. Using cwd as project root: ${startDir}`)
  }

  return startDir
}
