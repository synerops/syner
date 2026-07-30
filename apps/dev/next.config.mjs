import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['@syner/osprotocol', '@syner/ui'],
  experimental: {
    // @phosphor-icons/react ships a ~1.5k-icon barrel; rewrite named imports to
    // direct paths so we don't pull the whole set into the graph.
    optimizePackageImports: ['@phosphor-icons/react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withMDX(config);
