---
topic: Next.js content/ directory frameworks (Velite, Fumadocs, Contentlayer, content-collections)
date: 2026-03-11
sources:
  - https://velite.js.org/guide/define-collections
  - https://velite.js.org/guide/with-nextjs
  - https://github.com/zce/velite
  - https://www.fumadocs.dev/docs/mdx
  - https://www.fumadocs.dev/docs/mdx/collections
  - https://www.fumadocs.dev/docs/mdx/workspace
  - https://github.com/fuma-nama/fumadocs
  - https://contentlayer.dev/docs/environments/nextjs-dcf8e39e
  - https://www.content-collections.dev/docs/quickstart/next
  - https://dev.to/sdorra/introducing-content-collections-ej0
  - https://dub.co/blog/content-collections
---

## Next.js Content Frameworks: Architectural Decision Research

The `content/` directory has become a de facto convention for colocating markdown/MDX source files with Next.js apps. All major frameworks treat this directory as the source of truth and generate a type-safe data layer into a hidden output directory (`.velite/`, `.source/`, `.content-collections/`) that is imported in application code.

---

### Contentlayer (deprecated — skip for new work)

The framework that established the convention. Maintained by Stackbit, abandoned when Stackbit was acquired by Netlify. Key conventions it introduced that every successor adopted:

- `contentlayer.config.ts` at project root
- `content/` as source directory, configurable via `contentDirPath`
- `defineDocumentType()` with Zod-like field definitions
- `.contentlayer/` generated output — import via `contentlayer/generated`
- `allPosts`, `allDocs` export naming convention
- Per-document `_raw` metadata (source path, flat path, etc.)

It broke with Next.js App Router and was never fixed. Do not use for new projects.

---

### Velite

**What it is:** Framework-agnostic content pipeline. Turns markdown/MDX, YAML, and JSON into a typed data layer via Zod schemas. Inspired by but more general than Contentlayer.

**Directory structure:**

```
content/
  posts/
    hello-world.md
    another-post.mdx
  authors/
    jane.yml
  tags/
    all-in-one.yml
.velite/           # generated output (gitignore this)
velite.config.ts   # at project root
```

**Collection definition:**

```typescript
// velite.config.ts
import { defineCollection, defineConfig, s } from 'velite'

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.{md,mdx}',
  schema: s.object({
    title: s.string().max(99),
    slug: s.slug('posts'),           // validates uniqueness
    date: s.isodate(),               // normalizes to ISO string
    cover: s.image(),                // processes image + blur hash
    tags: s.array(s.string()),
    draft: s.boolean().default(false),
    body: s.mdx(),                   // compiles MDX to function
  }).transform((data, { meta }) => ({
    ...data,
    permalink: `/blog/${data.slug}`,
  }))
})

export default defineConfig({
  root: 'content',     // content directory
  output: {
    data: '.velite',   // generated output
    assets: 'public/static',
  },
  collections: { posts },
})
```

**Using in Next.js:**

```typescript
// app/blog/page.tsx
import { posts } from '@/.velite'

export default function BlogPage() {
  const published = posts.filter(p => !p.draft)
  return <ul>{published.map(p => <li key={p.slug}>{p.title}</li>)}</ul>
}
```

**Next.js integration (two modes):**

```typescript
// next.config.ts — recommended for Turbopack
import { build } from 'velite'

export default async function nextConfig() {
  if (process.env.NODE_ENV !== 'production') await build({ watch: true, clean: false })
  else await build()
  return { /* your next config */ }
}
```

Or via Webpack plugin (does NOT work with Turbopack):

```typescript
import { VeliteWebpackPlugin } from 'velite/webpack'
// config.plugins.push(new VeliteWebpackPlugin())
```

**Key traits:**
- Extended Zod via `s.*` — `s.slug()`, `s.isodate()`, `s.image()`, `s.mdx()`, `s.markdown()`
- YAML, JSON, and markdown all supported in same project
- Build output is plain JSON + TypeScript definitions — no runtime overhead
- Turbopack: use programmatic API in `next.config.ts`, not the webpack plugin
- Last published: Dec 2024. Weekly downloads: ~3,700. Smaller community.

**Watch out for:**
- Turbopack compatibility requires the programmatic config approach — the Webpack plugin breaks
- Vercel deployments: `sharp` module memory errors reported with the Webpack plugin approach
- Smaller community vs Fumadocs; less UI scaffolding

---

### Fumadocs

