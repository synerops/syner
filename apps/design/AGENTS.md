# Design System

Component documentation app showcasing `@syner/ui` with interactive previews.

## Routes

| Path | Method | Description |
|------|--------|-------------|
| `/` | GET | Home page |
| `/components/[slug]` | GET | Component documentation page |

## Structure

```
app/
├── components/[[...slug]]/  # Dynamic component docs
├── layout.tsx               # Root layout with providers
└── page.tsx                 # Home page

content/
└── components/              # MDX documentation
    ├── button.mdx
    ├── tooltip.mdx
    ├── toaster.mdx
    └── meta.json            # Navigation order

components/
├── component-preview.tsx    # Preview container
└── code-block.tsx           # Code display
```

## Adding Components

1. Create MDX in `content/components/{name}.mdx`
2. Use `<ComponentPreview>` for interactive examples
3. Add to `meta.json` pages array

## Testing

```bash
# Run dev server
cd apps/design && bun run dev

# Access at http://localhost:3003
```

## Dependencies

- `@syner/ui` - Component library (workspace)
- `fumadocs-*` - Documentation framework
