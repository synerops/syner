import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseSkillManifest } from '@syner/osprotocol'
import type { SkillManifestV2 } from '@syner/osprotocol'

interface NextConfig {
  rewrites?: () => Promise<Array<{ source: string; destination: string }>> | Array<{ source: string; destination: string }>
  [key: string]: unknown
}

export interface SynerConfig {
  skillPath?: string
  manifest?: SkillManifestV2
}

export function withSyner(nextConfig: NextConfig = {}, synerConfig: SynerConfig = {}): NextConfig {
  // Read SKILL.md from project root if not provided
  let manifest = synerConfig.manifest
  if (!manifest) {
    const skillPath = synerConfig.skillPath || resolve(process.cwd(), 'SKILL.md')
    try {
      const content = readFileSync(skillPath, 'utf-8')
      manifest = parseSkillManifest(content)
    } catch {
      // No SKILL.md found — still works, just no manifest
    }
  }

  const originalRewrites = nextConfig.rewrites

  return {
    ...nextConfig,
    rewrites: async () => {
      const existing = originalRewrites
        ? await (typeof originalRewrites === 'function' ? originalRewrites() : originalRewrites)
        : []

      const synerRewrites = [
        { source: '/agent', destination: '/api/agent' },
      ]

      return [...(Array.isArray(existing) ? existing : []), ...synerRewrites]
    },
  }
}
