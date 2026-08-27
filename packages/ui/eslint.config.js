import baseConfig from "@syner/eslint/base"
import reactConfig from "@syner/eslint/react"

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
]
