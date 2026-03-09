# syner.design

Agentic design system — components that AI agents can understand and generate.

## Structure

<!-- auto:structure -->
```
apps/design/
├── app/
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── agents/
│   └── design.md                   # Lead agent definition
├── components/                     # (coming soon)
└── lib/
    └── utils.ts                    # Utilities
```
<!-- /auto:structure -->

## Vision

Traditional design systems are for humans writing code.
syner.design is for agents generating interfaces.

- Components described in markdown specs
- Tokens that LLMs understand natively
- Patterns agents can compose

## Conventions

- **Components** in `components/{name}/`
- **Specs** in `components/{name}/SPEC.md`
- **Tokens** in `lib/tokens/`

## Adding a component (when ready)

1. Create component directory:
   ```bash
   mkdir -p components/{name}
   ```

2. Create implementation:
   ```
   components/{name}/index.tsx
   ```

3. Create spec for agents:
   ```
   components/{name}/SPEC.md
   ```

   Spec should describe:
   - What the component does
   - When to use it
   - Props and variants
   - Composition patterns

## What NOT to do

- Don't create components without specs
- Don't use design patterns agents can't describe
- Don't couple to specific frameworks unnecessarily
