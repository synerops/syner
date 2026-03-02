/**
 * GitHub Webhook Event Types
 *
 * Types for GitHub webhook payloads relevant to syner.bot
 */

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  type: 'User' | 'Bot' | 'Organization'
}

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  owner: GitHubUser
  private: boolean
  default_branch: string
}

export interface GitHubIssue {
  id: number
  number: number
  title: string
  body: string | null
  state: 'open' | 'closed'
  user: GitHubUser
  labels: Array<{ name: string }>
  html_url: string
}

export interface GitHubPullRequest {
  id: number
  number: number
  title: string
  body: string | null
  state: 'open' | 'closed' | 'merged'
  user: GitHubUser
  head: { ref: string; sha: string }
  base: { ref: string; sha: string }
  html_url: string
  draft: boolean
}

export interface GitHubComment {
  id: number
  body: string
  user: GitHubUser
  html_url: string
  created_at: string
  updated_at: string
}

/**
 * Issue event payload
 */
export interface IssueEvent {
  action: 'opened' | 'edited' | 'closed' | 'reopened' | 'labeled' | 'unlabeled'
  issue: GitHubIssue
  repository: GitHubRepository
  sender: GitHubUser
  installation?: { id: number }
}

/**
 * Issue comment event payload
 */
export interface IssueCommentEvent {
  action: 'created' | 'edited' | 'deleted'
  issue: GitHubIssue
  comment: GitHubComment
  repository: GitHubRepository
  sender: GitHubUser
  installation?: { id: number }
}

/**
 * Pull request event payload
 */
export interface PullRequestEvent {
  action:
    | 'opened'
    | 'edited'
    | 'closed'
    | 'reopened'
    | 'synchronize'
    | 'review_requested'
  pull_request: GitHubPullRequest
  repository: GitHubRepository
  sender: GitHubUser
  installation?: { id: number }
}

/**
 * Pull request review comment event payload
 */
export interface PullRequestReviewCommentEvent {
  action: 'created' | 'edited' | 'deleted'
  pull_request: GitHubPullRequest
  comment: GitHubComment
  repository: GitHubRepository
  sender: GitHubUser
  installation?: { id: number }
}

/**
 * Union of all supported webhook events
 */
export type WebhookEvent =
  | { type: 'issues'; payload: IssueEvent }
  | { type: 'issue_comment'; payload: IssueCommentEvent }
  | { type: 'pull_request'; payload: PullRequestEvent }
  | { type: 'pull_request_review_comment'; payload: PullRequestReviewCommentEvent }

/**
 * Parsed webhook context with common fields extracted
 */
export interface WebhookContext {
  /** Event type from X-GitHub-Event header */
  eventType: string
  /** Unique delivery ID from X-GitHub-Delivery header */
  deliveryId: string
  /** Repository owner */
  owner: string
  /** Repository name */
  repo: string
  /** Issue or PR number */
  number: number
  /** The body text that triggered this (issue body or comment body) */
  body: string
  /** User who triggered the event */
  sender: GitHubUser
  /** Installation ID for GitHub App */
  installationId?: number
  /** Whether this is a pull request (vs issue) */
  isPullRequest: boolean
  /** Comment ID if this was triggered by a comment */
  commentId?: number
}
