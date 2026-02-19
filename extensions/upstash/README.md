# @syner/upstash

Upstash Redis integration for Syner OS. Provides a distributed KV (Key-Value) store implementation following the OS Protocol.

## Overview

This extension provides a distributed `Kv` implementation for Syner OS agents using Upstash Redis. Agents use the KV store to:

- **Store and retrieve data** by key with automatic expiration
- **List keys** by prefix for efficient querying
- **Cache API responses** with metadata for conditional requests

The `@syner/github` extension uses this KV store for GitHub API response caching.

```typescript
import { createUpstashKv } from '@syner/upstash/context/kv'
import { getFileContent } from '@syner/github'

const kv = createUpstashKv()
const file = await getFileContent({ client, kv, owner, repo, path })
```

## Setup

### 1. Create an Upstash Redis Database

1. Go to [Upstash Console](https://console.upstash.com/)
2. Click **Create Database**
3. Choose a name and region (select the region closest to your deployment)
4. Select **TLS** enabled (recommended)
5. Click **Create**

### 2. Get Your Credentials

After creating the database, go to the **REST API** section and copy:

- **UPSTASH_REDIS_REST_URL** - The REST API endpoint
- **UPSTASH_REDIS_REST_TOKEN** - The REST API token

### 3. Configure Environment Variables

Add these to your `.env` or deployment environment:

```env
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### 4. Install the Package

```bash
bun add @syner/upstash
```

## Usage

### Basic KV Operations

```typescript
import { createUpstashKv } from '@syner/upstash/context/kv'

const kv = createUpstashKv()

// Store a value
await kv.set('user:123', { 
  name: 'Alice', 
  role: 'admin' 
})

// Retrieve a value
const entry = await kv.get('user:123')
console.log(entry?.value) // { name: 'Alice', role: 'admin' }

// Remove a value
const removed = await kv.remove('user:123')
console.log(removed) // true if existed

// List keys by prefix
const userKeys = await kv.list('user:')
console.log(userKeys) // ['user:123', 'user:456', ...]
```

### Advanced Configuration

```typescript
import { createUpstashKv } from '@syner/upstash/context/kv'
import { Redis } from '@upstash/redis'

const kv = createUpstashKv({
  redis: new Redis({ /* custom config */ }),
  defaultTtl: 60 * 60, // 1 hour in seconds
  prefix: 'myapp:kv:', // Custom key prefix
})
```

## API Reference

### `createUpstashKv(options?)`

Creates a `Kv` instance backed by Upstash Redis implementing the OS Protocol KV interface.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `redis` | `Redis` | `Redis.fromEnv()` | Custom Redis client instance |
| `defaultTtl` | `number` | `2592000` (30 days) | Default TTL in seconds |
| `prefix` | `string` | `"kv:"` | Key prefix for all entries |

### KV Methods

| Method | Description |
|--------|-------------|
| `get<T>(key)` | Get a value by key |
| `set<T>(key, value)` | Store a value (create or update) |
| `remove(key)` | Remove an entry |
| `list(prefix?)` | List keys matching a prefix |

## Implementation Details

The KV store uses Redis with automatic expiration:

1. **Storage**: Values are JSON-serialized and stored with expiration
2. **Metadata**: Each entry includes creation time and expiration in metadata
3. **Prefix filtering**: `list()` uses Redis SCAN for efficient prefix queries

### Key Structure

```
kv:{key}              → JSON-serialized KvEntry
```

## Related

- [@syner/sdk](../../packages/sdk) - Core SDK with in-memory KV implementation
- [@syner/github](../github) - GitHub integration that uses KV for caching
- [OS Protocol](https://github.com/synerops/osprotocol) - Protocol specification