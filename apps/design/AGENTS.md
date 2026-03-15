# syner.design

### What agents can do here

- **Generate slide decks** via `POST /api/slides/generate` — no auth required in dev
- **Retrieve slides** via `GET /api/slides/[deckId]/[index]` — immutable URLs after generation
- **Read component examples** in `apps/design/app/components/page.tsx` (usage example, not canonical spec)

### Component spec for generation

When generating UI that uses `@syner/ui`, agents should know:

```
Card primitive:
  Import: @syner/ui/components/card
  Variants: default | bracket
  Sub-components: CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction

  bracket variant rules:
    - No CardHeader/CardContent/CardFooter wrappers — direct children only
    - Text sizes: label 8px, title 20px, description 9px
    - Optional decorative circle: absolute top-6 right-6 size-2 rounded-full
    - Optional action link at bottom: text-[9px] font-medium

  standard variant rules:
    - Use CardHeader > (CardTitle + CardDescription + optional CardAction)
    - Use CardContent for body
    - Use CardFooter for actions
```

### Slide templates

Slide types are defined in `@syner/ui/slides/types`. Rendering logic is in `@syner/ui/slides/registry`. Agents constructing slide payloads should read those files for the `Slide` and `Style` type contracts.

```typescript
import type { Slide, Style } from '@syner/ui/slides/types'
```

### Agent-relevant files

| File | Purpose |
|------|---------|
| `apps/design/app/api/slides/generate/route.tsx` | Slide generation — input/output contract |
| `apps/design/app/api/slides/[deckId]/[index]/route.tsx` | Slide retrieval |
| `apps/design/app/components/page.tsx` | Live Card usage examples (not canonical spec) |
| `packages/ui/slides/types.ts` | Slide/Style type definitions |
| `packages/ui/slides/registry.ts` | Template registry and rendering |

---

## Status

| Capability | Status |
|-----------|--------|
| Landing page | Production |
| Card primitive showcase (`/components`) | Production |
| Slide generation API (`POST /api/slides/generate`) | Production |
| Slide retrieval API (`GET /api/slides/[deckId]/[index]`) | Production |
| Additional component primitives | Not yet implemented |
| Design token documentation | Not yet implemented |
| Agent-readable component specs (markdown) | Not yet implemented |

