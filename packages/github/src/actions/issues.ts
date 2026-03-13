/**
 * GitHub Issue Actions
 *
 * Create and manage issues with automatic label handling.
 */

import type { Octokit } from '@octokit/rest'

export interface CreateIssueOptions {
  octokit: Octokit
  owner: string
  repo: string
  title: string
  body: string
  labels?: string[]
  assignees?: string[]
}

export interface CreateIssueResult {
  id: number
  number: number
  url: string
  labelsApplied: string[]
  labelsSkipped: string[]
}

/**
 * Ensures labels exist in the repository, creating them if needed.
 *
 * @param octokit - Octokit instance
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param labels - Labels to ensure exist
 * @returns Object with applied and skipped labels
 */
async function ensureLabels(
  octokit: Octokit,
  owner: string,
  repo: string,
  labels: string[]
): Promise<{ applied: string[]; skipped: string[] }> {
  const applied: string[] = []
  const skipped: string[] = []

  for (const label of labels) {
    try {
      // Check if label exists
      await octokit.issues.getLabel({ owner, repo, name: label })
      applied.push(label)
    } catch (error) {
      // Label doesn't exist, try to create it
      try {
        await octokit.issues.createLabel({
          owner,
          repo,
          name: label,
          color: generateLabelColor(label),
          description: `Auto-created by syner.bot`,
        })
        applied.push(label)
      } catch {
        // Can't create label (no permission), skip it
        skipped.push(label)
      }
    }
  }

  return { applied, skipped }
}

/**
 * Generates a consistent color for a label based on its name.
 */
function generateLabelColor(label: string): string {
  const colors: Record<string, string> = {
    ideas: '6f42c1',      // purple
    automated: '0e8a16',  // green
    bug: 'd73a4a',        // red
    enhancement: 'a2eeef', // cyan
  }

  return colors[label.toLowerCase()] || 'ededed' // default gray
}

/**
 * Creates an issue with automatic label handling.
 *
 * If labels don't exist:
 * - Tries to create them (if app has permission)
 * - Skips them if creation fails (no error thrown)
 *
 * @param options - Issue options
 * @returns Issue details including which labels were applied/skipped
 *
 * @example
 * ```ts
 * const issue = await createIssue({
 *   octokit,
 *   owner: 'synerops',
 *   repo: 'syner',
 *   title: 'Weekly Ideas',
 *   body: 'Generated ideas...',
 *   labels: ['ideas', 'automated'],
 * })
 *
 * console.log(issue.url) // https://github.com/synerops/syner/issues/42
 * console.log(issue.labelsApplied) // ['ideas', 'automated']
 * console.log(issue.labelsSkipped) // []
 * ```
 */
export async function createIssue(options: CreateIssueOptions): Promise<CreateIssueResult> {
  const { octokit, owner, repo, title, body, labels = [], assignees = [] } = options

  // Ensure labels exist before creating issue
  const { applied, skipped } = labels.length > 0
    ? await ensureLabels(octokit, owner, repo, labels)
    : { applied: [], skipped: [] }

  // Create issue with only the labels that exist/were created
  const { data } = await octokit.issues.create({
    owner,
    repo,
    title,
    body,
    labels: applied,
    assignees,
  })

  return {
    id: data.id,
    number: data.number,
    url: data.html_url,
    labelsApplied: applied,
    labelsSkipped: skipped,
  }
}

export interface AddLabelsOptions {
  octokit: Octokit
  owner: string
  repo: string
  issueNumber: number
  labels: string[]
}

/**
 * Adds labels to an existing issue, creating them if needed.
 *
 * @param options - Options
 * @returns Labels that were applied and skipped
 */
export async function addLabels(options: AddLabelsOptions): Promise<{ applied: string[]; skipped: string[] }> {
  const { octokit, owner, repo, issueNumber, labels } = options

  const { applied, skipped } = await ensureLabels(octokit, owner, repo, labels)

  if (applied.length > 0) {
    await octokit.issues.addLabels({
      owner,
      repo,
      issue_number: issueNumber,
      labels: applied,
    })
  }

  return { applied, skipped }
}

