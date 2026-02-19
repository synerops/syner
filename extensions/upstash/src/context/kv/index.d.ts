/**
 * Upstash KV Store Type Definitions
 */

import type { Redis } from '@upstash/redis'
import type { 
  Kv, 
  KvEntry, 
  KvContext,
  KvActions 
} from '@osprotocol/schema/context/kv'

export interface UpstashKvOptions {
  /** Upstash Redis client instance. If not provided, uses Redis.fromEnv() */
  redis?: Redis
  /** Default TTL in seconds (default: 30 days) */
  defaultTtl?: number
  /** Key prefix for all kv entries (default: "kv:") */
  prefix?: string
}

export function createUpstashKv(options?: UpstashKvOptions): Kv
export function createKvContext(kv: Kv): KvContext
export function createKvActions(kv: Kv): KvActions

// Re-export types from OSP
export type { 
  Kv, 
  KvEntry, 
  KvContext,
  KvActions 
} from '@osprotocol/schema/context/kv'