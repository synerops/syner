# @syner/ui

Shared design system for Syner apps. Primitives come from
[coss ui](https://coss.com/ui) — Base UI components styled with Tailwind v4 —
installed as source through the shadcn CLI, plus Syner branding and fonts.

## Usage

Import the global styles once in the app's root layout, then import components
by subpath.

```tsx
// app/layout.tsx
import { brand } from '@syner/ui/branding'
import { fonts } from '@syner/ui/lib/fonts'
import '@syner/ui/globals.css'

export const metadata = { title: brand.name, description: brand.tagline }

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fonts}>{children}</body>
    </html>
  )
}
```

```tsx
import { Button } from '@syner/ui/components/button'
import { Logo } from '@syner/ui/branding'

<Button render={<a href="/docs" />}>
  <Logo data-icon="inline-start" />
  Docs
</Button>
```

## What's inside

| Export | Contents |
|--------|----------|
| `@syner/ui/globals.css` | Tailwind v4 entry and coss tokens (light and dark) |
| `@syner/ui/components/*` | 54 coss primitives: button, dialog, sidebar, table, toast, … |
| `@syner/ui/hooks/*` | `use-media-query` |
| `@syner/ui/lib/utils` | `cn()` |
| `@syner/ui/lib/fonts` | Roboto, Roboto Mono, Roboto Serif via `next/font/local` |
| `@syner/ui/branding` | `brand`, `Logo`, `colors`, favicon and logo assets |

## Adding components

Run the CLI from an app. Its `components.json` points `ui`, `lib`, and `hooks`
at this package, so the files are written here.

```bash
cd apps/web
bunx --bun shadcn@latest add @coss/combobox
```

## Related

- [coss ui](https://coss.com/ui) — component docs and examples
- [Base UI](https://base-ui.com) — the unstyled primitives underneath
- [shadcn CLI](https://ui.shadcn.com/docs/cli) — `add`, `view`, `--diff`
