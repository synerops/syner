#!/usr/bin/env bun
/**
 * Build skills manifest + verify SkillLoader
 *
 * Usage: bun packages/vercel/skills/build-skill-manifest/scripts/run.ts
 *
 * 1. Scans skill directories with buildSkillsManifest
 * 2. Writes index.json to public/.well-known/skills/
 * 3. Verifies SkillLoader reads it correctly
 * 4. Tests has(), loadContent(), preprocessPrompt(), createPrepareStep()
 */

import { buildSkillsManifest } from '@syner/sdk/skills'
import { SkillLoader } from '@syner/vercel'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import path from 'path'

const ROOT = path.resolve(import.meta.dir, '../../../../..')

const SKILL_DIRS = [
  path.join(ROOT, 'skills/syner'),
  path.join(ROOT, 'apps/bot/skills'),
  path.join(ROOT, 'apps/dev/skills'),
  path.join(ROOT, 'apps/vaults/skills'),
  path.join(ROOT, 'packages/github/skills'),
]

const OUTPUT_DIR = path.join(ROOT, 'public/.well-known/skills')
const INDEX_PATH = path.join(OUTPUT_DIR, 'index.json')

// --- Step 1: Build manifest ---
console.log('--- Step 1: Build manifest ---')
console.log('Scanning:', SKILL_DIRS.filter(d => existsSync(d)).join('\n  '))

const manifest = await buildSkillsManifest(SKILL_DIRS)
console.log(`Found ${manifest.skills.length} skills:`)
for (const skill of manifest.skills) {
  console.log(`  - ${skill.name} (${skill.files.length} files): ${skill.description.slice(0, 80)}`)
}

if (manifest.skills.length === 0) {
  console.error('\nNo skills found. Check skill directories.')
  process.exit(1)
}

// --- Step 2: Write index.json ---
console.log('\n--- Step 2: Write index.json ---')
mkdirSync(OUTPUT_DIR, { recursive: true })
writeFileSync(INDEX_PATH, JSON.stringify(manifest, null, 2))
console.log(`Written to: ${INDEX_PATH}`)

// --- Step 3: Verify SkillLoader ---
console.log('\n--- Step 3: Verify SkillLoader ---')
const loader = new SkillLoader({
  indexPath: INDEX_PATH,
  skillDirs: SKILL_DIRS,
})

console.log(`Loader.names: [${loader.names.join(', ')}]`)

// Test has()
const firstName = manifest.skills[0].name
console.log(`\nhas("${firstName}"): ${loader.has(firstName)}`)
console.log(`has("nonexistent"): ${loader.has('nonexistent')}`)

// Test describeSkills()
const description = loader.describeSkills()
console.log(`\ndescribeSkills() (${description.length} chars):`)
console.log(description.split('\n').slice(0, 8).join('\n'))
if (description.split('\n').length > 8) console.log('  ...')

// --- Step 4: Test loadContent ---
console.log('\n--- Step 4: Test loadContent ---')
const content = loader.loadContent(firstName)
if (content) {
  console.log(`loadContent("${firstName}"): ${content.length} chars`)
  console.log(`First 200 chars:\n${content.slice(0, 200)}...`)
} else {
  console.error(`loadContent("${firstName}"): null — skill in index but not on disk!`)
}

console.log(`\nloadContent("nonexistent"): ${loader.loadContent('nonexistent')}`)

// --- Step 5: Test preprocessPrompt ---
console.log('\n--- Step 5: Test preprocessPrompt ---')
const plain = loader.preprocessPrompt('hello world')
console.log(`preprocessPrompt("hello world"): ${plain === 'hello world' ? 'PASS (unchanged)' : 'FAIL (modified)'}`)

const skillPrompt = loader.preprocessPrompt(`/${firstName} some args`)
const changed = skillPrompt !== `/${firstName} some args`
console.log(`preprocessPrompt("/${firstName} some args"): ${changed ? `PASS (${skillPrompt.length} chars)` : 'FAIL (unchanged)'}`)

const unknownPrompt = loader.preprocessPrompt('/nonexistent-skill test')
console.log(`preprocessPrompt("/nonexistent-skill test"): ${unknownPrompt === '/nonexistent-skill test' ? 'PASS (unchanged)' : 'FAIL (modified)'}`)

// --- Step 6: Test createPrepareStep ---
console.log('\n--- Step 6: Test createPrepareStep ---')
const prepareStep = loader.createPrepareStep()

// Simulate: no steps yet
const noSteps = prepareStep({ steps: [], messages: [], stepNumber: 0, model: null, experimental_context: undefined })
console.log(`No steps: ${JSON.stringify(noSteps) === '{}' ? 'PASS (empty)' : 'FAIL'}`)

// Simulate: step with Skill tool call
const withSkillCall = prepareStep({
  steps: [{
    toolCalls: [{
      toolName: 'Skill',
      toolCallId: 'call_123',
      args: { name: firstName },
    }],
  }],
  messages: [{ role: 'user', content: 'test' }],
  stepNumber: 1,
  model: null,
  experimental_context: undefined,
})

if (withSkillCall && 'messages' in withSkillCall) {
  const msgs = withSkillCall.messages as Array<{ role: string; content: unknown }>
  const hasToolResult = msgs.some(m => m.role === 'tool')
  const hasUserMessage = msgs.filter(m => m.role === 'user').length > 1
  console.log(`Skill call prepareStep:`)
  console.log(`  Has tool result: ${hasToolResult ? 'PASS' : 'FAIL'}`)
  console.log(`  Has injected user message: ${hasUserMessage ? 'PASS' : 'FAIL'}`)
  console.log(`  Total messages: ${msgs.length} (original 1 + tool result + user message = 3)`)
} else {
  console.error('Skill call prepareStep: FAIL (no messages returned)')
}

// Simulate: step with unknown skill
const withUnknown = prepareStep({
  steps: [{
    toolCalls: [{
      toolName: 'Skill',
      toolCallId: 'call_456',
      args: { name: 'nonexistent' },
    }],
  }],
  messages: [{ role: 'user', content: 'test' }],
  stepNumber: 1,
  model: null,
  experimental_context: undefined,
})

if (withUnknown && 'messages' in withUnknown) {
  const msgs = withUnknown.messages as Array<{ role: string; content: unknown }>
  const toolMsg = msgs.find(m => m.role === 'tool')
  const hasError = JSON.stringify(toolMsg).includes('not found in index')
  console.log(`Unknown skill prepareStep:`)
  console.log(`  Has error in tool result: ${hasError ? 'PASS' : 'FAIL'}`)
  console.log(`  No user message injected: ${msgs.filter(m => m.role === 'user').length === 1 ? 'PASS' : 'FAIL'}`)
}

console.log('\n--- Done ---')
