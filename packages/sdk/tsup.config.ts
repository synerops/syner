// TODO: tsup cannot be dropped in favor of Bun.build yet:
// https://github.com/oven-sh/bun/issues/5141
import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "workflows/index": "src/workflows/index.ts",
    "runs/index": "src/runs/index.ts",
    "lib/index": "src/lib/index.ts",
    "context/kv/index": "src/context/kv/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2020",

  external: ["ai", "zod", "bun", /^node:/],

  splitting: false,
  treeshake: true,
})
