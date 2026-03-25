import { getProjectRoot } from './root'

export interface RegistryConfig<T> {
  /** Discover all entries from the project filesystem */
  discover: (root: string) => Promise<T[]>
  /** Extract the unique key from an entry */
  key: (entry: T) => string
}

export interface Registry<T> {
  /** All entries as a sorted list */
  list(): Promise<T[]>
  /** Get a single entry by key */
  get(key: string): Promise<T | undefined>
  /** Raw map (for runtime views like SkillsMap) */
  entries(): Promise<Map<string, T>>
  /** Filter entries by predicate */
  filter(fn: (entry: T) => boolean): Promise<T[]>
  /** Find first entry matching predicate */
  find(fn: (entry: T) => boolean): Promise<T | undefined>
  /** Drop the cache (useful in dev with hot reload) */
  invalidate(): void
}

/**
 * Create a cached, Promise-based registry that discovers entries from the filesystem.
 *
 * - Root is resolved internally via .git walk-up (never exposed to consumers)
 * - Cache stores the Promise itself (no race conditions on concurrent calls)
 * - One filesystem scan per cold start; subsequent calls return cached data
 */
export function createRegistry<T>(config: RegistryConfig<T>): Registry<T> {
  let cached: Promise<{ map: Map<string, T>; list: T[] }> | null = null

  function load(): Promise<{ map: Map<string, T>; list: T[] }> {
    const root = getProjectRoot()
    return config.discover(root).then(entries => {
      const map = new Map<string, T>()
      for (const entry of entries) map.set(config.key(entry), entry)
      return { map, list: entries }
    })
  }

  function resolve() {
    cached ??= load()
    return cached
  }

  return {
    list: () => resolve().then(r => r.list),
    get: (key) => resolve().then(r => r.map.get(key)),
    entries: () => resolve().then(r => r.map),
    filter: (fn) => resolve().then(r => r.list.filter(fn)),
    find: (fn) => resolve().then(r => r.list.find(fn)),
    invalidate: () => { cached = null },
  }
}
