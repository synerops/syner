import { createMDX } from 'fumadocs-mdx/next'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // @phosphor-icons/react ships a ~1.5k-icon barrel; rewrite named imports to
    // direct paths so we don't pull the whole set into the graph.
    optimizePackageImports: ['@phosphor-icons/react'],
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
