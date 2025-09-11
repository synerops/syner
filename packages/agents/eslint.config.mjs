import { config as baseConfig } from "@syner/eslint-config/base";

export default [
  ...baseConfig,
  {
    ignores: ["dist/**", "node_modules/**"]
  }
];
