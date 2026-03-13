import { readFile, writeFile, unlink, mkdir } from 'fs/promises'
import { glob } from 'glob'
import path from 'path'
import type { VaultStore } from './vault-store'

export class FileSystemVaultStore implements VaultStore {
  constructor(private root: string) {}

  async list(pattern: string): Promise<string[]> {
    return glob(pattern, { cwd: this.root })
  }

  async read(filePath: string): Promise<string | null> {
    try {
      return await readFile(path.join(this.root, filePath), 'utf-8')
    } catch {
      return null
    }
  }

  async write(filePath: string, content: string): Promise<void> {
    const full = path.join(this.root, filePath)
    await mkdir(path.dirname(full), { recursive: true })
    await writeFile(full, content, 'utf-8')
  }

  async delete(filePath: string): Promise<void> {
    try {
      await unlink(path.join(this.root, filePath))
    } catch {
      // ignore missing files
    }
  }
}
