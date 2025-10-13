import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    agents: "src/agents/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2020",
  external: ["ai", "zod", /^node:/],
  splitting: false,
  treeshake: true,
});
