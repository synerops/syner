# syner.design

Agentic design system — components that agents understand and generate.

## Quick Start

```bash
# Run locally
bun run dev --filter=design
# → http://localhost:3003

# Build
bun run build --filter=design
```

## For Developers

### What it is

`syner.design` is a Next.js 16 app that serves two purposes:

1. **Component showcase** — Live, browsable gallery of `@syner/ui` primitives with usage examples
2. **Slide generation API** — Edge API that renders presentation decks to PNG via `next/og`, stores to Vercel Blob

### Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| React | 19 |
| Styling | Tailwind CSS 4, `tw-animate-css` |
| Components | `@syner/ui` (workspace package) |
| Image gen | `next/og` + Satori |
| Storage | Vercel Blob |
| Fonts | Geist Sans, Geist Mono, Geist Pixel Square |
| Runtime | Edge (API routes) |

### Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page — Hero, Sections, TechGrid, Footer |
| `/components` | Card primitive showcase (bracket + standard variants) |
| `POST /api/slides/generate` | Render a slide deck to PNG, store to Blob |
| `GET /api/slides/[deckId]/[index]` | Retrieve a stored slide image by deck ID and index |

### API: Slide Generation

**`POST /api/slides/generate`**

Accepts a JSON body with `slides` (required) and `style` (optional). Renders each slide using `@syner/ui/slides/registry`, uploads PNGs to Vercel Blob, returns URLs.

```typescript
// Request
const response = await fetch('https://syner.design/api/slides/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slides: [
      {
        template: 'title',
        heading: 'My Deck',
        subtitle: 'Built with syner.design',
      },
    ],
    style: { theme: 'dark' }, // optional
  }),
})

// Response
const { deckId, slides } = await response.json()
// slides[0].url → Vercel Blob public URL
// slides[0].template → "title"
// slides[0].index → 0
```

**`GET /api/slides/[deckId]/[index]`**

Redirects (302) to the Vercel Blob public URL for the PNG. Immutable cache headers (1 year) on the blob itself.

```
GET /api/slides/abc123/0
→ image/png (from Vercel Blob, cached)
```

### Component Library: `@syner/ui`

Components are in `packages/ui`, consumed here. The `/components` page demonstrates:

**Card — two variants:**

```tsx
import { Card, CardTitle, CardDescription } from "@syner/ui/components/card"

// Bracket variant — terminal-inspired, for feature showcases
<Card variant="bracket">
  <div className="space-y-3">
    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">LABEL</CardDescription>
    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">Title</CardTitle>
    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">Description</CardDescription>
  </div>
  <a href="/path" className="text-[9px] font-medium flex items-center gap-1.5">
    Action <ArrowRight size={10} />
  </a>
</Card>

// Standard variant — for content blocks, forms, dashboards
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
    <CardAction><Button variant="ghost" size="sm">...</Button></CardAction>
  </CardHeader>
  <CardContent>Your content</CardContent>
  <CardFooter><Button>Action</Button></CardFooter>
</Card>
```

### Environment Variables

```bash
BLOB_READ_WRITE_TOKEN=   # Vercel Blob — required for slide generation
```

### Local Development

```bash
bun install
bun run dev --filter=design
```

Port: `3003`
