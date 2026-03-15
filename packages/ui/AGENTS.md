# @syner/ui

### Exports

```typescript
// Slide rendering
import { renderSlide, registerTemplate, getTemplate, listTemplates } from "@syner/ui/slides"
import type { Slide, Deck, Style, Template } from "@syner/ui/slides"

// Side-effect: register all 5 built-in templates
import "@syner/ui/slides/templates"

// Types only
import type { Slide, Deck, Style, Template } from "@syner/ui/slides/types"

// Registry only
import { registerTemplate, getTemplate, listTemplates, renderSlide } from "@syner/ui/slides/registry"

// Satori font loaders (server-side only)
import { loadGeistSans, loadGeistMono } from "@syner/ui/fonts/satori"

// Branding
import { Logo, colors } from "@syner/ui/branding"
import type { Colors } from "@syner/ui/branding"

// Components (rarely needed by agents, but valid)
import { Button } from "@syner/ui/components/button"
import { Badge } from "@syner/ui/components/badge"
import { Card } from "@syner/ui/components/card"
import { Input } from "@syner/ui/components/input"
import { Separator } from "@syner/ui/components/separator"

// Utility
import { cn } from "@syner/ui/lib/utils"
```

### Types

```typescript
interface Style {
  backgroundColor?: string
  color?: string
  fontFamily?: string
  fontSize?: number       // number only, no CSS units
  padding?: number
  gap?: number
}

interface Slide {
  template: string        // "title" | "metrics" | "highlights" | "outlook" | "custom"
  heading?: string
  subtitle?: string
  content?: string | string[] | Record<string, string | number>
  style?: Partial<Style>
}

interface Deck {
  id?: string
  title: string
  slides: Slide[]
  style?: Style
}

interface Template {
  name: string
  render: (slide: Slide, deckStyle?: Style) => ReactElement
  defaultStyle?: Style
}
```

### Functions

#### `renderSlide(slide: Slide, deckStyle?: Style): ReactElement`

Renders a slide using its registered template. Returns Satori-compatible JSX.
Throws `Error` if `slide.template` is not registered.

#### `registerTemplate(template: Template): void`

Registers a new template by name. Throws `Error` if a template with the same name already exists.

#### `getTemplate(name: string): Template | undefined`

Returns a registered template or `undefined`.

#### `listTemplates(): string[]`

Returns all registered template names as an array.

#### `loadGeistSans(): Promise<ArrayBuffer>`

Loads Geist Sans Regular `.ttf` as ArrayBuffer for Satori. Server-side only (uses `node:fs`).

#### `loadGeistMono(): Promise<ArrayBuffer>`

Loads Geist Mono Regular `.ttf` as ArrayBuffer for Satori. Server-side only (uses `node:fs`).

### Built-in Templates

Registered when you import `@syner/ui/slides/templates` (side-effect import).

| Template | `content` type | Renders as |
|----------|---------------|------------|
| `title` | not used | Full-screen heading + subtitle, centered |
| `metrics` | `Record<string, string \| number>` | Key-value metric grid with large numbers |
| `highlights` | `string[]` | Bulleted list of highlight items |
| `outlook` | `string` | Heading + subtitle + body paragraph |
| `custom` | `string \| string[] \| Record<string, string \| number>` | Freeform passthrough, adapts to content shape |

### Example: Generating a Slide Deck

```typescript
import { renderSlide } from "@syner/ui/slides"
import "@syner/ui/slides/templates"
import { loadGeistSans, loadGeistMono } from "@syner/ui/fonts/satori"

// Load fonts for Satori
const sans = await loadGeistSans()
const mono = await loadGeistMono()

// Render a slide to JSX
const jsx = renderSlide({
  template: "metrics",
  heading: "Sprint Velocity",
  content: { "PRs merged": 14, "Issues closed": 23, "Agents active": 5 },
})

// Pass jsx to Satori/ImageResponse with fonts:
// new ImageResponse(jsx, {
//   width: 1200, height: 630,
//   fonts: [
//     { name: "Geist Sans", data: sans, style: "normal", weight: 400 },
//     { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
//   ],
// })
```

### Errors

| Error | Thrown by | Cause |
|-------|----------|-------|
| `Unknown template "{name}". Registered: [list]` | `renderSlide()` | Template name not registered. Import `@syner/ui/slides/templates` first, or register custom templates. |
| `Template "{name}" is already registered` | `registerTemplate()` | Duplicate name. Check with `listTemplates()` before registering. |

### Constraints

1. **Satori is not CSS.** Slide templates output inline-style JSX. Flexbox only. No CSS Grid, no CSS variables, no `calc()`, no media queries, no Tailwind classes.
2. **Do not import `@syner/ui/components/*` in slide templates.** Components use Tailwind classes. Satori cannot process them. The component surface and the slide surface are separate.
3. **Templates must be registered before `renderSlide()`.** Either import `@syner/ui/slides/templates` (registers all 5 built-ins) or call `registerTemplate()` explicitly.
4. **Do not register duplicate template names.** `registerTemplate()` throws. Use `listTemplates()` to check.
5. **Font loaders are server-side only.** `loadGeistSans()` and `loadGeistMono()` use `node:fs/promises`. They work in Next.js route handlers and API routes. They fail client-side.
6. **The `content` field is polymorphic with no runtime validation.** Passing the wrong shape (e.g., `string[]` to a `metrics` template expecting `Record`) produces undefined behavior. Match the content shape to the template.
7. **`fontSize` is a number, not a string.** `{ fontSize: 48 }` works. `{ fontSize: "48px" }` does not. No CSS units in `Style` fields.

### Valid Import Paths

These are the only resolvable subpaths (from `package.json` exports):

```
@syner/ui/globals.css
@syner/ui/postcss.config
@syner/ui/lib/*             (e.g., @syner/ui/lib/utils)
@syner/ui/components/*      (e.g., @syner/ui/components/button)
@syner/ui/hooks/*
@syner/ui/fonts
@syner/ui/fonts/satori
@syner/ui/slides
@syner/ui/slides/types
@syner/ui/slides/registry
@syner/ui/slides/templates
@syner/ui/branding
```

Anything else will fail to resolve. Do not use bare `@syner/ui` — there is no root export.

---

## Status

| Area | Status |
|------|--------|
| Components (Badge, Button, Card, Input, Separator) | Production -- used across all apps |
| Branding (Logo, colors, favicons) | Production |
| Design tokens (globals.css, light/dark oklch themes) | Production |
| Font management (Next.js loaders + Satori loaders) | Production |
| Slide type system + template registry | Production |
| 5 built-in slide templates | Production -- used by syner.design pipeline |
| Hooks (`src/hooks/`) | Empty -- placeholder only |

## Dependencies

| Package | Why |
|---------|-----|
| `radix-ui` | Primitives for Separator, Slot (asChild pattern). Provides built-in WAI-ARIA attributes |
| `lucide-react` | Icon primitives used by components |
| `class-variance-authority` | Typed component variants |
| `clsx` + `tailwind-merge` | Class name composition (`cn()`) |
| `geist` | Geist font family (Sans, Mono, Pixel variants) |
| `tailwindcss` v4 | Utility-first styling |
| `tw-animate-css` | Animation utilities |
| `shadcn` | Component scaffolding (dev only) |

