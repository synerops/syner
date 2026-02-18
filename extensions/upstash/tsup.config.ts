// TODO(@claude): tsup cannot be dropped in favor of Bun.build yet:
// https://github.com/oven-sh/bun/issues/5141
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'context/kv': 'src/context/kv/index.ts',
  },
  format: ['cjs', 'esm'],
  // DTS disabled - manual type declarations provided in src/*.d.ts
  dts: false,
  clean: true,
  sourcemap: true,
  target: 'es2020',

  external: ['@syner/sdk', '@upstash/redis', /^node:/],

  splitting: false,
  treeshake: true,
})
