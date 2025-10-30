import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "index.ts",
    health: "api/health/route.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2020",
  external: ["ai", "zod", "bun", /^node:/],
  splitting: false,
  treeshake: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
})
