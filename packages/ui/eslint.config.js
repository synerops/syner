import baseConfig from "@syner/eslint-config/base";
import reactConfig from "@syner/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];