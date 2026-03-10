# syner logo

The syner logo represents an agent — a friendly robotic face with expressive "eyes".

## concept

The logo is a stylized face/head shape with:
- Two vertical rectangular "eyes" — representing focus and observation
- A rounded head/helmet shape — representing protection and capability
- Symmetrical design — representing balance and reliability

The face evokes an AI agent that watches, listens, and acts on your behalf.

## variants

### primary logo

The full logo mark. Use when space allows.

```tsx
import { Logo } from "@syner/ui/branding";

<Logo className="h-12 w-12" />
```

### icon

For favicons, app icons, and small spaces. Same mark, smaller context.

Available sizes:
- `favicon.ico` — 48x48 multi-resolution
- `favicon.svg` — Scalable, supports dark mode
- `favicon-96x96.png` — Standard favicon
- `apple-touch-icon.png` — iOS home screen
- `web-app-manifest-192x192.png` — Android/PWA
- `web-app-manifest-512x512.png` — Android/PWA splash

## usage

### clear space

Maintain minimum clear space around the logo equal to the height of one "eye".

### minimum size

- Digital: 24px minimum height
- Print: 10mm minimum height

### color

The logo uses `currentColor` for flexibility:

```tsx
// White on dark background (default)
<Logo className="text-white" />

// Black on light background
<Logo className="text-black" />

// Muted version
<Logo className="text-muted-foreground" />
```

### don't

- Don't rotate the logo
- Don't stretch or distort
- Don't add effects (shadows, gradients)
- Don't change the proportions
- Don't use colors outside the brand palette
- Don't place on busy backgrounds without contrast

## files

| File | Location | Usage |
|------|----------|-------|
| `Logo` component | `@syner/ui/branding` | React apps |
| `logo-dark.svg` | `packages/ui/src/branding/assets/` | Dark backgrounds |
| `logo-light.svg` | `packages/ui/src/branding/assets/` | Light backgrounds |
| `favicon/*` | `packages/ui/src/branding/assets/favicon/` | Browser/app icons |
| `syner-icon.png` | `packages/ui/src/branding/assets/` | Social/marketing |
