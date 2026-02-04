/**
 * Security Module
 *
 * Provides path validation and security checks to prevent path traversal
 * and ensure all filesystem operations stay within the project scope.
 */

import { resolve, relative, isAbsolute, normalize } from 'node:path'
import { realpath } from 'node:fs/promises'

/**
 * Custom error for security violations
 */
export class SecurityError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'SECURITY_VIOLATION'
  ) {
    super(message)
    this.name = 'SecurityError'
  }
}

/**
 * Assert that a target path is within the project scope
 *
 * @throws SecurityError if the path is outside the project root
 */
export function assertWithinScope(targetPath: string, projectRoot: string): void {
  const normalizedTarget = normalize(resolve(targetPath))
  const normalizedRoot = normalize(resolve(projectRoot))

  // Check if target is within root using relative path
  const rel = relative(normalizedRoot, normalizedTarget)

  // If relative path starts with '..' or is absolute, it's outside scope
  if (rel.startsWith('..') || isAbsolute(rel)) {
    throw new SecurityError(
      `Path outside project scope: ${targetPath} (resolved: ${normalizedTarget})`,
      'PATH_TRAVERSAL'
    )
  }
}

/**
 * Resolve and validate a path, ensuring it stays within project scope
 *
 * @param inputPath - The path to resolve (can include ~ alias)
 * @param projectRoot - The project root directory
 * @returns The resolved absolute path
 * @throws SecurityError if the path is outside the project root
 */
export function resolveSafePath(inputPath: string, projectRoot: string): string {
  // Resolve to absolute path
  const absolutePath = isAbsolute(inputPath) ? normalize(inputPath) : resolve(projectRoot, inputPath)

  // Validate it's within scope
  assertWithinScope(absolutePath, projectRoot)

  return absolutePath
}

/**
 * Resolve a path and follow symlinks, ensuring the real path is within scope
 *
 * This is more secure than resolveSafePath as it follows symlinks
 * and validates the final destination.
 *
 * @param inputPath - The path to resolve
 * @param projectRoot - The project root directory
 * @returns The resolved real path
 * @throws SecurityError if the resolved path or any symlink target is outside scope
 */
export async function resolveRealPath(inputPath: string, projectRoot: string): Promise<string> {
  // First validate the input path
  const safePath = resolveSafePath(inputPath, projectRoot)

  try {
    // Resolve symlinks
    const realPath = await realpath(safePath)

    // Validate the real path is also within scope
    assertWithinScope(realPath, projectRoot)

    return realPath
  } catch (error) {
    if (error instanceof SecurityError) {
      throw error
    }
    // File doesn't exist yet, return the safe path
    return safePath
  }
}

/**
 * Validate a dynamic import path
 *
 * Ensures the path:
 * - Is within the project scope
 * - Has a valid extension (.ts, .js)
 * - Doesn't contain suspicious patterns
 *
 * @throws SecurityError if the path is invalid for import
 */
export function validateImportPath(importPath: string, projectRoot: string): void {
  // Validate scope
  assertWithinScope(importPath, projectRoot)

  const normalizedPath = normalize(importPath)

  // Check for valid extensions
  const validExtensions = ['.ts', '.js', '.mts', '.mjs', '.cts', '.cjs']
  const hasValidExtension = validExtensions.some((ext) => normalizedPath.endsWith(ext))

  if (!hasValidExtension) {
    throw new SecurityError(
      `Invalid import extension: ${importPath}. Allowed: ${validExtensions.join(', ')}`,
      'INVALID_EXTENSION'
    )
  }

  // Check for null bytes (common injection technique)
  if (importPath.includes('\0')) {
    throw new SecurityError('Import path contains null bytes', 'NULL_BYTE_INJECTION')
  }
}

/**
 * Check if a path is within the allowed skill paths
 *
 * @param targetPath - The path to check
 * @param allowedPaths - Array of allowed base paths
 * @param projectRoot - The project root directory
 * @returns true if the path is within any allowed path
 */
export function isWithinAllowedPaths(
  targetPath: string,
  allowedPaths: string[],
  projectRoot: string
): boolean {
  const normalizedTarget = normalize(resolve(projectRoot, targetPath))

  return allowedPaths.some((allowedPath) => {
    const normalizedAllowed = normalize(resolve(projectRoot, allowedPath))
    const rel = relative(normalizedAllowed, normalizedTarget)
    return !rel.startsWith('..') && !isAbsolute(rel)
  })
}

/**
 * Assert that a path is within the allowed skill paths
 *
 * @throws SecurityError if the path is not within any allowed path
 */
export function assertWithinAllowedPaths(
  targetPath: string,
  allowedPaths: string[],
  projectRoot: string
): void {
  if (!isWithinAllowedPaths(targetPath, allowedPaths, projectRoot)) {
    throw new SecurityError(
      `Path not in allowed skill paths: ${targetPath}. Allowed: ${allowedPaths.join(', ')}`,
      'PATH_NOT_ALLOWED'
    )
  }
}
