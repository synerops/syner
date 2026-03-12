import type { NextConfig } from 'next'

const config: NextConfig = {
  // Transpile workspace packages
  transpilePackages: ['@syner/github', '@syner/osprotocol'],
}

export default config
