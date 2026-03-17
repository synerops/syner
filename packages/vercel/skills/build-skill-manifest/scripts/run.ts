#!/usr/bin/env bun
/**
 * Build skills manifest + per-skill content files
 *
 * Usage: bun packages/vercel/skills/build-skill-manifest/scripts/run.ts
 *
 * Progressive disclosure (agentskills.io):
 * 1. index.json — metadata at startup (~100 tokens per skill)
 * 2. {name}.json — full content on activation (<5000 tokens)
 */

import { buildSkillsManifest, buildSkillContent } from '@syner/sdk/skills'
import { loadSkills } from '../../../src/skills/loader'
import { SkillsMap } from '../../../src/skills'
import { createSkillTool, createPrepareStep } from '../../../src/tools/skill'
import { loadSkillContent } from '../../../src/skills/loader'
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
  const extras = [
    skill.command ? `cmd=${skill.command}` : '',
    skill.agent ? `agent=${skill.agent}` : '',
  ].filter(Boolean).join(' ')
  console.log(`  - ${skill.name} (${skill.files.length} files)${extras ? ` [${extras}]` : ''}: ${skill.description.slice(0, 80)}`)
}

if (manifest.skills.length === 0) {
  console.error('\nNo skills found. Check skill directories.')
  process.exit(1)
}

// --- Step 2: Write index.json + per-skill content files ---
console.log('\n--- Step 2: Write index.json + per-skill content files ---')
mkdirSync(OUTPUT_DIR, { recursive: true })
writeFileSync(INDEX_PATH, JSON.stringify(manifest, null, 2))
console.log(`Index: ${INDEX_PATH}`)

let contentCount = 0
for (const skill of manifest.skills) {
  const content = await buildSkillContent(SKILL_DIRS, skill)
  if (content) {
    const skillPath = path.join(OUTPUT_DIR, `${skill.name}.json`)
    writeFileSync(skillPath, JSON.stringify(content, null, 2))
    contentCount++
  }
}
console.log(`Content files: ${contentCount}/${manifest.skills.length} written`)

// --- Step 3: Verify loadSkills ---
console.log('\n--- Step 3: Verify loadSkills ---')
const skills = await loadSkills(INDEX_PATH)

console.log(`SkillsMap size: ${skills.size}`)
const firstName = manifest.skills[0].name
console.log(`has("${firstName}"): ${skills.has(firstName)}`)
console.log(`has("nonexistent"): ${skills.has('nonexistent')}`)

// Test describe()
const description = skills.describe()
console.log(`\ndescribe() (${description.length} chars):`)
console.log(description.split('\n').slice(0, 8).join('\n'))
if (description.split('\n').length > 8) console.log('  ...')

// Test commands()
const commands = skills.commands()
console.log(`\ncommands(): ${commands.size} commands`)
for (const [name, info] of commands) {
  console.log(`  /${name} → ${info.skillName} (agent: ${info.agent})`)
}

// --- Step 4: Test loadSkillContent ---
console.log('\n--- Step 4: Test loadSkillContent ---')
const content = await loadSkillContent(OUTPUT_DIR, firstName)
if (content) {
  console.log(`loadSkillContent("${firstName}"): ${content.length} chars`)
  console.log(`First 200 chars:\n${content.slice(0, 200)}...`)
} else {
  console.error(`loadSkillContent("${firstName}"): null — content file missing!`)
}

// Security: path traversal rejected
const traversal = await loadSkillContent(OUTPUT_DIR, '../../etc/passwd')
console.log(`loadSkillContent("../../etc/passwd"): ${traversal === null ? 'PASS (rejected)' : 'FAIL (should be null)'}`)

console.log(`\nloadSkillContent("nonexistent"): ${await loadSkillContent(OUTPUT_DIR, 'nonexistent')}`)

// --- Step 5: Test createPrepareStep ---
console.log('\n--- Step 5: Test createPrepareStep ---')
const prepareStepFn = createPrepareStep(skills, OUTPUT_DIR)

const noSteps = await prepareStepFn({ steps: [], messages: [], stepNumber: 0, model: null, experimental_context: undefined })
console.log(`No steps: ${JSON.stringify(noSteps) === '{}' ? 'PASS (empty)' : 'FAIL'}`)

const withSkillCall = await prepareStepFn({
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
  const userMessages = msgs.filter(m => m.role === 'user')
  const injectedContent = userMessages.length > 1
  const lastUser = userMessages[userMessages.length - 1]
  const hasSkillXml = typeof lastUser?.content === 'string' && lastUser.content.includes('<skill-instructions')
  console.log(`Skill call prepareStep:`)
  console.log(`  Injected user message: ${injectedContent ? 'PASS' : 'FAIL'}`)
  console.log(`  Content is XML-wrapped skill: ${hasSkillXml ? 'PASS' : 'FAIL'}`)
  console.log(`  Total messages: ${msgs.length} (original 1 + skill user message = 2)`)
} else {
  console.error('Skill call prepareStep: FAIL (no messages returned)')
}

const withUnknown = await prepareStepFn({
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

const unknownIsEmpty = !withUnknown || JSON.stringify(withUnknown) === '{}'
console.log(`Unknown skill prepareStep: ${unknownIsEmpty ? 'PASS (no injection, empty return)' : 'FAIL'}`)

console.log('\n--- Done ---')
