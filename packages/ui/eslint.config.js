import baseConfig from "@syner/eslint-config/base";
import reactConfig from "@syner/eslint-config/react";
import a11yConfig from "@syner/eslint-config/a11y";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...a11yConfig,
];