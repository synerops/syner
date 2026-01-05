/**
 * Contract for registries that support dynamic discovery and registration.
 * Implementations can load items from filesystem paths and register them programmatically.
 *
 * @template T - The type of items managed by the registry
 *
 * @example
 * ```typescript
 * // Extend Registry to create custom discoverable collections
 * class PluginRegistry extends Registry<Plugin> {
 *   async discover(path: string): Promise<Plugin[]> {
 *     // Your custom discovery logic
 *   }
 *
 *   register(plugin: Plugin): void {
 *     // Your custom registration logic
 *   }
 * }
 *
 * // Registry guarantees the Discoverable contract
 * const registry: Discoverable<Plugin> = new PluginRegistry();
 * ```
 */
export interface Discoverable<T> {
   /**
    * Discovers and loads items from the specified path.
    * @param path - Filesystem path to scan for items
    * @returns Array of discovered items
    */
   discover(path: string): Promise<T[]>;

   /**
    * Manually registers an item in the registry.
    * @param item - The item to register
    */
   register(item: T): void;
 }
/**
 * Base Registry class for managing collections of items.
 * Generic implementation that can be extended for specific use cases.
 */
export abstract class Registry<T> implements Discoverable<T> {
  protected items = new Map<string, T>();

  /**
   * Discovers and loads items from a specified path.
   * Must be implemented by subclasses.
   */
  abstract discover(path: string): Promise<T[]>;

  /**
   * Manually registers an item in the registry.
   * Must be implemented by subclasses.
   */
  abstract register(item: T): void;

  /**
   * Retrieves an item by its ID.
   */
  get(id: string): T | undefined {
    return this.items.get(id);
  }

  /**
   * Returns all items in the registry.
   */
  all(): T[] {
    return Array.from(this.items.values());
  }

  /**
   * Returns all item IDs in the registry.
   */
  list(): string[] {
    return Array.from(this.items.keys());
  }

  /**
   * Checks if an item exists in the registry.
   */
  has(id: string): boolean {
    return this.items.has(id);
  }

  /**
   * Sets an item in the registry.
   */
  set(id: string, value: T): void {
    this.items.set(id, value);
  }
}
