import a11yPlugin from "eslint-plugin-jsx-a11y";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.tsx"],
    plugins: {
      "jsx-a11y": a11yPlugin,
    },
    rules: {
      ...a11yPlugin.configs.recommended.rules,
      "jsx-a11y/no-autofocus": "warn",
    },
  },
];

