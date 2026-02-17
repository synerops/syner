# @syner/ui

Shared UI components and design system for Syner OS applications.

## Exports

```typescript
// Styles (import in app layout)
import '@syner/ui/globals.css'

// Components
import { Button } from '@syner/ui/components/button'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@syner/ui/components/tooltip'
import { Toaster, toast } from '@syner/ui/components/sonner'

// Branding
import { Logo, Wordmark, Logomark } from '@syner/ui/branding/logo'

// Utilities
import { cn } from '@syner/ui/lib/utils'
```

## Key Files

| File | Purpose |
|------|---------|
| `src/styles/globals.css` | Base styles, CSS variables, Tailwind |
| `src/components/button.tsx` | Button with variants (default, destructive, outline, ghost, link) |
| `src/components/tooltip.tsx` | Radix tooltip wrapper |
| `src/components/sonner.tsx` | Toast notifications |
| `src/branding/logo.tsx` | Logo components |
| `src/lib/utils.ts` | `cn()` classname utility |

## Rules

**MUST:**
- Import styles via `@syner/ui/globals.css` in app layout
- Use `TooltipProvider` at app root for tooltips
- Use subpath imports (`@syner/ui/components/button`)

**NEVER:**
- Import from package root (`@syner/ui`)
- Define component styles outside this package
- Use raw Radix components directly (use wrappers)

**SHOULD:**
- Use `cn()` for conditional classnames
- Follow existing variant patterns when adding components
