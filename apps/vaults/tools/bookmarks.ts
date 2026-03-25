/**
 * Bookmarks tool — vaults domain tool for bookmark operations.
 *
 * Consumes Read and Write from syner. Vaults-specific because
 * bookmark logic (naming, tags, dedup) is context engineer responsibility.
 *
 * The runtime injects deps — this tool doesn't know about Sandbox.
 */

import { z } from 'zod'

export const bookmarksSchema = z.object({
  op: z.enum(['list', 'byTag', 'exists', 'create']).describe('Operation to perform'),
  tag: z.string().optional().describe('Tag to filter by (for byTag operation)'),
  url: z.string().optional().describe('URL to check or save (for exists/create)'),
  data: z.object({
    url: z.string(),
    title: z.string(),
    source: z.string(),
    tags: z.array(z.string()),
    author: z.string().optional(),
    date_published: z.string().optional(),
  }).optional().describe('Bookmark data (for create operation)'),
})

export type BookmarksInput = z.infer<typeof bookmarksSchema>

/** Execution functions injected by runtime */
export interface BookmarksDeps {
  glob: (pattern: string) => Promise<string>
  read: (filePath: string) => Promise<string>
  write: (filePath: string, content: string) => Promise<string>
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const fm: Record<string, unknown> = {}
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':')
    if (key && rest.length) {
      const val = rest.join(':').trim()
      // Parse arrays like [a, b, c]
      if (val.startsWith('[') && val.endsWith(']')) {
        fm[key.trim()] = val.slice(1, -1).split(',').map(s => s.trim())
      } else {
        fm[key.trim()] = val.replace(/^["']|["']$/g, '')
      }
    }
  }
  return fm
}

export async function executeBookmarks(
  deps: BookmarksDeps,
  input: BookmarksInput
): Promise<string> {
  switch (input.op) {
    case 'list': {
      const result = await deps.glob('.syner/bookmarks/*.md')
      if (result === 'No files found') return JSON.stringify({ bookmarks: [] })
      const files = result.split('\n').filter(Boolean)
      const bookmarks = []
      for (const f of files) {
        const content = await deps.read(f)
        const fm = parseFrontmatter(content.replace(/^\s*\d+\t/gm, ''))
        bookmarks.push({ path: f, ...fm })
      }
      return JSON.stringify({ bookmarks })
    }

    case 'byTag': {
      if (!input.tag) return JSON.stringify({ error: 'tag required for byTag operation' })
      const result = await deps.glob('.syner/bookmarks/*.md')
      if (result === 'No files found') return JSON.stringify({ bookmarks: [] })
      const files = result.split('\n').filter(Boolean)
      const bookmarks = []
      for (const f of files) {
        const content = await deps.read(f)
        const fm = parseFrontmatter(content.replace(/^\s*\d+\t/gm, ''))
        const tags = Array.isArray(fm.tags) ? fm.tags : []
        if (tags.some(t => String(t).toLowerCase() === input.tag!.toLowerCase())) {
          bookmarks.push({ path: f, ...fm })
        }
      }
      return JSON.stringify({ bookmarks })
    }

    case 'exists': {
      if (!input.url) return JSON.stringify({ error: 'url required for exists operation' })
      const result = await deps.glob('.syner/bookmarks/*.md')
      if (result === 'No files found') return JSON.stringify({ exists: false })
      const files = result.split('\n').filter(Boolean)
      for (const f of files) {
        const content = await deps.read(f)
        const fm = parseFrontmatter(content.replace(/^\s*\d+\t/gm, ''))
        if (fm.url === input.url) {
          return JSON.stringify({ exists: true, path: f })
        }
      }
      return JSON.stringify({ exists: false })
    }

    case 'create': {
      if (!input.data) return JSON.stringify({ error: 'data required for create operation' })
      const { url, title, source, tags, author, date_published } = input.data
      const slug = slugify(title)
      const fileName = `${source}--${slug}.md`
      const filePath = `.syner/bookmarks/${fileName}`
      const now = new Date().toISOString().split('T')[0]

      const fmLines = [
        `url: "${url}"`,
        `title: "${title}"`,
        `source: ${source}`,
        author ? `author: "${author}"` : null,
        date_published ? `date_published: "${date_published}"` : null,
        `date_saved: "${now}"`,
        `tags: [${tags.join(', ')}]`,
      ].filter(Boolean).join('\n')

      const content = `---\n${fmLines}\n---\n`
      await deps.write(filePath, content)
      return JSON.stringify({ created: filePath })
    }
  }
}
