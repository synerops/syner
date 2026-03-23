import js from "@eslint/js"
import turboPlugin from "eslint-plugin-turbo"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["dist/**", ".next/**", ".vercel/**", "node_modules/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      ...turboPlugin.configs["flat/recommended"].rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
)
