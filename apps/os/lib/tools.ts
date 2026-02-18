/**
 * Tools Integration
 *
 * Provides tools for the agent without SKILL.md discovery.
 * Just loads the necessary tools directly.
 */

import type { Tool } from 'ai'
import { createSandbox, writeFiles, readFile } from '@syner/vercel'

/**
 * Get all available tools for the agent
 */
export function getTools(): Record<string, Tool> {
  return {
    // Sandbox tools from @syner/vercel
    createSandbox: createSandbox({
      runtime: 'node22',
      timeout: 300000,
    }),
    writeFiles: writeFiles(),
    readFile: readFile(),
    
    // Add more tools here as needed
  }
}

/**
 * Get human-readable descriptions of available tools
 */
export function getToolDescriptions(): string {
  return `- sandbox: Vercel sandbox for code execution (createSandbox, writeFiles, readFile)`
}