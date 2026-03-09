# @syner/ui

Shared design system for Syner monorepo.

## Design Tokens

Dark-native aesthetic inspired by terminal/CLI interfaces:
- **Background:** Pure black (`#000`)
- **Borders:** Minimal (zinc-800)
- **Corners:** Subtle 8px radius
- **Typography:** Geist Sans, Mono, Pixel
- **Focus:** Zinc-400 rings with offset

## Usage

### In apps

```bash
# Add dependency
bun add @syner/ui@workspace:*
```

```typescript
// Import shared components
import { Button } from "@syner/ui/components/button"

// Import utilities
import { cn } from "@syner/ui/lib/utils"

// Import CSS in layout.tsx
import "@syner/ui/globals.css"
```

### Adding components

```bash
cd packages/ui
npx shadcn@latest add <component-name>
```

## Architecture

- **Shared primitives:** `packages/ui/src/components/`
- **App customizations:** `apps/*/components/`
- **Utilities:** `packages/ui/src/lib/`
- **Design tokens:** `packages/ui/src/styles/globals.css`

## Accessibility

All components follow WCAG AA standards:
- Visible focus states (zinc-400 ring)
- Proper semantic HTML
- Keyboard navigation support
- Color contrast ratios verified

## Contributing

1. Add components via shadcn CLI
2. Test in design app first
3. Document usage patterns
4. Verify accessibility compliance
