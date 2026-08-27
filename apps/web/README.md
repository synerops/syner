# web

Next.js app for Syner. Consumes the design system from `@syner/ui` (coss on Base UI).

```bash
bun run dev --filter web
```

Add UI primitives from the app so they land in `packages/ui`:

```bash
cd apps/web && bunx --bun shadcn@latest add @coss/<component>
```
