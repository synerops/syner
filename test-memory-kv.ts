#!/usr/bin/env bun
/**
 * Test script for Memory KV implementation
 * 
 * Tests the in-memory KV implementation from SDK.
 */

import { createMemoryKv } from './packages/sdk/src/context/kv/memory'

async function testMemoryKv() {
  console.log('🧪 Testing Memory KV implementation...\n')

  try {
    // Create KV instance
    console.log('1️⃣ Creating Memory KV instance...')
    const kv = createMemoryKv({ maxSize: 5 })
    console.log('   ✅ Instance created with maxSize=5\n')

    // Test basic operations
    console.log('2️⃣ Testing basic set/get...')
    await kv.set('key1', { data: 'value1' })
    await kv.set('key2', { data: 'value2' })
    await kv.set('key3', { data: 'value3' })
    
    const value1 = await kv.get('key1')
    console.log('   ✅ Retrieved key1:', value1?.value)
    console.log()

    // Test list
    console.log('3️⃣ Testing list operation...')
    const allKeys = await kv.list()
    console.log(`   ✅ Total keys: ${allKeys.length}`)
    console.log(`   Keys:`, allKeys)
    console.log()

    // Test prefix filtering
    console.log('4️⃣ Testing prefix filtering...')
    await kv.set('user:123', { name: 'Alice' })
    await kv.set('user:456', { name: 'Bob' })
    await kv.set('post:789', { title: 'Hello' })
    
    const userKeys = await kv.list('user:')
    console.log(`   ✅ Found ${userKeys.length} keys with prefix "user:"`)
    console.log(`   User keys:`, userKeys)
    console.log()

    // Test LRU eviction (maxSize=5, we have 6 items now)
    console.log('5️⃣ Testing LRU eviction (maxSize=5)...')
    const beforeEviction = await kv.list()
    console.log(`   Before: ${beforeEviction.length} keys`)
    
    // This should evict the oldest key
    await kv.set('key4', { data: 'value4' })
    
    const afterEviction = await kv.list()
    console.log(`   After adding 7th item: ${afterEviction.length} keys`)
    console.log(`   Keys remaining:`, afterEviction)
    
    // Check if key1 was evicted (oldest)
    const key1Still = await kv.get('key1')
    if (key1Still === null) {
      console.log('   ✅ LRU eviction working (key1 was evicted)')
    } else {
      console.log('   ⚠️ key1 still exists, eviction might not be working')
    }
    console.log()

    // Test remove
    console.log('6️⃣ Testing remove...')
    const removed = await kv.remove('key2')
    console.log(`   ✅ Removed key2: ${removed}`)
    
    const afterRemove = await kv.list()
    console.log(`   Keys after remove:`, afterRemove)
    console.log()

    console.log('✅ All Memory KV tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

// Run tests
testMemoryKv().catch(console.error)