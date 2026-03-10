# syner.design identity

Design system identity for the syner ecosystem.

## principles

### dark-native

Black is the canvas, not a theme toggle. We design for dark first, light is an afterthought.

- Background: pure black `oklch(0 0 0)` — not zinc-900, not gray-950
- Foreground: pure white `oklch(1 0 0)` — maximum contrast
- Muted: zinc-400 `oklch(0.639 0 0)` — secondary text

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

### grid-aware

A subtle grid background gives the design-tool aesthetic.

- Dotted grid pattern (16px cells)
- Larger grid lines (80px cells)
- Corner markers for framing
- Baseline markers for typography specimens

---

## tokens

### colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(0 0 0)` | Page background |
| `--foreground` | `oklch(1 0 0)` | Primary text |
| `--card` | `oklch(0.039 0 0)` | Card backgrounds |
| `--muted` | `oklch(0.149 0 0)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.639 0 0)` | Secondary text |
| `--border` | `oklch(0.149 0 0)` | Borders (zinc-800) |
| `--primary` | `oklch(1 0 0)` | Primary actions (white) |
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
- Color: `--border` (zinc-800)
- Radius: `--radius` (8px) or less
- Style: solid for UI, dashed for guides/grids

---

## visual elements

### grid background

The signature grid pattern inspired by vercel.com/font:

```tsx
import { GridBackground } from "@/components/grid-background";

// In layout
<body>
  <GridBackground />
  <div className="relative z-10">{children}</div>
</body>
```

Two variants available:
- `GridBackground` — Full page dotted grid with corner markers
- `TypographyGrid` — Baseline guides for typography specimens

### baseline markers

Typography specimens can show baseline/x-height markers:

```
722  ─ ─ ─ ─  cap height
532  ─ ─ ─ ─  x-height
0    ─ ─ ─ ─  baseline
```

---

## voice

### visual voice

- **Confident**: Large type, generous whitespace
- **Technical**: Monospace accents, terminal patterns
- **Pixel**: Geist Pixel for display, adds character
- **Minimal**: No unnecessary elements
- **Dark**: Black as identity, not just preference

### anti-patterns

- Rounded corners > 8px (too playful)
- Shadows (too elevated)
- Gradients (too decorative)
- Light backgrounds by default (not dark-native)
- Colored backgrounds for cards (use borders)
- Too many font weights (stick to 400, 500, 700)
- Pixel fonts for body text (only display)

---

## components

### buttons

6 variants, all flat:
- `default` — white bg, black text
- `secondary` — zinc-800 bg
- `outline` — border only
- `ghost` — no bg, hover reveals
- `destructive` — red, use sparingly
- `link` — underline on hover

### cards

- Border: 1px zinc-800
- Background: slightly lighter than page (`--card`)
- Padding: 24px (p-6)
- No shadows ever

### inputs

- Border: 1px zinc-800
- Background: transparent or `--input`
- Focus: ring with `--ring`
- Placeholder: muted-foreground
- Terminal style: prefix with `$` for command inputs

### labels/badges

- Uppercase
- Letter-spacing: wide (tracking-wide)
- Size: text-xs
- Color: muted-foreground
