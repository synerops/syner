# @syner/ui

Design system for Syner apps. The primitives come from the coss registry
(`@coss`, Base UI + Tailwind v4) and live here as source, not as a dependency.

## Exports

```ts
import '@syner/ui/globals.css'                    // once, in the root layout
import { Button } from '@syner/ui/components/button'
import { useMediaQuery } from '@syner/ui/hooks/use-media-query'
import { cn } from '@syner/ui/lib/utils'
import { fonts } from '@syner/ui/lib/fonts'        // Roboto variable fonts, local
import { brand, Logo, colors } from '@syner/ui/branding'
```

## Layout

| Path | Purpose |
|------|---------|
| `src/styles/globals.css` | Tailwind entry, coss tokens (`:root`, `.dark`, `@theme inline`), font mapping |
| `src/components/*.tsx` | coss primitives, one file per component |
| `src/hooks/*.ts` | coss hooks |
| `src/lib/utils.ts` | `cn()` |
| `src/lib/fonts.ts` | `next/font/local` for Roboto, Roboto Mono, Roboto Serif |
| `src/branding/` | `brand` (name, tagline), `Logo`, `colors`, favicon and logo assets |
| `components.json` | shadcn config: style `base-nova`, aliases `@syner/ui/*` |

## Adding or updating components

Run the shadcn CLI from an app, not from this package. The app's
`components.json` aliases `ui`, `lib`, and `hooks` to `@syner/ui/*`, so files
land in `src/` here and imports are rewritten to `@syner/ui/...`.

```bash
cd apps/web
bunx --bun shadcn@latest add @coss/<component>
bunx --bun shadcn@latest add @coss/<component> --diff   # preview an update
```

## Rules

**MUST**

- Import styles once via `@syner/ui/globals.css` in the app root layout.
- Use subpath imports (`@syner/ui/components/button`), never the package root.
- Use the `render` prop for custom triggers (Base UI), not `asChild`.
- Keep npm dependencies in the root `catalog`/`catalogs`; reference them as
  `catalog:` or `catalog:ui` here.

**NEVER**

- Import `@base-ui/react` from an app; consume the wrappers in `src/components`.
- Add a font package. Fonts are local files under `src/fonts`; the coss tokens
  `--font-sans`, `--font-mono`, and `--font-heading` map to them in
  `globals.css`.
- Hand-edit the `@theme inline` color mappings; let the CLI merge them.

**SHOULD**

- Use `cn()` for conditional classes.
- Use semantic tokens (`bg-background`, `text-muted-foreground`), not raw
  colors.

## Rewrite target

Shared visual components for Syner OS, Syner Bot, and the public site.
Business rules, API credentials, and infrastructure dependencies stay
outside this package.
