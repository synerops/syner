# @syner/prettier-config

Shared Prettier configuration for Syner OS projects.

## Usage

Install the package:

```bash
pnpm add -D @syner/prettier-config
```

Create a `prettier.config.js` file in your project root:

```js
import config from "@syner/prettier-config";

export default config;
```

Or extend it with custom options:

```js
import baseConfig from "@syner/prettier-config";

export default {
  ...baseConfig,
  // Your custom overrides
};
```

## Configuration

This config includes:

- 2 spaces for indentation
- Double quotes for strings
- Semicolons enabled
- Trailing commas (ES5)
- 80 character print width
- Arrow function parentheses always
- LF line endings
- Plugins:
  - `prettier-plugin-organize-imports` - Auto-organize imports
  - `prettier-plugin-tailwindcss` - Sort Tailwind CSS classes
