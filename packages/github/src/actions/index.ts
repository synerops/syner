/**
 * GitHub Actions Module
 *
 * Outbound operations for GitHub (comments, reactions, issues, etc.)
 */

export {
  createComment,
  updateComment,
  deleteComment,
  addReaction,
  readThread,
  type CreateCommentOptions,
  type UpdateCommentOptions,
  type DeleteCommentOptions,
  type AddReactionOptions,
  type Comment,
  type ReadThreadOptions,
} from './comments'

export {
  createIssue,
  addLabels,
  type CreateIssueOptions,
  type CreateIssueResult,
  type AddLabelsOptions,
} from './issues'
