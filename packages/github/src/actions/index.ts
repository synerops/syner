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
  getIssue,
  listIssues,
  removeLabel,
  closeIssue,
  type CreateIssueOptions,
  type CreateIssueResult,
  type AddLabelsOptions,
  type GetIssueOptions,
  type IssueDetail,
  type ListIssuesOptions,
  type IssueSummary,
  type RemoveLabelOptions,
  type CloseIssueOptions,
} from './issues'
