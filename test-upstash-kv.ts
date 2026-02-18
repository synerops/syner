#!/usr/bin/env bun
/**
 * Test script for Upstash KV implementation
 * 
 * Tests the new KV interface implementation with Upstash Redis.
 * 
 * Requirements:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

import { createUpstashKv } from './extensions/upstash/src/context/kv/upstash'

async function testUpstashKv() {
  console.log('🧪 Testing Upstash KV implementation...\n')

  // Check environment variables
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.error('❌ Missing required environment variables:')
    console.error('   UPSTASH_REDIS_REST_URL')
    console.error('   UPSTASH_REDIS_REST_TOKEN')
    process.exit(1)
  }

  try {
    // Create KV instance
    console.log('1️⃣ Creating Upstash KV instance...')
    const kv = createUpstashKv()
    console.log('   ✅ Instance created\n')

    // Test set
    console.log('2️⃣ Testing set operation...')
    const testKey = `test:kv:${Date.now()}`
    const testValue = { 
      message: 'Hello from KV test',
      timestamp: new Date().toISOString(),
      nested: {
        data: 'Works with nested objects'
      }
    }
    
    const entry = await kv.set(testKey, testValue)
    console.log('   ✅ Set successful')
    console.log(`   Key: ${entry.key}`)
    console.log(`   Value:`, entry.value)
    console.log()

    // Test get
    console.log('3️⃣ Testing get operation...')
    const retrieved = await kv.get(testKey)
    if (!retrieved) {
      throw new Error('Failed to retrieve value')
    }
    console.log('   ✅ Get successful')
    console.log(`   Retrieved:`, retrieved.value)
    
    // Verify data integrity
    const retrievedValue = retrieved.value as typeof testValue
    if (retrievedValue.message !== testValue.message) {
      throw new Error('Data mismatch!')
    }
    console.log('   ✅ Data integrity verified\n')

    // Test list with prefix
    console.log('4️⃣ Testing list operation...')
    const keys = await kv.list('test:kv:')
    console.log(`   ✅ Found ${keys.length} keys with prefix "test:kv:"`)
    if (keys.length > 0) {
      console.log(`   First few keys:`, keys.slice(0, 3))
    }
    console.log()

    // Test remove
    console.log('5️⃣ Testing remove operation...')
    const removed = await kv.remove(testKey)
    console.log(`   ✅ Remove successful: ${removed}`)
    
    // Verify removal
    const afterRemove = await kv.get(testKey)
    if (afterRemove !== null) {
      throw new Error('Value still exists after removal')
    }
    console.log('   ✅ Removal verified\n')

    // Test TTL/expiration (via metadata)
    console.log('6️⃣ Testing expiration metadata...')
    const ttlKey = `test:ttl:${Date.now()}`
    const ttlEntry = await kv.set(ttlKey, { data: 'expires soon' })
    
    if (ttlEntry.metadata?.expiresAt) {
      const expiresAt = new Date(ttlEntry.metadata.expiresAt as number)
      console.log(`   ✅ Expiration set to: ${expiresAt.toISOString()}`)
    }
    
    // Cleanup
    await kv.remove(ttlKey)
    console.log()

    console.log('✅ All Upstash KV tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

// Run tests
testUpstashKv().catch(console.error)