<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">web</h1>

<p align="center">
  <strong>The public site for Syner.</strong>
</p>

Built with Next.js on `@syner/ui`, it presents the Cloud for Agents and sends
people to Syner OS at syner.app.

```bash
bun run dev --filter web
```

Add UI primitives from this app so they land in `packages/ui`:

```bash
cd apps/web && bunx --bun shadcn@latest add @coss/<component>
```
