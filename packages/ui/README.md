# @syner/ui

## What is @syner/ui?

The UI package provides shared components and design system for all Syner OS applications. It ensures visual consistency across the ecosystem with a unified set of primitives built on Radix UI and Tailwind CSS.

Components are designed to be accessible, themeable, and composable. The package exports everything needed to build Syner applications: components, styles, utilities, and branding assets.

## Installation

```bash
bun add @syner/ui
```

## Usage

### 1. Import Global Styles

In your app's root layout:

```tsx
import '@syner/ui/globals.css'
```

### 2. Use Components

```tsx
import { Button } from '@syner/ui/components/button'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@syner/ui/components/tooltip'
import { Toaster, toast } from '@syner/ui/components/sonner'

// Wrap app with TooltipProvider
function App() {
  return (
    <TooltipProvider>
      <Button onClick={() => toast.success('Hello!')}>
        Click me
      </Button>
      <Toaster />
    </TooltipProvider>
  )
}
```

### 3. Branding

```tsx
import { Logo, Wordmark, Logomark } from '@syner/ui/branding/logo'

<Logo />      // Full logo with wordmark
<Wordmark />  // Text only
<Logomark />  // Icon only
```

## API

### Components

| Component | Description |
|-----------|-------------|
| `Button` | Primary action button with variants |
| `Tooltip` | Accessible tooltip with Radix |
| `Toaster` | Toast notifications with Sonner |

### Utilities

| Export | Purpose |
|--------|---------|
| `cn()` | Merge Tailwind classes with clsx + tailwind-merge |
| `globals.css` | Base styles, CSS variables, animations |

## Related

- [Design System](../../apps/design) - Interactive component documentation
- [Radix UI](https://radix-ui.com) - Accessible primitives
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
