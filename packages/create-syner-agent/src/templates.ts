export function skillMd(name: string, description: string): string {
  return `---
name: ${name}
description: ${description}
visibility: public
metadata:
  version: "0.1.0"
  author: syner
---

# ${name}

${description}

## I am for
Teams and individuals who want to use this agent.

## I am NOT
- A general-purpose AI. I have a specific focus.

## Preconditions
- Valid input provided

## Effects
- Task completed and result returned

## Inputs
- message (required) — The user's message or command

## Outputs
- Response from the agent
`
}

export function agentRoute(): string {
  return `import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseSkillManifest, type SkillManifestV2 } from '@syner/osprotocol'

let cachedManifest: SkillManifestV2 | null = null

function getManifest(): SkillManifestV2 {
  if (cachedManifest) return cachedManifest
  const content = readFileSync(resolve(process.cwd(), 'SKILL.md'), 'utf-8')
  cachedManifest = parseSkillManifest(content)
  return cachedManifest
}

export async function GET() {
  const manifest = getManifest()
  return Response.json(manifest)
}
`
}

export function nextConfig(name: string): string {
  return `import type { NextConfig } from 'next'
import { withSyner } from '@syner/vercel'

const config: NextConfig = {
  transpilePackages: ['@syner/osprotocol', '@syner/vercel'],
}

export default withSyner(config)
`
}

export function packageJson(name: string, description: string): string {
  return JSON.stringify(
    {
      name,
      version: '0.0.1',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        typecheck: 'tsc --noEmit',
      },
      dependencies: {
        '@syner/osprotocol': 'latest',
        '@syner/vercel': 'latest',
        next: '^15.0.0',
        react: '^19.0.0',
        'react-dom': '^19.0.0',
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@types/react': '^19.0.0',
        typescript: '^5.0.0',
      },
    },
    null,
    2,
  )
}

export function tsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: { '@/*': ['./src/*'] },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    },
    null,
    2,
  )
}

export function appPage(name: string): string {
  return `export default function Home() {
  return (
    <main>
      <h1>${name}</h1>
      <p>Syner agent running. Visit <code>/agent</code> to see the manifest.</p>
    </main>
  )
}
`
}

export function appLayout(name: string): string {
  return `import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${name}',
  description: 'Syner agent',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
}
