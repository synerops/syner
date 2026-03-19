# @syner/ui

Shared UI layer for the syner monorepo. Human developers use it for React components and design tokens. Agents use it for Satori-compatible slide rendering and OG image generation.

## Quick Start

```tsx
// Components — used in any syner Next.js app
import { Button } from "@syner/ui/components/button"
import { Card } from "@syner/ui/components/card"
import { Logo } from "@syner/ui/branding"

// Slide rendering — used by agents and OG routes
import { renderSlide } from "@syner/ui/slides"
import "@syner/ui/slides/templates"

// Fonts — layout registration
import { geistSans, geistMono } from "@syner/ui/fonts"

// Styles — import in your app's root layout
import "@syner/ui/globals.css"
```

---

## For Developers

### Setup

`@syner/ui` is an internal package in the syner monorepo. All apps already depend on it. No separate install needed.

```jsonc
// package.json (workspace dependency)
"@syner/ui": "workspace:*"
```

### Components

Five base components built on Radix UI primitives with class-variance-authority (CVA) variants and Tailwind CSS v4.

**Button** — 6 variants, 8 sizes, supports `asChild` for composition.

```tsx
import { Button } from "@syner/ui/components/button"

<Button variant="default">Save</Button>
<Button variant="ghost" size="sm">Cancel</Button>
<Button variant="outline" size="icon"><SearchIcon /></Button>
<Button variant="destructive">Delete</Button>
```

Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
Sizes: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`

**Card** — Two variants: `default` (standard card) and `bracket` (corner-bracketed hover card).

```tsx
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter, CardAction
} from "@syner/ui/components/card"

// Standard card
<Card>
  <CardHeader>
    <CardTitle>Vault</CardTitle>
    <CardDescription>Your personal notes</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>

// Bracket card — decorative corner borders, hover effect
<Card variant="bracket">
  <div>Top content</div>
  <div>Bottom content</div>
</Card>
```

**Badge** — 6 variants, supports `asChild`.

```tsx
import { Badge } from "@syner/ui/components/badge"

<Badge>Default</Badge>
<Badge variant="outline">v0.0.1</Badge>
<Badge variant="secondary">Active</Badge>
<Badge variant="destructive">Error</Badge>
```

Variants: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`

**Input** — Standard text input with focus ring and dark mode support.

```tsx
import { Input } from "@syner/ui/components/input"

<Input type="text" placeholder="Search vaults..." />
```

**Separator** — Horizontal or vertical divider via Radix UI.

```tsx
import { Separator } from "@syner/ui/components/separator"

<Separator />
<Separator orientation="vertical" />
```

### Branding

Logo SVG and brand color tokens.

```tsx
import { Logo, colors } from "@syner/ui/branding"

// Logo renders as an SVG with currentColor fill
<Logo className="h-8 w-8" />

// Color tokens — dark palette with neutral scale
colors.black           // "#000000"
colors.white           // "#ffffff"
colors.neutral[900]    // "#171717"
colors.semantic.border // "#262626"
```

The `colors` object contains:
- `black`, `white` — absolutes
- `neutral` — 11-step scale (50 through 950)
- `semantic` — named tokens: `foreground`, `mutedForeground`, `background`, `card`, `border`, `input`, `accent`, `accentForeground`

### Fonts

Geist font family for Next.js app layouts.

```tsx
// In your root layout.tsx
import { geistSans, geistMono, geistPixelSquare } from "@syner/ui/fonts"

export default function RootLayout({ children }) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable} ${geistPixelSquare.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

Available fonts:
- `geistSans` (alias for `GeistSans`) — primary text
- `geistMono` (alias for `GeistMono`) — code blocks
- `geistPixelSquare`, `geistPixelGrid`, `geistPixelCircle`, `geistPixelTriangle`, `geistPixelLine` — pixel variants

CSS variables registered: `--font-geist-sans`, `--font-geist-mono`, `--font-geist-pixel-square`

### Styles

Global stylesheet with Tailwind v4, light/dark themes using oklch color space.

```tsx
// In your root layout or global CSS
import "@syner/ui/globals.css"
```

The stylesheet provides:
- Light theme (`:root`) and dark theme (`.dark`) CSS custom properties
- Tailwind v4 `@theme inline` mapping for all design tokens
- Font family bindings: `--font-sans`, `--font-mono`, `--font-pixel`
- Radius scale: `--radius-sm` through `--radius-4xl`
- Base layer: border defaults, body background, antialiased text rendering, selection styling

### Utility

```tsx
import { cn } from "@syner/ui/lib/utils"

// Merges clsx + tailwind-merge for conflict-free class composition
<div className={cn("p-4 bg-card", isActive && "border-primary", className)} />
```

### Architecture

```
@syner/ui
  src/
    components/    Badge, Button, Card, Input, Separator
    branding/      Logo (SVG), colors (tokens), favicon assets
    fonts/         Geist family (Next.js loaders + Satori .ttf loaders)
    slides/        Type system, template registry, 5 built-in templates
    hooks/         (empty — placeholder)
    lib/           cn() utility
    styles/        globals.css (Tailwind v4, oklch tokens, light/dark)
```

Consumed by: `syner.md`, `syner.dev`, `syner.design`, `syner.bot`

### Troubleshooting

**"Cannot find module '@syner/ui/components/button'"**
Import paths must match `package.json` exports exactly. Use `@syner/ui/components/button`, not `@syner/ui/components` or `@syner/ui/button`.

**Tailwind classes not applying**
Ensure your app imports `@syner/ui/globals.css` in its root layout. The stylesheet includes `@source` directives that scan both `packages/ui` and `apps/` for class usage.

**Dark mode not working**
Add the `dark` class to your `<html>` element. The theme uses `&:is(.dark *)` as the custom variant selector. For dynamic switching, use a theme provider like `next-themes` with `attribute="class"`.
