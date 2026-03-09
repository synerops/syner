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
- Search bars styled like command prompts
- Labels feel like CLI output

### minimal-functional

Every element earns its place. No decoration without purpose.

- No shadows — borders only, and subtle
- No gradients — flat colors
- No rounded corners > 8px — subtle, not playful
- Spacing is generous — let elements breathe

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

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display | Geist Sans | 700 | Hero titles |
| Body | Geist Sans | 400 | Paragraphs, UI |
| Code | Geist Mono | 400 | Code, commands, data |
| Label | Geist Sans | 500 | Labels, badges |

### scale

```
text-xs   → 12px  → Labels, badges, meta
text-sm   → 14px  → Secondary text, descriptions
text-base → 16px  → Body text
text-lg   → 18px  → Lead paragraphs
text-xl   → 20px  → Section titles
text-2xl  → 24px  → Subsection titles
text-5xl  → 48px  → Hero titles
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
- Style: solid, never dashed

---

## voice

### visual voice

- **Confident**: Large type, generous whitespace
- **Technical**: Monospace accents, terminal patterns
- **Minimal**: No unnecessary elements
- **Dark**: Black as identity, not just preference

### anti-patterns

- Rounded corners > 8px (too playful)
- Shadows (too elevated)
- Gradients (too decorative)
- Light backgrounds by default (not dark-native)
- Colored backgrounds for cards (use borders)
- Too many font weights (stick to 400, 500, 700)

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

### labels/badges

- Uppercase
- Letter-spacing: wide (tracking-wide)
- Size: text-xs
- Color: muted-foreground
