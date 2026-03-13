# syner colors

Dark-native color system. Black is the canvas.

## philosophy

We design for dark mode first. Light mode exists for accessibility, not preference.

- **Black** is the primary background — pure `#000000`
- **White** is the primary foreground — pure `#ffffff`
- **Neutrals** create hierarchy without introducing color

## palette

### core

| Name | Hex | OKLCH | Usage |
|------|-----|-------|-------|
| Black | `#000000` | `oklch(0 0 0)` | Primary background |
| White | `#ffffff` | `oklch(1 0 0)` | Primary text, primary actions |

### neutral scale

Based on zinc, optimized for dark backgrounds.

| Step | Hex | Usage |
|------|-----|-------|
| 50 | `#fafafa` | Light mode background |
| 100 | `#f5f5f5` | Light mode elevated |
| 200 | `#e5e5e5` | Light mode borders |
| 300 | `#d4d4d4` | Light mode muted |
| 400 | `#a3a3a3` | Muted foreground |
| 500 | `#737373` | Placeholder text |
| 600 | `#525252` | Disabled states |
| 700 | `#404040` | Subtle borders (dark) |
| 800 | `#262626` | Borders, cards (dark) |
| 900 | `#171717` | Elevated surfaces (dark) |
| 950 | `#0a0a0a` | Slight elevation (dark) |

### semantic tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#000000` | Page background |
| `--foreground` | `#ffffff` | Primary text |
| `--card` | `#0a0a0a` | Card backgrounds |
| `--muted` | `#262626` | Muted backgrounds |
| `--muted-foreground` | `#a3a3a3` | Secondary text |
| `--border` | `#262626` | All borders |
| `--input` | `#171717` | Input backgrounds |
| `--accent` | `#262626` | Accent backgrounds |
| `--destructive` | `oklch(0.704 0.191 22.216)` | Error/danger |

## usage

### in CSS

```css
.element {
  background: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}
```

### in Tailwind

```tsx
<div className="bg-background text-foreground border-border" />
<p className="text-muted-foreground" />
```

### in JavaScript

```tsx
import { colors } from "@syner/ui/branding";

const style = {
  background: colors.black,
  color: colors.white,
  borderColor: colors.neutral[800],
};
```

## accessibility

All text combinations meet WCAG AA:

| Foreground | Background | Contrast | Pass |
|------------|------------|----------|------|
| White | Black | 21:1 | AAA |
| neutral-400 | Black | 6.5:1 | AA |
| neutral-500 | Black | 4.6:1 | AA |
| Black | White | 21:1 | AAA |

## don't

- Don't use grays lighter than neutral-800 for borders on dark backgrounds
- Don't use pure white for large text blocks (use neutral-100)
- Don't introduce new colors without purpose
- Don't use color as the only indicator of state
