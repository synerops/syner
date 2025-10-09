import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    system: "src/system/index.ts",
    actions: "src/actions/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2020",
});