**What it is:** A full documentation framework (UI + content pipeline) built on Next.js. Not just a content transformer — it ships a complete design system for docs sites. Actively the most popular option.

**Scope distinction:** Fumadocs = `fumadocs-core` (headless) + `fumadocs-ui` (components) + `fumadocs-mdx` (content pipeline). The content pipeline can be used standalone, but the value is in the full stack.

**Directory structure:**

```
content/
  docs/
    index.mdx
    getting-started.mdx
    guides/
      installation.mdx
    meta.json          # sidebar ordering/labels
.source/               # generated output (gitignore this)
source.config.ts       # collection config at project root
```

**Collection definition:**

```typescript
// source.config.ts
import { defineDocs, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config'
import { z } from 'zod'

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      author: z.string().optional(),
      date: z.string().date().optional(),
    }),
  },
  meta: {
    // options for meta.json sidebar files
  },
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})
```

**`defineDocs` creates two collections automatically:**
- `docs` — scans `.md` / `.mdx` files, validates frontmatter
- `meta` — scans `meta.json` files for sidebar structure

**Built-in frontmatter fields (from `frontmatterSchema`):**
- `title` (required)
- `description`
- `icon`
- `full` (boolean — full-width layout)

**Next.js integration:**

```typescript
// next.config.ts
import { createMDX } from 'fumadocs-mdx/next'
const withMDX = createMDX()
export default withMDX({ /* next config */ })
```

```typescript
// lib/source.ts — the source adapter
import { loader } from 'fumadocs-core/source'
import { createMDXSource } from 'fumadocs-mdx'
import { docs } from '@/.source'

export const source = loader({
  baseUrl: '/docs',
  source: createMDXSource(docs),
})
```

```typescript
// app/docs/[[...slug]]/page.tsx
import { source } from '@/lib/source'

export default async function DocPage({ params }) {
  const page = source.getPage(params.slug)
  const MDX = page.data.body
  return <MDX />
}
```

**Monorepo / workspace support:**

Fumadocs has a first-class workspace feature. Multiple content directories (even from separate packages) can be unified under one `source.config.ts`. A workspace only needs its own config file — no `package.json` required:

```typescript
// source.config.ts (root)
import { defineWorkspace } from 'fumadocs-mdx/config'

export default defineWorkspace({
  workspaces: ['apps/docs', 'apps/blog'],  // each has its own source.config.ts
})
```

This is the key monorepo differentiator for Fumadocs.

**Key traits:**
- Actively maintained — fumadocs-mdx v14.2.9, published 7 days ago (as of research date), 289K weekly downloads
- Full UI framework included (sidebar, search, breadcrumbs, etc.)
- First-class monorepo workspace support
- Turbopack compatible via `createMDX()`
- Content Collections is a supported alternative source (can swap backends)
- Built-in AI search / semantic search support
- Used by Turborepo docs, Million.js docs

**Watch out for:**
- Fumadocs is opinionated — it's a docs framework, not a general content pipeline
- If you need blog posts, landing page content, etc. alongside docs, you manage those separately
- The `source.config.ts` / `source.ts` split can be confusing initially

---

### @content-collections/core

**What it is:** The most direct Contentlayer successor. Built by Sebastian Sdorra specifically to address Contentlayer's architectural limitations. Lighter than Fumadocs — a content transformer, not a UI framework.

**Directory structure:**

```
content/
  posts/
    hello-world.md
  pages/
    about.md
.content-collections/   # generated output (gitignore this)
content-collections.ts  # config at project root
```

**Collection definition:**

```typescript
// content-collections.ts
import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { z } from 'zod'

const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '*.{md,mdx}',
  schema: (z) => ({
    title: z.string(),
    date: z.string().date(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document)
    return {
      ...document,
      mdx,
      slug: document._meta.path.replace(/\.mdx?$/, ''),
    }
  },
})

export default defineConfig({
  collections: [posts],
})
```

**Using in Next.js:**

```typescript
import { allPosts } from 'content-collections'

// Full type inference — no codegen step visible to developer
const published = allPosts.filter(p => !p.draft)
```

**Next.js integration:**

```typescript
// next.config.ts
import { withContentCollections } from '@content-collections/next'
export default withContentCollections({ /* next config */ })
```

