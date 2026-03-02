/**
 * GitHub Tools
 *
 * AI SDK tools for GitHub repository operations.
 */

export { getFileContentTool, type GetFileContentToolOptions } from './getFileContent'
export { listDirectoryTool, type ListDirectoryToolOptions } from './listDirectory'
export { getRepoInfoTool, type GetRepoInfoToolOptions } from './getRepoInfo'
export { searchCodeTool, type SearchCodeToolOptions } from './searchCode'
export { createPullRequestTool, type CreatePullRequestToolOptions } from './createPullRequest'

import type { Octokit } from '@octokit/rest'
import { getFileContentTool } from './getFileContent'
import { listDirectoryTool } from './listDirectory'
import { getRepoInfoTool } from './getRepoInfo'
import { searchCodeTool } from './searchCode'
import { createPullRequestTool } from './createPullRequest'

export interface CreateAllToolsOptions {
  octokit: Octokit
}

/**
 * Creates all GitHub tools with a single Octokit instance.
 *
 * @param options - Options with Octokit instance
 * @returns Object with all tools
 *
 * @example
 * ```ts
 * const tools = createAllTools({ octokit })
 * const result = await generateText({
 *   model: anthropic('claude-sonnet-4-20250514'),
 *   tools,
 *   prompt: 'Read the README.md file from synerops/syner',
 * })
 * ```
 */
export function createAllTools(options: CreateAllToolsOptions) {
  const { octokit } = options

  return {
    getFileContent: getFileContentTool({ octokit }),
    listDirectory: listDirectoryTool({ octokit }),
    getRepoInfo: getRepoInfoTool({ octokit }),
    searchCode: searchCodeTool({ octokit }),
    createPullRequest: createPullRequestTool({ octokit }),
  }
}
