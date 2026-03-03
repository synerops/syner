/**
 * GitHub Events Module
 *
 * Webhook verification and event type definitions.
 */

export { verifyWebhookSignature, extractWebhookHeaders, type VerifyWebhookOptions } from './verify'

export type {
  GitHubUser,
  GitHubRepository,
  GitHubIssue,
  GitHubPullRequest,
  GitHubComment,
  IssueEvent,
  IssueCommentEvent,
  PullRequestEvent,
  PullRequestReviewCommentEvent,
  WebhookEvent,
  WebhookContext,
} from './types'
