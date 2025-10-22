import type { Memory, MemorySearchOptions } from "@syner/sdk/context";
import { DefaultMemoryProvider } from "@syner/sdk/context";

/**
 * In-memory implementation of MemoryContext
 * Uses Map for storage with support for expiration and tags
 *
 * Best for: Development, testing, single-instance deployments
 * Not recommended for: Production multi-instance deployments
 */
export class InMemoryProvider extends DefaultMemoryProvider {
  #store: Map<string, Memory>;

  constructor() {
    super();
    this.#store = new Map<string, Memory>();
  }

  async set(
    key: string,
    value: unknown,
    options?: { tags?: string[]; expiresAt?: Date }
  ): Promise<Memory> {
    const now = new Date();
    const memory: Memory = {
      id: this.generateId(),
      key,
      value,
      metadata: {
        createdAt: now,
        updatedAt: now,
        expiresAt: options?.expiresAt,
        tags: options?.tags,
      },
    };

    this.#store.set(key, memory);
    return memory;
  }

  async get(key: string): Promise<Memory | null> {
    const memory = this.#store.get(key);

    if (!memory) return null;

    // Check expiration using helper
    if (this.isExpired(memory)) {
      this.#store.delete(key);
      return null;
    }

    return memory;
  }

  async search(options: MemorySearchOptions): Promise<Memory[]> {
    let results = Array.from(this.#store.values());

    // Filter expired
    results = results.filter((m) => !this.isExpired(m));

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter((m) =>
        m.metadata?.tags?.some((t) => options.tags?.includes(t))
      );
    }

    // Filter by date range
    if (options.after) {
      results = results.filter(
        (m) => m.metadata && m.metadata.createdAt >= options.after!
      );
    }

    if (options.before) {
      results = results.filter(
        (m) => m.metadata && m.metadata.createdAt <= options.before!
      );
    }

    // Search by query (simple keyword match)
    if (options.query) {
      const query = options.query.toLowerCase();
      results = results.filter((m) =>
        JSON.stringify(m.value).toLowerCase().includes(query)
      );
    }

    // Apply limit
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  async delete(key: string): Promise<boolean> {
    return this.#store.delete(key);
  }

  async clear(tags?: string[]): Promise<number> {
    if (!tags) {
      const size = this.#store.size;
      this.#store.clear();
      return size;
    }

    let count = 0;
    for (const [key, memory] of this.#store.entries()) {
      if (memory.metadata?.tags?.some((t) => tags.includes(t))) {
        this.#store.delete(key);
        count++;
      }
    }

    return count;
  }
}
