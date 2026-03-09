# design references

Visual references that inform syner.design identity.

---

## akira (akira.sachi.dev)

Modern starter with Next.js, Tailwind, shadcn/ui.

### what we take

- **Grid layout**: Tech stack displayed as icon grid with labels
- **Feature cards**: Right-side cards with uppercase labels (AUTHENTICATION, PAYMENTS, DATABASE)
- **Asymmetric balance**: Hero left, features right
- **Subtle borders**: Cards with 1px borders, no shadows
- **Warm accent**: Optional gold/amber for special elements

### patterns

```
┌─────────────────────────────────────────────────┐
│  Hero (left)              │  Feature cards      │
│  - Badge "Ship right away"│  - AUTHENTICATION   │
│  - Title large            │  - PAYMENTS         │
│  - Description            │  - DATABASE         │
│  - CTAs                   │                     │
├───────────────────────────┴─────────────────────┤
│  Tech grid (icons + labels)                     │
│  NEXT.JS  MOTION  TYPESCRIPT  TAILWIND  etc.    │
└─────────────────────────────────────────────────┘
```

---

## grok creative studio (v0-grokstudio.vercel.app)

AI image generation interface.

### what we take

- **Ultra minimalism**: Almost everything is black
- **Functional focus**: UI serves the task, nothing decorative
- **Sidebar patterns**: Simple navigation, collapsible sections
- **Empty states**: Clear CTAs when no content

### patterns

```
┌────────────┬────────────────────────────────────┐
│  Sidebar   │  Main workspace                    │
│  - EXPLORE │  - Empty state with CTA            │
│  - MY WORK │  - "START CREATING" button         │
│            │                                    │
└────────────┴────────────────────────────────────┘
```

---

## v1.run (packrun.dev)

npm registry for AI agents.

### what we take

- **Terminal aesthetic**: Search bar styled like command prompt with "$"
- **ASCII/monospace logo**: Technical, developer-focused
- **Tag cloud**: Quick links as inline tags
- **Release cards**: Minimal cards with version info
- **Structured footer**: Columns with clear hierarchy

### patterns

```
┌─────────────────────────────────────────────────┐
│  Navigation (right-aligned)                     │
│  Releases • MCP • Live • API • Search           │
├─────────────────────────────────────────────────┤
│  Logo (ASCII/stylized)                          │
│  Tagline: "npm for agents"                      │
│  Subtitle: concise value prop                   │
├─────────────────────────────────────────────────┤
│  [$ search packages...]                    [▊]  │  ← Terminal style
├─────────────────────────────────────────────────┤
│  next • react • drizzle-orm • hono • etc.       │  ← Tag cloud
├─────────────────────────────────────────────────┤
│  UPCOMING RELEASES                         ← →  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │Drizzle   │ │Nuxt      │ │TypeScript│        │
│  │v1.0.0    │ │v5.0.0    │ │v7.0.0    │        │
│  └──────────┘ └──────────┘ └──────────┘        │
├─────────────────────────────────────────────────┤
│  Footer columns                                 │
│  PRODUCT  │  RESOURCES  │  COMPANY              │
└─────────────────────────────────────────────────┘
```

---

## synthesis

### common patterns

| Pattern | Akira | Grok | v1 | Our take |
|---------|-------|------|-----|----------|
| Pure black bg | Yes | Yes | Yes | Required |
| Subtle borders | Yes | Yes | Yes | Required |
| No shadows | Yes | Yes | Yes | Required |
| Uppercase labels | Yes | No | Yes | Use for sections |
| Icon grids | Yes | No | No | Use for tech stack |
| Terminal search | No | No | Yes | Use for primary CTA |
| Feature cards | Yes | No | Yes | Use for showcasing |

### our identity

```
Dark-native       → From all three
Terminal-inspired → From v1.run
Grid layouts      → From Akira
Minimal function  → From Grok
```

We are: **developer tooling that looks like developer tooling**.
