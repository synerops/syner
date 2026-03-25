import type { NextConfig } from 'next'

const config: NextConfig = {
  // Transpile workspace packages
  transpilePackages: ['@syner/github', '@syner/vercel', '@syner/slack', 'syner'],
  // Keep heavy deps out of the serverless bundle — require at runtime, not bundle
  serverExternalPackages: ['@vercel/sandbox', 'workflow', '@workflow/ai'],
}

export default config
