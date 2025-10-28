import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    // actions: "src/actions/index.ts",
    // agents: "src/agents/index.ts",
    // checks: "src/checks/index.ts",
    // context: "src/context/index.ts",
    // loop: "src/loop/index.ts",
    // system: "src/system/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2020",
  external: ["ai", "zod", /^node:/],
  splitting: false,
  treeshake: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
})
