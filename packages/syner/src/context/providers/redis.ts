import {
  DefaultMemoryProvider,
  type Memory,
  type MemorySearchOptions,
} from "@syner/sdk/context";

// Type-only import to avoid runtime dependency
// Users must install ioredis themselves: pnpm add ioredis
type Redis = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<"OK" | null>;
  setex(key: string, seconds: number, value: string): Promise<"OK" | null>;
  del(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  scan(
    cursor: string | number,
    ...args: Array<string | number>
  ): Promise<[string, string[]]>;
  expire(key: string, seconds: number): Promise<number>;
};

export interface RedisMemoryOptions {
  /**
   * Redis client instance (from ioredis)
   * User must provide: import Redis from 'ioredis'; client: new Redis(...)
   */
  client?: Redis;
  /**
   * Redis connection URL (alternative to client)
   */
  url?: string;
  /**
   * Key prefix for all memory entries
   * @default "syner:memory:"
   */
  keyPrefix?: string;
  /**
   * Default TTL in seconds (optional)
   */
  ttl?: number;
}

/**
 * Redis-based implementation of MemoryContext
 * 
 * Requires: pnpm add ioredis
 * 
 * Best for: Production deployments, multi-instance applications, persistence
 * 
 * @example
 * ```typescript
 * import Redis from 'ioredis';
 * import { RedisMemoryProvider } from 'syner/context/providers';
 * 
 * const provider = new RedisMemoryProvider({
 *   client: new Redis(process.env.REDIS_URL),
 *   keyPrefix: 'myapp:',
 *   ttl: 3600
 * });
 * ```
 */
export class RedisMemoryProvider extends DefaultMemoryProvider {
  #redis: Redis;
  #keyPrefix: string;
  #defaultTTL?: number;

  constructor(options: RedisMemoryOptions) {
    super();

    if (!options.client && !options.url) {
      throw new Error(
        "RedisMemoryProvider requires either 'client' or 'url' option"
      );
    }

    // If url provided but no client, try to create client
    if (options.url && !options.client) {
      try {
        // Dynamic import to avoid bundling ioredis if not used
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        const Redis = eval('require')("ioredis");
        this.#redis = new Redis(options.url) as Redis;
      } catch (error) {
        throw new Error(
          "ioredis is not installed. Install it with: pnpm add ioredis"
        );
      }
    } else {
      this.#redis = options.client!;
    }

    this.#keyPrefix = options.keyPrefix ?? "syner:memory:";
    this.#defaultTTL = options.ttl;
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

    const redisKey = this.#keyPrefix + key;
    const serialized = JSON.stringify(memory);

    // Calculate TTL
    let ttl: number | undefined;
    if (options?.expiresAt) {
      ttl = Math.floor((options.expiresAt.getTime() - now.getTime()) / 1000);
      if (ttl <= 0) {
        throw new Error("expiresAt must be in the future");
      }
    } else if (this.#defaultTTL) {
      ttl = this.#defaultTTL;
    }

    // Set with or without TTL
    if (ttl) {
      await this.#redis.setex(redisKey, ttl, serialized);
    } else {
      await this.#redis.set(redisKey, serialized);
    }

    // Store in tag index for search
    if (options?.tags && options.tags.length > 0) {
      for (const tag of options.tags) {
        const tagKey = `${this.#keyPrefix}tag:${tag}`;
        await this.#redis.set(tagKey + ":" + key, "1");
        if (ttl) {
          await this.#redis.expire(tagKey + ":" + key, ttl);
        }
      }
    }

    return memory;
  }

