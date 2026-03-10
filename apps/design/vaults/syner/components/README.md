# components

Syner design system primitives. Radically minimal, terminal-inspired.

## philosophy

- **Minimal-functional** - Every element earns its place
- **Terminal-inspired** - CLI aesthetic for developer tools
- **Border-based** - No shadows, subtle lines only
- **Dark-native** - Designed for dark backgrounds first

## primitives

| Component | Variants | File |
|-----------|----------|------|
| Card | `default`, `bracket` | [card.md](./card.md) |
| Button | 6 variants | shadcn/ui |
| Badge | 4 variants | shadcn/ui |
| Input | - | shadcn/ui |
| Separator | - | shadcn/ui |

## organization

Each primitive gets its own `.md` file with:
- Variant documentation
- Usage examples
- Guidelines
- Anti-patterns

Component code lives in `packages/ui/src/components/`.

## card evolution

The `Card` component evolved to support two distinct use cases:

### `variant="default"`
Traditional content card for:
- Dashboard widgets
- Form sections
- Data display
- General UI needs

### `variant="bracket"`
Minimal showcase card for:
- Feature highlights
- Landing pages
- Marketing sections
- Visual emphasis

See [card.md](./card.md) for full documentation.

## using shadcn components

Most components use shadcn/ui defaults with our tokens:

```bash
cd packages/ui
bunx shadcn@latest add [component]
```

They automatically inherit our color system from `globals.css`.

## customization

Override via tokens in `globals.css`:
- `--card` - Card background
- `--border` - Border color
- `--foreground` - Text color
- `--muted-foreground` - Secondary text

No need to edit component files directly unless adding variants.
