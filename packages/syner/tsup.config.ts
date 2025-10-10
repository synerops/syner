import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    system: "src/system/index.ts",
    context: "src/context/index.ts",
    actions: "src/actions/index.ts",
    checks: "src/checks/index.ts",
    agents: "src/agents/index.ts",
    runtime: "src/runtime/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2020",
});
