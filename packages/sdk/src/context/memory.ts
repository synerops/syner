export interface Memory {
  id: string;
  key: string;
  value: unknown;
  metadata?: {
    annotations?: Record<string, string>;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
    tags?: string[];
  };
}

export interface MemorySearchOptions {
  query?: string;
  tags?: string[];
  limit?: number;
  before?: Date;
  after?: Date;
}

export interface MemoryContext {
  /**
   * Store a memory
   */
  set(
    key: string,
    value: unknown,
    options?: {
      tags?: string[];
      expiresAt?: Date;
    }
  ): Promise<Memory>;

  /**
   * Retrieve a memory by key
   * Returns null if not found or expired
   */
  get(key: string): Promise<Memory | null>;

  /**
   * Search memories
   */
  search(options: MemorySearchOptions): Promise<Memory[]>;

  /**
   * Delete a memory
   */
  delete(key: string): Promise<boolean>;

  /**
   * Clear all memories (optionally by tags)
   */
  clear(tags?: string[]): Promise<number>;
}

/**
 * Optional base class for memory providers
 * Provides common helper methods
 */
export abstract class DefaultMemoryProvider implements MemoryContext {
  abstract set(
    key: string,
    value: unknown,
    options?: {
      tags?: string[];
      expiresAt?: Date
    }
  ): Promise<Memory>;
  abstract get(key: string): Promise<Memory | null>;
  abstract search(options: MemorySearchOptions): Promise<Memory[]>;
  abstract delete(key: string): Promise<boolean>;
  abstract clear(tags?: string[]): Promise<number>;

  /**
   * Generate unique memory ID
   */
  protected generateId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if a memory is expired
   */
  protected isExpired(memory: Memory): boolean {
    if (!memory.metadata?.expiresAt) return false;
    return memory.metadata.expiresAt < new Date();
  }
}
