import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['@syner/osprotocol'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withMDX(config);
