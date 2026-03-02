/**
 * GitHub Webhook Handler
 *
 * Receives GitHub webhook events and responds using Claude.
 * Triggered by @synerbot mentions in issues and PRs.
 *
 * Default behaviors:
 * - Always: Load repo context (CLAUDE.md → README.md)
 * - If PR: Include changed files list
 * - If has comments: Include conversation history
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Octokit } from '@octokit/rest'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import {
  verifyWebhookSignature,
  extractWebhookHeaders,
  createThrottledOctokit,
  createComment,
  updateComment,
  createAllTools,
  type IssueEvent,
  type IssueCommentEvent,
  type PullRequestEvent,
} from '@syner/github'

const BOT_TRIGGER = '@synerbot'
const THINKING_MESSAGE = '...'

interface WebhookContext {
  owner: string
  repo: string
  number: number
  body: string
  title: string
  isPullRequest: boolean
  commentId?: number
}

interface RepoContext {
  /** CLAUDE.md or README.md content */
  instructions?: string
  /** Source file (CLAUDE.md or README.md) */
  instructionsSource?: string
  /** PR changed files */
  changedFiles?: string[]
  /** Previous comments in the thread */
  conversationHistory?: Array<{ author: string; body: string }>
}

// =============================================================================
// Default Behaviors
// =============================================================================

/**
 * DEFAULT: Load repo context (CLAUDE.md first, fallback to README.md)
 */
async function loadRepoInstructions(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<{ content: string; source: string } | null> {
  // Try CLAUDE.md first (project-specific instructions)
  for (const path of ['CLAUDE.md', 'README.md']) {
    try {
      const { data } = await octokit.repos.getContent({ owner, repo, path })
      if (!Array.isArray(data) && data.type === 'file' && 'content' in data) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8')
        return { content, source: path }
      }
    } catch {
      // File doesn't exist, try next
    }
  }
  return null
}

/**
 * DEFAULT (if PR): Load changed files list
 */
async function loadPRChangedFiles(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<string[]> {
  try {
    const { data } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: pullNumber,
      per_page: 50,
    })
    return data.map((f: { status: string; filename: string }) => `${f.status}: ${f.filename}`)
  } catch {
    return []
  }
}

/**
 * DEFAULT (if has comments): Load conversation history
 */
async function loadConversationHistory(
  octokit: Octokit,
  owner: string,
  repo: string,
  issueNumber: number
): Promise<Array<{ author: string; body: string }>> {
  try {
    const { data } = await octokit.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber,
      per_page: 20,
    })
    type Comment = { body?: string | null; user?: { login: string } | null }
    return (data as Comment[])
      .filter((c): c is Comment & { body: string; user: { login: string } } =>
        Boolean(c.body && c.user)
      )
      .map((c) => ({
        author: c.user.login,
        body: c.body.slice(0, 500), // Truncate long comments
      }))
  } catch {
    return []
  }
}

/**
 * Load all context based on situation (default behaviors)
 */
async function loadContext(
  octokit: Octokit,
  ctx: WebhookContext
): Promise<RepoContext> {
  const context: RepoContext = {}

  // Always: Load repo instructions
  const instructions = await loadRepoInstructions(octokit, ctx.owner, ctx.repo)
  if (instructions) {
    context.instructions = instructions.content
    context.instructionsSource = instructions.source
  }

  // If PR: Load changed files
  if (ctx.isPullRequest) {
    context.changedFiles = await loadPRChangedFiles(
      octokit,
      ctx.owner,
      ctx.repo,
      ctx.number
    )
  }

  // If triggered by comment (not new issue/PR): Load history
  if (ctx.commentId) {
    context.conversationHistory = await loadConversationHistory(
      octokit,
      ctx.owner,
      ctx.repo,
      ctx.number
    )
  }

  return context
}

// =============================================================================
// Webhook Processing
// =============================================================================

/**
 * Extracts context from webhook payload.
 */
function extractContext(
  eventType: string,
  payload: IssueEvent | IssueCommentEvent | PullRequestEvent
): WebhookContext | null {
  const owner = payload.repository.owner.login
  const repo = payload.repository.name

  if (eventType === 'issue_comment') {
    const p = payload as IssueCommentEvent
    if (p.action !== 'created') return null

    return {
      owner,
      repo,
      number: p.issue.number,
      title: p.issue.title,
      body: p.comment.body,
      isPullRequest: 'pull_request' in p.issue,
      commentId: p.comment.id,
    }
  }

  if (eventType === 'issues') {
    const p = payload as IssueEvent
    if (p.action !== 'opened') return null
    if (!p.issue.body) return null

    return {
      owner,
      repo,
      number: p.issue.number,
      title: p.issue.title,
      body: p.issue.body,
      isPullRequest: false,
    }
  }

  if (eventType === 'pull_request') {
    const p = payload as PullRequestEvent
    if (p.action !== 'opened') return null
    if (!p.pull_request.body) return null

    return {
      owner,
      repo,
      number: p.pull_request.number,
      title: p.pull_request.title,
      body: p.pull_request.body,
      isPullRequest: true,
    }
  }

  return null
}

