/**
 * getFileContent Tool
 *
 * Read a file from a GitHub repository.
 */

import { tool } from 'ai'
import { z } from 'zod'
import type { Octokit } from '@octokit/rest'

export interface GetFileContentToolOptions {
  octokit: Octokit
}

const inputSchema = z.object({
  owner: z.string().describe('Repository owner (user or organization)'),
  repo: z.string().describe('Repository name'),
  path: z.string().describe('File path within the repository'),
  ref: z.string().optional().describe('Branch, tag, or commit SHA (default: HEAD)'),
})

export function getFileContentTool(options: GetFileContentToolOptions) {
  const { octokit } = options

  return tool({
    description: 'Read a file from a GitHub repository',
    parameters: inputSchema,
    execute: async ({ owner, repo, path, ref }) => {
      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path,
          ref,
        })

        // Handle directory response
        if (Array.isArray(data)) {
          return { found: false, error: 'Path is a directory, not a file' }
        }

        if (data.type !== 'file' || !('content' in data)) {
          return { found: false, error: 'Not a file' }
        }

        // Decode base64 content
        const content = Buffer.from(data.content, 'base64').toString('utf-8')

        return {
          found: true,
          content,
          path: data.path,
          sha: data.sha,
        }
      } catch (error: unknown) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          error.status === 404
        ) {
          return { found: false, error: 'File not found' }
        }
        throw error
      }
    },
  })
}
