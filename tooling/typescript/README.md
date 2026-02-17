# @syner/typescript

Shared TypeScript configuration for Syner OS projects.

## Why?

Centralizing TypeScript config ensures consistent compiler options and type checking across all packages. Configs are composable and extend from a strict base.

## Usage

```json
{
  "extends": "@syner/typescript/nextjs",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

## Available Configs

| Config | Export | Purpose |
|--------|--------|---------|
| Base | `@syner/typescript/base` | Strict base config |
| React | `@syner/typescript/react` | React JSX settings |
| Next.js | `@syner/typescript/nextjs` | Next.js optimized |

## What's Included

**Base config:**
- `strict: true` - All strict checks enabled
- `noUncheckedIndexedAccess: true` - Safer array/object access
- `moduleResolution: "bundler"` - Modern resolution
- `verbatimModuleSyntax: true` - Explicit type imports

**Next.js config extends base with:**
- `jsx: "preserve"` - Let Next.js handle JSX
- `plugins` for Next.js compiler