**Key differences from Contentlayer:**
- Schema function receives `z` directly — no need to import Zod separately
- `transform` is async and receives a `context` with utilities (MDX compilation, etc.)
- `_meta` object on every document (replaces Contentlayer's `_raw`) — contains `path`, `filePath`, `directory`, `fileName`, `extension`
- No YAML/JSON collection support (markdown/MDX focus)
- Zod v3 and v4 compatible
- Turbopack compatible

**Key traits:**
- Actively maintained — last published recently, Dub.co migrated to it from Contentlayer
- Zero-runtime — all content compiled to JSON at build time
- Works with any React framework (Next.js, Remix, Vite)
- No UI components — pure data layer
- Simpler API surface than Velite — closer to Contentlayer's mental model
- `transform` is the extension point for MDX compilation, slug generation, computed fields

**Watch out for:**
- No image processing built-in (unlike Velite's `s.image()`)
- No YAML/JSON collection support
- Monorepo: each app defines its own `content-collections.ts` — no cross-app workspace feature like Fumadocs

---

### Common `content/` Convention Summary

All four frameworks converge on the same pattern:

| Aspect | Contentlayer | Velite | Fumadocs | content-collections |
|--------|-------------|--------|----------|---------------------|
| Config file | `contentlayer.config.ts` | `velite.config.ts` | `source.config.ts` | `content-collections.ts` |
| Content dir | `content/` (configurable) | `content/` (configurable) | `content/docs/` (configurable) | `content/` per collection |
| Output dir | `.contentlayer/` | `.velite/` | `.source/` | `.content-collections/` |
| Import from | `contentlayer/generated` | `@/.velite` | `@/.source` | `content-collections` |
| Schema tool | custom field types | Zod via `s.*` | Zod via `z` | Zod via `z` |
| Image handling | basic | built-in (`s.image()`) | none (DIY) | none (DIY) |
| MDX support | yes | yes (`s.mdx()`) | yes (first-class) | yes (via transform) |
| YAML/JSON | yes | yes | no | no |
| Turbopack | broken | workaround needed | yes | yes |
| Monorepo | poor | manual | first-class workspace | manual per-app |
| UI included | no | no | yes (full framework) | no |
| Maintenance | abandoned | slow (Dec 2024) | very active | active |

---

### Frontmatter Schema Pattern

All active frameworks use Zod. The key difference is how they expose it:

**Velite** — custom `s` namespace extending Zod:
```typescript
schema: s.object({ title: s.string(), date: s.isodate() })
```

**Fumadocs** — standard Zod, extend the built-in schema:
```typescript
schema: frontmatterSchema.extend({ author: z.string() })
```

**content-collections** — Zod passed as argument (no import needed in config):
```typescript
schema: (z) => ({ title: z.string(), date: z.string().date() })
```

---

### How Content Reaches Next.js at Build Time

1. Config file declares collections with directory patterns + Zod schema
2. Build hook (webpack plugin, Next.js config plugin, or `next.config.ts` integration) triggers content pipeline before/during Next.js compilation
3. Pipeline reads source files, parses frontmatter, validates against schema, runs transforms (MDX compilation, image optimization, etc.)
4. Output written to a hidden directory as JSON + TypeScript type definitions
5. App code imports from a virtual module or path alias — types are fully inferred, no `any`

All of this happens at build time. Zero runtime cost. Content is static data.

---

### Recommendation for a Monorepo with Multiple Apps

**If the use case is documentation sites:** Fumadocs. It has first-class monorepo workspace support, is the most actively maintained (289K weekly downloads, updated weekly), and ships a complete UI system. The workspace feature lets multiple apps share or separate their content configs.

**If the use case is general content (blog, landing pages, mixed types) across multiple apps:** @content-collections/core. It's the cleanest successor to Contentlayer, Turbopack-compatible, and has a minimal API surface. Each app maintains its own `content-collections.ts` — there's no cross-app workspace feature, but for a Turborepo where each app is autonomous, this maps naturally to the "apps are autonomous" architecture principle.

**Velite** is a reasonable middle ground but has slower maintenance cadence and the Turbopack workaround is a friction point given Next.js's direction.

**Do not use Contentlayer** for anything new.

### For this repo (syner) specifically

The apps/wiki (markdown wiki/knowledge base) and apps/dev (developer portal) are the most likely candidates for a content framework. Given:
- The repo is a Turborepo monorepo
- Apps are intentionally autonomous
- Vaults are personal markdown, not framework-managed content

The practical choice is **@content-collections/core** for any app-level structured content (blog posts, changelogs, etc.) and **Fumadocs** if apps/wiki becomes a docs site. They can coexist — they are not mutually exclusive.