/**
 * Builds the system prompt with loaded context.
 */
function buildSystemPrompt(ctx: WebhookContext, repoCtx: RepoContext): string {
  const sections: string[] = []

  // Identity
  sections.push(`You are @synerbot, responding to a ${ctx.isPullRequest ? 'pull request' : 'issue'} in ${ctx.owner}/${ctx.repo}.`)

  // Repo instructions (from CLAUDE.md or README.md)
  if (repoCtx.instructions) {
    sections.push(`## Repository Context (from ${repoCtx.instructionsSource})

${repoCtx.instructions}`)
  }

  // Current issue/PR info
  sections.push(`## Current ${ctx.isPullRequest ? 'Pull Request' : 'Issue'}

**#${ctx.number}: ${ctx.title}**`)

  // PR changed files
  if (repoCtx.changedFiles && repoCtx.changedFiles.length > 0) {
    sections.push(`### Changed Files

${repoCtx.changedFiles.join('\n')}`)
  }

  // Conversation history
  if (repoCtx.conversationHistory && repoCtx.conversationHistory.length > 0) {
    const history = repoCtx.conversationHistory
      .slice(-5) // Last 5 comments
      .map((c) => `**@${c.author}**: ${c.body}`)
      .join('\n\n')
    sections.push(`### Recent Conversation

${history}`)
  }

  // Tools and guidelines
  sections.push(`## Tools Available

- getRepoInfo: Get repository metadata
- listDirectory: List files in a directory
- getFileContent: Read file contents
- searchCode: Search for code
- createPullRequest: Create a pull request

## Guidelines

- Be concise and direct
- Use tools to gather context before answering
- Format responses in GitHub-flavored markdown
- Keep responses focused on the question`)

  return sections.join('\n\n')
}

/**
 * Main webhook handler.
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Only accept POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // Get raw body for signature verification
  const rawBody = JSON.stringify(req.body)

  // Extract headers
  const headers = extractWebhookHeaders(req.headers as Record<string, string>)
  const { signature, event: eventType, deliveryId } = headers

  if (!signature || !eventType || !deliveryId) {
    res.status(400).json({ error: 'Missing required headers' })
    return
  }

  // Verify signature
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (!secret) {
    console.error('GITHUB_WEBHOOK_SECRET not configured')
    res.status(500).json({ error: 'Server configuration error' })
    return
  }

  const isValid = verifyWebhookSignature({
    payload: rawBody,
    signature,
    secret,
  })

  if (!isValid) {
    res.status(401).json({ error: 'Invalid signature' })
    return
  }

  // Parse payload and extract context
  const payload = req.body as IssueEvent | IssueCommentEvent | PullRequestEvent
  const ctx = extractContext(eventType, payload)

  if (!ctx) {
    // Event type or action we don't handle
    res.status(200).json({ skipped: true, reason: 'Event not handled' })
    return
  }

  // Check for bot trigger
  if (!ctx.body.includes(BOT_TRIGGER)) {
    res.status(200).json({ skipped: true, reason: 'No bot mention' })
    return
  }

  // Respond immediately to GitHub
  res.status(200).json({ accepted: true, deliveryId })

  // Process asynchronously
  try {
    const octokit = createThrottledOctokit()

    // Post thinking comment
    const thinkingCommentId = await createComment({
      octokit,
      owner: ctx.owner,
      repo: ctx.repo,
      issueNumber: ctx.number,
      body: THINKING_MESSAGE,
    })

    // Load context (default behaviors)
    const repoCtx = await loadContext(octokit, ctx)

    // Create tools
    const tools = createAllTools({ octokit })

    // Extract the actual question (remove bot trigger)
    const userMessage = ctx.body.replace(BOT_TRIGGER, '').trim()

    // Run Claude with full context
    const result = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: buildSystemPrompt(ctx, repoCtx),
      prompt: userMessage,
      tools,
      maxSteps: 10,
    })

    // Update comment with response
    await updateComment({
      octokit,
      owner: ctx.owner,
      repo: ctx.repo,
      commentId: thinkingCommentId,
      body: result.text,
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    // Can't respond to GitHub anymore, just log
  }
}
