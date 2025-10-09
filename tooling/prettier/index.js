/**
 * @type {import('prettier').Config}
 */
const config = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,
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

