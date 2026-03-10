# syner.design identity

Design system identity for the syner ecosystem.

## principles

### dark-native

Black is the canvas, not a theme toggle. We design for dark first, light is an afterthought.

- Background: soft dark gray `oklch(0.145 0 0)` — easier on the eyes than pure black
- Foreground: soft white `oklch(0.985 0 0)` — high contrast without harshness
- Muted: mid gray `oklch(0.708 0 0)` — secondary text

### terminal-inspired

We build for developers. The terminal aesthetic signals: this is serious tooling.

- Monospace for code, data, commands
- Sans for UI, labels, prose
- Pixel fonts for display/hero elements
- Search bars styled like command prompts
- Labels feel like CLI output

### minimal-functional

Every element earns its place. No decoration without purpose.

- No shadows — borders only, and subtle
- No gradients — flat colors
- No rounded corners > 8px — subtle, not playful
- Spacing is generous — let elements breathe
- **Radical minimalism** — almost invisible backgrounds

### grid-aware

Ultra-subtle spatial texture that doesn't compete with content.

- Diagonal hatching pattern (almost invisible)
- Corner markers for framing
- Optional baseline guides for typography

---

## tokens

### colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(0.145 0 0)` | Page background |
| `--foreground` | `oklch(0.985 0 0)` | Primary text |
| `--card` | `oklch(0.205 0 0)` | Card backgrounds |
| `--muted` | `oklch(0.269 0 0)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.708 0 0)` | Secondary text |
| `--border` | `oklch(1 0 0 / 10%)` | Borders (white 10% opacity) |
| `--primary` | `oklch(0.922 0 0)` | Primary actions |
| `--destructive` | `oklch(0.704 0.191 22.216)` | Destructive actions |

### typography

| Role | Font | Variable | Usage |
|------|------|----------|-------|
| Display | Geist Pixel Square | `--font-pixel` | Hero titles, brand moments |
| Body | Geist Sans | `--font-sans` | Paragraphs, UI |
| Code | Geist Mono | `--font-mono` | Code, commands, data |
| Label | Geist Sans | `--font-sans` | Labels, badges |

#### geist pixel variants

5 display variants for different aesthetics:

| Variant | Class | Vibe |
|---------|-------|------|
| Square | `geistPixelSquare` | Default, blocky pixels |
| Grid | `geistPixelGrid` | Pixels with grid overlay |
| Circle | `geistPixelCircle` | Rounded pixel dots |
| Triangle | `geistPixelTriangle` | Angular, directional |
| Line | `geistPixelLine` | Horizontal line pixels |

Use pixel fonts for:
- Hero titles
- Brand wordmarks
- Section headers (sparingly)
- Decorative display text

### scale

```
text-xs   → 12px  → Labels, badges, meta
text-sm   → 14px  → Secondary text, descriptions
text-base → 16px  → Body text
text-lg   → 18px  → Lead paragraphs
text-xl   → 20px  → Section titles
text-2xl  → 24px  → Subsection titles
text-5xl  → 48px  → Hero titles (sans)
text-7xl+ → 72px+ → Hero titles (pixel)
```

### spacing

8px grid. Everything aligns to multiples of 8.

```
gap-1  → 4px   → Tight (icon + text)
gap-2  → 8px   → Default internal
gap-4  → 16px  → Between related items
gap-6  → 24px  → Between sections
gap-8  → 32px  → Major sections
gap-16 → 64px  → Page sections
```

### borders

- Width: 1px always
- Color: `--border` (white 10% opacity)
- Radius: `--radius` (8px) or less
- Style: solid for UI, dashed for guides/grids

---

## visual elements

### grid background

Three variants for different levels of minimalism:

```tsx
import { GridBackground, TypographyGrid, MinimalBackground } from "@/components/grid-background";

// Default: Ultra-subtle diagonal texture + corner markers
<GridBackground />

// Typography pages: Center guides + corner markers
<TypographyGrid />

// Absolute minimal: Corner markers only
<MinimalBackground />
```

**Characteristics:**
- **Diagonal hatching** at 2% opacity — barely visible, just enough texture
- **Corner markers** at 10% opacity — subtle framing
- **Fixed attachment** — pattern doesn't scroll, creates depth
- **Uses CSS variables** — adapts to theme

**Philosophy:** The grid should be felt, not seen. It provides spatial awareness without demanding attention.

### corner markers

Small L-shaped brackets in the four corners:
- Size: 12px × 12px (h-3 w-3)
- Opacity: 10% of foreground
- Position: 32px (left-8, top-8, etc.) from edges
- Purpose: Frame the viewport without boxing it in

Think of them as terminal viewport delimiters.

---

## voice

### visual voice

- **Confident**: Large type, generous whitespace
- **Technical**: Monospace accents, terminal patterns
- **Pixel**: Geist Pixel for display, adds character
- **Minimal**: No unnecessary elements
- **Dark**: Dark gray as identity, not just preference
- **Calm**: Ultra-low contrast backgrounds, high contrast text

### anti-patterns

- Heavy backgrounds (keep them almost invisible)
- Too many grid lines (diagonal hatching is enough)
- Pure black backgrounds (use soft dark gray)
- Pure white text (use soft white)
- Shadows (too elevated)
- Gradients (too decorative)
- Rounded corners > 8px (too playful)
- Light backgrounds by default (not dark-native)
- Colored backgrounds for cards (use borders)
- Too many font weights (stick to 400, 500, 700)
- Pixel fonts for body text (only display)

---

## components

### buttons

6 variants, all flat:
- `default` — high contrast
- `secondary` — mid gray bg
- `outline` — border only
- `ghost` — no bg, hover reveals
- `destructive` — red, use sparingly
- `link` — underline on hover

### cards

- Border: 1px white/10%
- Background: slightly lighter than page (`--card`)
- Padding: 24px (p-6)
- No shadows ever

### inputs

- Border: 1px white/15%
- Background: transparent or `--input`
- Focus: ring with `--ring`
- Placeholder: muted-foreground
- Terminal style: prefix with `$` for command inputs

### labels/badges

- Uppercase
- Letter-spacing: wide (tracking-wide)
- Size: text-xs
- Color: muted-foreground
