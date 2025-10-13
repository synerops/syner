import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default tseslint.config({
  files: ["**/*.ts", "**/*.tsx"],
  plugins: {
    "@next/next": nextPlugin,
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
    },
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
    "@next/next/no-duplicate-head": "off",
  },
});