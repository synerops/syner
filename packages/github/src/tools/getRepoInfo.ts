/**
 * getRepoInfo Tool
 *
 * Get repository metadata (description, language, default branch).
 */

import { tool } from 'ai'
import { z } from 'zod'
import type { Octokit } from '@octokit/rest'

export interface GetRepoInfoToolOptions {
  octokit: Octokit
}

const inputSchema = z.object({
  owner: z.string().describe('Repository owner (user or organization)'),
  repo: z.string().describe('Repository name'),
})

export function getRepoInfoTool(options: GetRepoInfoToolOptions) {
  const { octokit } = options

  return tool({
    description: 'Get repository metadata (description, language, default branch, topics)',
    inputSchema,
    execute: async ({ owner, repo }) => {
      try {
        const { data } = await octokit.repos.get({ owner, repo })
        return {
          name: data.name,
          fullName: data.full_name,
          description: data.description,
          language: data.language,
          defaultBranch: data.default_branch,
          private: data.private,
          topics: data.topics,
          stargazersCount: data.stargazers_count,
          forksCount: data.forks_count,
        }
      } catch (error: unknown) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          error.status === 404
        ) {
          return { error: 'Repository not found' }
        }
        throw error
      }
    },
  })
}
