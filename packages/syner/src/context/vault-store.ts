/**
 * VaultStore — CRUD interface for vault storage.
 *
 * Implementations:
 * - FileSystemVaultStore (local, fs/promises)
 * - BlobVaultStore (Vercel Blob, serverless)
 */
export interface VaultStore {
  /** List vault files matching a glob pattern */
  list(pattern: string): Promise<string[]>

  /** Read a vault file by path. Returns null if not found. */
  read(path: string): Promise<string | null>

  /** Write content to a vault file. Creates parent dirs if needed. */
  write(path: string, content: string): Promise<void>

  /** Delete a vault file. No-op if not found. */
  delete(path: string): Promise<void>
}