  async get(key: string): Promise<Memory | null> {
    const redisKey = this.#keyPrefix + key;
    const data = await this.#redis.get(redisKey);

    if (!data) return null;

    try {
      const memory = JSON.parse(data) as Memory;

      // Restore Date objects
      if (memory.metadata) {
        if (memory.metadata.createdAt) {
          memory.metadata.createdAt = new Date(memory.metadata.createdAt);
        }
        if (memory.metadata.updatedAt) {
          memory.metadata.updatedAt = new Date(memory.metadata.updatedAt);
        }
        if (memory.metadata.expiresAt) {
          memory.metadata.expiresAt = new Date(memory.metadata.expiresAt);
        }
      }

      // Check expiration (redundant since Redis handles TTL, but for consistency)
      if (this.isExpired(memory)) {
        await this.delete(key);
        return null;
      }

      return memory;
    } catch (error) {
      // Invalid JSON, delete and return null
      await this.delete(key);
      return null;
    }
  }

  async search(options: MemorySearchOptions): Promise<Memory[]> {
    let keys: string[] = [];

    // Search by tags first if provided
    if (options.tags && options.tags.length > 0) {
      const tagKeys: string[] = [];
      for (const tag of options.tags) {
        const pattern = `${this.#keyPrefix}tag:${tag}:*`;
        const tagSpecificKeys = await this.#redis.keys(pattern);
        tagKeys.push(...tagSpecificKeys);
      }

      // Extract actual memory keys from tag keys
      keys = tagKeys.map((tk) => {
        const parts = tk.split(":");
        const memKey = parts[parts.length - 1];
        return this.#keyPrefix + memKey!;
      });

      // Deduplicate
      keys = Array.from(new Set(keys));
    } else {
      // Get all memory keys
      const pattern = `${this.#keyPrefix}*`;
      const allKeys = await this.#redis.keys(pattern);

      // Filter out tag index keys
      keys = allKeys.filter((k) => !k.includes(":tag:"));
    }

    // Fetch all memories
    const memories: Memory[] = [];
    for (const key of keys) {
      const data = await this.#redis.get(key);
      if (!data) continue;

      try {
        const memory = JSON.parse(data) as Memory;

        // Restore Date objects
        if (memory.metadata) {
          if (memory.metadata.createdAt) {
            memory.metadata.createdAt = new Date(memory.metadata.createdAt);
          }
          if (memory.metadata.updatedAt) {
            memory.metadata.updatedAt = new Date(memory.metadata.updatedAt);
          }
          if (memory.metadata.expiresAt) {
            memory.metadata.expiresAt = new Date(memory.metadata.expiresAt);
          }
        }

        memories.push(memory);
      } catch {
        // Skip invalid entries
        continue;
      }
    }

    // Apply filters
    let results = memories;

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

    // Search by query
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
    const redisKey = this.#keyPrefix + key;

    // Get memory to find tags
    const data = await this.#redis.get(redisKey);
    if (data) {
      try {
        const memory = JSON.parse(data) as Memory;
        // Delete tag indexes
        if (memory.metadata?.tags) {
          for (const tag of memory.metadata.tags) {
            await this.#redis.del(`${this.#keyPrefix}tag:${tag}:${key}`);
          }
        }
      } catch {
        // Ignore parse errors
      }
    }

    const deleted = await this.#redis.del(redisKey);
    return deleted > 0;
  }

  async clear(tags?: string[]): Promise<number> {
    if (!tags) {
      // Clear all memory keys
      const pattern = `${this.#keyPrefix}*`;
      const keys = await this.#redis.keys(pattern);

      if (keys.length === 0) return 0;

      // Delete keys in batches to avoid argument list too long
      for (const key of keys) {
        await this.#redis.del(key);
      }
      return keys.length;
    }

    // Clear by tags
    let count = 0;
    for (const tag of tags) {
      const pattern = `${this.#keyPrefix}tag:${tag}:*`;
      const tagKeys = await this.#redis.keys(pattern);

      for (const tagKey of tagKeys) {
        const parts = tagKey.split(":");
        const memKey = parts[parts.length - 1]!;
        const deleted = await this.delete(memKey);
        if (deleted) count++;
      }
    }

    return count;
  }
}

