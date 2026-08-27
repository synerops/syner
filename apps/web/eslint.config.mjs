import baseConfig from "@syner/eslint/base"
import nextConfig from "@syner/eslint/next"
import reactConfig from "@syner/eslint/react"

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextConfig,
]
