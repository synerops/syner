#!/usr/bin/env bun
/**
 * Syner CLI - Interactive REPL
 *
 * Usage:
 *   bun run syner              # Interactive mode
 *   echo "prompt" | bun run syner  # One-shot mode
 */

import { createInterface } from 'readline'
import { syner } from './src'

const isTTY = process.stdin.isTTY

async function oneShot() {
  const input = (await Bun.stdin.text()).trim()
  if (!input) {
    console.error('Usage: echo "prompt" | bun run syner')
    process.exit(1)
  }

  const result = await syner.ask(input)
  console.log(result.text)
}

async function repl() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'syner> ',
  })

  console.log('Syner OS - Orchestrator Agent')
  console.log('Type "exit" to quit\n')

  rl.prompt()

  rl.on('line', async (line) => {
    const input = line.trim()

    if (!input) {
      rl.prompt()
      return
    }

    if (input === 'exit' || input === 'quit') {
      console.log('Bye!')
      process.exit(0)
    }

    try {
      const result = await syner.ask(input)
      console.log('\n' + result.text + '\n')
    } catch (err: any) {
      console.error('Error:', err.message)
    }

    rl.prompt()
  })

  rl.on('close', () => {
    console.log('\nBye!')
    process.exit(0)
  })
}

if (isTTY) {
  repl()
} else {
  oneShot()
}
