# @syner/eslint

Shared ESLint configuration for Syner OS projects.

## Why?

Centralizing ESLint config ensures consistent code style and catches common issues across all packages. Each config is composable, so you pick only what you need.

## Usage

```js
// eslint.config.js
import base from "@syner/eslint/base";
import react from "@syner/eslint/react";
import next from "@syner/eslint/next";

export default [...base, ...react, ...next];
```

## Available Configs

| Config | Export | Purpose |
|--------|--------|---------|
| Base | `@syner/eslint/base` | TypeScript, imports, turbo |
| React | `@syner/eslint/react` | React hooks, JSX rules |
| Next.js | `@syner/eslint/next` | Next.js specific rules |
| A11y | `@syner/eslint/a11y` | Accessibility (jsx-a11y) |

## What's Included

- `typescript-eslint` - TypeScript-aware linting
- `eslint-plugin-import` - Import/export validation
- `eslint-plugin-react` - React best practices
- `eslint-plugin-react-hooks` - Hooks rules
- `eslint-plugin-jsx-a11y` - Accessibility checks
- `@next/eslint-plugin-next` - Next.js rules
- `eslint-plugin-turbo` - Turborepo cache rules
