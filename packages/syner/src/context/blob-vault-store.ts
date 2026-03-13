import { list, put, del } from '@vercel/blob'
import picomatch from 'picomatch'
import type { VaultStore } from './vault-store'

export class BlobVaultStore implements VaultStore {
  constructor(private prefix: string = 'vaults/') {}

  async list(pattern: string): Promise<string[]> {
    const prefixFromPattern = pattern.split('*')[0] || ''
    const result = await list({ prefix: this.prefix + prefixFromPattern })
    const matcher = picomatch(pattern)
    return result.blobs
      .map((b) => b.pathname.replace(this.prefix, ''))
      .filter((p) => matcher(p))
  }

  async read(filePath: string): Promise<string | null> {
    try {
      const result = await list({ prefix: this.prefix + filePath, limit: 1 })
      const blob = result.blobs.find(
        (b) => b.pathname === this.prefix + filePath
      )
      if (!blob) return null
      const response = await fetch(blob.url)
      return response.text()
    } catch {
      return null
    }
  }

  async write(filePath: string, content: string): Promise<void> {
    await put(this.prefix + filePath, content, {
      access: 'public',
      addRandomSuffix: false,
    })
  }

  async delete(filePath: string): Promise<void> {
    try {
      const result = await list({ prefix: this.prefix + filePath, limit: 1 })
      const blob = result.blobs.find(
        (b) => b.pathname === this.prefix + filePath
      )
      if (blob) await del(blob.url)
    } catch {
      // ignore missing files
    }
  }
}
