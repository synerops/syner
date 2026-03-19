/**
 * GitHub Comment Actions
 *
 * Create and update comments on issues and pull requests.
 */

import type { Octokit } from '@octokit/rest'

export interface CreateCommentOptions {
  octokit: Octokit
  owner: string
  repo: string
  issueNumber: number
  body: string
}

/**
 * Creates a comment on an issue or pull request.
 *
 * @param options - Comment options
 * @returns The created comment ID
 *
 * @example
 * ```ts
 * const commentId = await createComment({
 *   octokit,
 *   owner: 'synerops',
 *   repo: 'syner',
 *   issueNumber: 42,
 *   body: 'Hello from syner.bot!',
 * })
 * ```
 */
export async function createComment(options: CreateCommentOptions): Promise<number> {
  const { octokit, owner, repo, issueNumber, body } = options

  const { data } = await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body,
  })

  return data.id
}

export interface UpdateCommentOptions {
  octokit: Octokit
  owner: string
  repo: string
  commentId: number
  body: string
}

/**
 * Updates an existing comment.
 *
 * @param options - Update options
 *
 * @example
 * ```ts
 * await updateComment({
 *   octokit,
 *   owner: 'synerops',
 *   repo: 'syner',
 *   commentId: 123456,
 *   body: 'Updated response from syner.bot',
 * })
 * ```
 */
export async function updateComment(options: UpdateCommentOptions): Promise<void> {
  const { octokit, owner, repo, commentId, body } = options

  await octokit.issues.updateComment({
    owner,
    repo,
    comment_id: commentId,
    body,
  })
}

export interface DeleteCommentOptions {
  octokit: Octokit
  owner: string
  repo: string
  commentId: number
}

/**
 * Deletes a comment.
 *
 * @param options - Delete options
 */
export async function deleteComment(options: DeleteCommentOptions): Promise<void> {
  const { octokit, owner, repo, commentId } = options

  await octokit.issues.deleteComment({
    owner,
    repo,
    comment_id: commentId,
  })
}

export interface AddReactionOptions {
  octokit: Octokit
  owner: string
  repo: string
  commentId: number
  reaction: '+1' | '-1' | 'laugh' | 'confused' | 'heart' | 'hooray' | 'rocket' | 'eyes'
}

/**
 * Adds a reaction to a comment.
 *
 * @param options - Reaction options
 */
export async function addReaction(options: AddReactionOptions): Promise<void> {
  const { octokit, owner, repo, commentId, reaction } = options

  await octokit.reactions.createForIssueComment({
    owner,
    repo,
    comment_id: commentId,
    content: reaction,
  })
}

export interface Comment {
  id: number
  author: string
  body: string
  createdAt: string
  updatedAt: string
  isBot: boolean
}

export interface ReadThreadOptions {
  octokit: Octokit
  owner: string
  repo: string
  issueNumber: number
  /** Max comments to return (default: all) */
  limit?: number
}

/**
 * Reads all comments on an issue or pull request with auto-pagination.
 *
 * @param options - Read thread options
 * @returns Array of comments sorted by createdAt ascending
 */
export async function readThread(options: ReadThreadOptions): Promise<Comment[]> {
  const { octokit, owner, repo, issueNumber, limit } = options

  const responses = await octokit.paginate(octokit.issues.listComments, {
    owner,
    repo,
    issue_number: issueNumber,
    per_page: 100,
  })

  const comments: Comment[] = responses.map((c) => ({
    id: c.id,
    author: c.user?.login ?? 'unknown',
    body: c.body ?? '',
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    isBot: c.user?.type === 'Bot',
  }))

  comments.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

  if (limit && limit > 0) {
    return comments.slice(0, limit)
  }

  return comments
}
