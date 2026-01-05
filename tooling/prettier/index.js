/**
 * @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions}
 */
const config = {
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  printWidth: 100,
  arrowParens: "always",
  endOfLine: "lf",
  bracketSpacing: true,
  useTabs: false,
  plugins: [
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss",
  ],
};

export default config;
