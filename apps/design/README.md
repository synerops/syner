# Syner Design System

This is the design system documentation app for Syner UI. It showcases all components from the `@syner/ui` package with interactive examples and code snippets.

## Overview

The Design app is built with:

- **Next.js 16** - React framework
- **FumaDocs** - Documentation framework with MDX support
- **@syner/ui** - UI component library
- **TypeScript** - Type safety

## Getting Started

### Development

Run the development server:

```bash
# From the monorepo root
bun run dev

# Or specifically for the design app
cd apps/design
bun run dev
```

The app will be available at `http://localhost:3003`.

### Building

Build the app for production:

```bash
bun run build
```

## Project Structure

```
apps/design/
├── app/                          # Next.js app directory
│   ├── components/               # Component documentation pages
│   │   └── [[...slug]]/         # Dynamic routes for components
│   ├── layout.tsx               # Root layout
│   ├── layout.config.tsx        # Layout configuration
│   ├── page.tsx                 # Home page
│   └── global.css               # Additional styles
├── content/                      # MDX content
│   └── components/              # Component documentation
│       ├── button.mdx           # Button documentation
│       ├── tooltip.mdx          # Tooltip documentation
│       ├── toaster.mdx          # Toaster documentation
│       └── meta.json            # Navigation metadata
├── ui-components/               # React components for the app
│   ├── component-preview.tsx   # Preview container
│   └── code-block.tsx          # Code display
├── lib/                         # Utilities
│   └── source.ts               # FumaDocs source configuration
├── next.config.ts              # Next.js configuration
├── source.config.ts            # FumaDocs configuration
└── package.json                # Dependencies
```

## Adding New Components

To add documentation for a new component:

1. **Create an MDX file** in `content/components/`:

```mdx
---
title: MyComponent
description: A description of what the component does.
---

import { MyComponent } from '@syner/ui/components/my-component';
import { ComponentPreview } from '@/ui-components/component-preview';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';

## Installation

\`\`\`tsx
import { MyComponent } from '@syner/ui/components/my-component';
\`\`\`

## Usage

<Tabs items={['Preview', 'Code']}>
  <Tab value="Preview">
    <ComponentPreview>
      <MyComponent />
    </ComponentPreview>
  </Tab>
  <Tab value="Code">
    \`\`\`tsx
    <MyComponent />
    \`\`\`
  </Tab>
</Tabs>
```

2. **Update the navigation** in `content/components/meta.json`:

```json
{
  "title": "Components",
  "pages": ["button", "tooltip", "toaster", "my-component"]
}
```

3. **Run the dev server** to see your new component documentation.

## Component Documentation Structure

Each component documentation should include:

1. **Title and Description** - Frontmatter metadata
2. **Installation** - Import statement
3. **Usage** - Basic example with Preview and Code tabs
4. **Variants** - Different visual styles (if applicable)
5. **Sizes** - Different size options (if applicable)
6. **Props** - Component properties and their types
7. **Examples** - Common use cases

## Preview Component

The `ComponentPreview` component provides a consistent container for showcasing components:

```tsx
<ComponentPreview align="center">
  <YourComponent />
</ComponentPreview>
```

Props:
- `align`: `'center' | 'start' | 'end'` - Alignment of content (default: `'center'`)
- `className`: Additional CSS classes

## Styling Guidelines

- **DO NOT** define new styles in this app
- **DO** use styles from `@syner/ui/globals.css`
- **DO** use utility classes from Tailwind CSS
- **DO** use CSS variables defined in the UI package

All typography, colors, spacing, and design tokens come from `@syner/ui`.

## Key Features

- **Interactive Previews** - See components in action
- **Code Examples** - Copy-paste ready code snippets
- **Tabbed Interface** - Switch between Preview and Code
- **Dark Mode Support** - Automatic theme switching
- **Responsive Design** - Works on all screen sizes
- **Type Safety** - Full TypeScript support

## Dependencies

Main dependencies:
- `@syner/ui` - Component library (workspace)
- `fumadocs-core` - Documentation core
- `fumadocs-mdx` - MDX processing
- `fumadocs-ui` - Documentation UI components
- `next` - React framework
- `react` - UI library

## Contributing

When adding new components to `@syner/ui`:

1. Create the component in `packages/ui/src/components/`
2. Export it from the package
3. Document it in `apps/design/content/components/`
4. Update the navigation in `meta.json`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FumaDocs Documentation](https://fumadocs.dev)
- [Syner UI Package](../../packages/ui/README.md)