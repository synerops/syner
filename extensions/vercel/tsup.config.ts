// TODO: tsup cannot be dropped in favor of Bun.build yet:
// https://github.com/oven-sh/bun/issues/5141
import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["cjs", "esm"],
  // DTS disabled due to AI SDK v6 + tsup type inference issues
  // Manual type declarations are provided in src/index.d.ts
  dts: false,
  clean: true,
  sourcemap: true,
  target: "es2020",

  external: ["@syner/sdk", "@vercel/sandbox", "ai", "zod", /^node:/],

  splitting: false,
  treeshake: true,
})

