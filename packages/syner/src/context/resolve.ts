import type { VaultStore } from './vault-store'
import type { Brief, ContextRequest, ContextScope } from './types'

export async function resolveContext(
  request: ContextRequest,
  store: VaultStore
): Promise<Brief> {
  const { scope, app, query } = request

  if (scope === 'none') {
    return { content: '', sources: [], scope: 'none', gaps: [] }
  }

  // Determine glob pattern based on scope
  const pattern = scopeToPattern(scope, app)

  // Discover matching vault files
  const paths = await store.list(pattern)

  // Read all matching files
  const entries = await Promise.all(
    paths.map(async (p) => ({ path: p, content: await store.read(p) }))
  )

  const loaded = entries.filter(
    (e): e is { path: string; content: string } => e.content !== null
  )

  // For targeted scope, filter by query relevance
  const relevant =
    scope === 'targeted' && query ? filterByRelevance(loaded, query) : loaded

  // Assemble brief
  const content = relevant
    .map((e) => `<!-- source: ${e.path} -->\n${e.content}`)
    .join('\n\n---\n\n')

  const gaps =
    scope === 'targeted' && query ? detectGaps(loaded, relevant, query) : []

  return {
    content,
    sources: relevant.map((e) => e.path),
    scope,
    gaps,
  }
}

function scopeToPattern(scope: ContextScope, app?: string): string {
  switch (scope) {
    case 'app':
      return `${app}/**/*.md`
    case 'targeted':
      return '**/*.md'
    case 'full':
      return '**/*.md'
    default:
      return '**/*.md'
  }
}

function filterByRelevance(
  entries: { path: string; content: string }[],
  query: string
): { path: string; content: string }[] {
  // Simple keyword matching for v1
  // Future: use embeddings or LLM-based relevance
  const terms = query.toLowerCase().split(/\s+/)
  return entries.filter((e) => {
    const text = (e.path + ' ' + e.content).toLowerCase()
    return terms.some((t) => text.includes(t))
  })
}

function detectGaps(
  _all: { path: string; content: string }[],
  relevant: { path: string; content: string }[],
  query: string
): string[] {
  // If nothing matched, the query itself is a gap
  if (relevant.length === 0) return [query]
  return []
}