// --- Get Issue ---

export interface GetIssueOptions {
  octokit: Octokit
  owner: string
  repo: string
  issueNumber: number
}

export interface IssueDetail {
  id: number
  number: number
  title: string
  body: string
  state: string
  labels: string[]
  assignees: string[]
  url: string
  createdAt: string
  updatedAt: string
}

/**
 * Fetches a single issue with body, labels, state, title, and assignees.
 *
 * @param options - Get issue options
 * @returns Issue details
 *
 * @example
 * ```ts
 * const issue = await getIssue({
 *   octokit,
 *   owner: 'synerops',
 *   repo: 'syner',
 *   issueNumber: 471,
 * })
 *
 * console.log(issue.title) // 'Add missing CRUD ops'
 * console.log(issue.labels) // ['vision-2026']
 * ```
 */
export async function getIssue(options: GetIssueOptions): Promise<IssueDetail> {
  const { octokit, owner, repo, issueNumber } = options

  const { data } = await octokit.issues.get({
    owner,
    repo,
    issue_number: issueNumber,
  })

  return {
    id: data.id,
    number: data.number,
    title: data.title,
    body: data.body ?? '',
    state: data.state,
    labels: data.labels.map((l) => (typeof l === 'string' ? l : l.name ?? '')),
    assignees: (data.assignees ?? []).map((a) => a.login),
    url: data.html_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

// --- List Issues ---

export interface ListIssuesOptions {
  octokit: Octokit
  owner: string
  repo: string
  labels?: string[]
  state?: 'open' | 'closed' | 'all'
  assignee?: string
}

export interface IssueSummary {
  number: number
  title: string
  state: string
  labels: string[]
}

/**
 * Lists issues with optional filters.
 *
 * @param options - List issues options
 * @returns Array of issue summaries
 *
 * @example
 * ```ts
 * const issues = await listIssues({
 *   octokit,
 *   owner: 'synerops',
 *   repo: 'syner',
 *   labels: ['vision-2026'],
 *   state: 'open',
 * })
 * ```
 */
export async function listIssues(options: ListIssuesOptions): Promise<IssueSummary[]> {
  const { octokit, owner, repo, labels, state = 'open', assignee } = options

  const { data } = await octokit.issues.listForRepo({
    owner,
    repo,
    labels: labels?.join(','),
    state,
    assignee,
    per_page: 100,
  })

  return data.map((issue) => ({
    number: issue.number,
    title: issue.title,
    state: issue.state,
    labels: issue.labels.map((l) => (typeof l === 'string' ? l : l.name ?? '')),
  }))
}

// --- Remove Label ---

export interface RemoveLabelOptions {
  octokit: Octokit
  owner: string
  repo: string
  issueNumber: number
  label: string
}

/**
 * Removes a single label from an issue.
 *
 * @param options - Remove label options
 *
 * @example
 * ```ts
 * await removeLabel({
 *   octokit,
 *   owner: 'synerops',
 *   repo: 'syner',
 *   issueNumber: 471,
 *   label: 'in-progress',
 * })
 * ```
 */
export async function removeLabel(options: RemoveLabelOptions): Promise<void> {
  const { octokit, owner, repo, issueNumber, label } = options

  await octokit.issues.removeLabel({
    owner,
    repo,
    issue_number: issueNumber,
    name: label,
  })
}

// --- Close Issue ---

export interface CloseIssueOptions {
  octokit: Octokit
  owner: string
  repo: string
  issueNumber: number
  reason?: 'completed' | 'not_planned'
}

/**
 * Closes an issue with optional reason.
 *
 * @param options - Close issue options
 *
 * @example
 * ```ts
 * await closeIssue({
 *   octokit,
 *   owner: 'synerops',
 *   repo: 'syner',
 *   issueNumber: 471,
 *   reason: 'completed',
 * })
 * ```
 */
export async function closeIssue(options: CloseIssueOptions): Promise<void> {
  const { octokit, owner, repo, issueNumber, reason = 'completed' } = options

  await octokit.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    state: 'closed',
    state_reason: reason,
  })
}
