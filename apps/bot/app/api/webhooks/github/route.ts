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

import { NextRequest, NextResponse } from 'next/server'
import type { Octokit } from '@octokit/rest'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import {
  verifyWebhookSignature,
  createThrottledOctokit,
  createComment,
  addReaction,
  createAllTools,
  type IssueEvent,
  type IssueCommentEvent,
  type PullRequestEvent,
} from '@syner/github'

const BOT_TRIGGER = '@synerbot'

interface WebhookContext {
  owner: string
  repo: string
  number: number
  body: string
  title: string
  isPullRequest: boolean
  commentId?: number
  sender: string
}

interface RepoContext {
  instructions?: string
  instructionsSource?: string
  changedFiles?: string[]
  conversationHistory?: Array<{ author: string; body: string }>
}

// =============================================================================
// Access Control
// =============================================================================

async function hasRepoAccess(
  octokit: Octokit,
  owner: string,
  repo: string,
  username: string
): Promise<boolean> {
  try {
    // Check user's permission level on the repo
    const { data } = await octokit.repos.getCollaboratorPermissionLevel({
      owner,
      repo,
      username,
    })
    // Allow admin, maintain, write, or triage (not just "read")
    const allowedPermissions = ['admin', 'maintain', 'write', 'triage']
    return allowedPermissions.includes(data.permission)
  } catch {
    // If permission check fails, check org membership as fallback
    try {
      await octokit.orgs.checkMembershipForUser({ org: owner, username })
      return true // Is org member
    } catch {
      return false
    }
  }
}

// =============================================================================
// Default Behaviors
// =============================================================================

async function loadRepoInstructions(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<{ content: string; source: string } | null> {
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
        body: c.body.slice(0, 500),
      }))
  } catch {
    return []
  }
}

async function loadContext(
  octokit: Octokit,
  ctx: WebhookContext
): Promise<RepoContext> {
  const context: RepoContext = {}

  const instructions = await loadRepoInstructions(octokit, ctx.owner, ctx.repo)
  if (instructions) {
    context.instructions = instructions.content
    context.instructionsSource = instructions.source
  }

  if (ctx.isPullRequest) {
    context.changedFiles = await loadPRChangedFiles(
      octokit,
      ctx.owner,
      ctx.repo,
      ctx.number
    )
  }

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
      sender: p.sender.login,
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
      sender: p.sender.login,
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
      sender: p.sender.login,
    }
  }

  return null
}

function buildSystemPrompt(ctx: WebhookContext, repoCtx: RepoContext): string {
  const sections: string[] = []

  sections.push(`You are @synerbot, responding to a ${ctx.isPullRequest ? 'pull request' : 'issue'} in ${ctx.owner}/${ctx.repo}.`)

  if (repoCtx.instructions) {
    sections.push(`## Repository Context (from ${repoCtx.instructionsSource})

${repoCtx.instructions}`)
  }

  sections.push(`## Current ${ctx.isPullRequest ? 'Pull Request' : 'Issue'}

**#${ctx.number}: ${ctx.title}**`)

  if (repoCtx.changedFiles && repoCtx.changedFiles.length > 0) {
    sections.push(`### Changed Files

${repoCtx.changedFiles.join('\n')}`)
  }

  if (repoCtx.conversationHistory && repoCtx.conversationHistory.length > 0) {
    const history = repoCtx.conversationHistory
      .slice(-5)
      .map((c) => `**@${c.author}**: ${c.body}`)
      .join('\n\n')
    sections.push(`### Recent Conversation

${history}`)
  }

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

// =============================================================================
// Route Handler
// =============================================================================

export const maxDuration = 60

export async function POST(request: NextRequest) {
  // Get raw body for signature verification
  const rawBody = await request.text()

  // Extract headers
  const signature = request.headers.get('x-hub-signature-256')
  const eventType = request.headers.get('x-github-event')
  const deliveryId = request.headers.get('x-github-delivery')

  if (!signature || !eventType || !deliveryId) {
    return NextResponse.json({ error: 'Missing required headers' }, { status: 400 })
  }

  // Verify signature
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (!secret) {
    console.error('GITHUB_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const isValid = verifyWebhookSignature({
    payload: rawBody,
    signature,
    secret,
  })

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Parse payload
  const payload = JSON.parse(rawBody) as IssueEvent | IssueCommentEvent | PullRequestEvent
  const ctx = extractContext(eventType, payload)

  if (!ctx) {
    return NextResponse.json({ skipped: true, reason: 'Event not handled' })
  }

  if (!ctx.body.includes(BOT_TRIGGER)) {
    return NextResponse.json({ skipped: true, reason: 'No bot mention' })
  }

  // Respond immediately to GitHub, process in background
  // Note: In Edge runtime or with streaming, we'd use waitUntil()
  // For Node.js runtime, we start async processing and return immediately

  const processWebhook = async () => {
    console.log('Starting webhook processing...')
    try {
      console.log('Creating Octokit client...')
      const octokit = createThrottledOctokit()

      // Check if sender has access
      console.log(`Checking access for ${ctx.sender}...`)
      const hasAccess = await hasRepoAccess(octokit, ctx.owner, ctx.repo, ctx.sender)
      if (!hasAccess) {
        console.log(`Access denied for ${ctx.sender}`)
        return
      }
      console.log(`Access granted for ${ctx.sender}`)

      // Add 👀 reaction to show we're working on it
      if (ctx.commentId) {
        console.log('Adding eyes reaction...')
        await addReaction({
          octokit,
          owner: ctx.owner,
          repo: ctx.repo,
          commentId: ctx.commentId,
          reaction: 'eyes',
        })
      }

      console.log('Loading context...')
      const repoCtx = await loadContext(octokit, ctx)
      const tools = createAllTools({ octokit })
      const userMessage = ctx.body.replace(BOT_TRIGGER, '').trim()

      console.log('Calling Claude...')
      const result = await generateText({
        model: anthropic('claude-3-5-sonnet-20241022'),
        system: buildSystemPrompt(ctx, repoCtx),
        prompt: userMessage,
        tools,
        maxSteps: 10,
      })

      // Post response as new comment
      console.log('Posting response...')
      await createComment({
        octokit,
        owner: ctx.owner,
        repo: ctx.repo,
        issueNumber: ctx.number,
        body: result.text,
      })
      console.log('Response posted successfully')
    } catch (error) {
      console.error('Error processing webhook:', error)
    }
  }

  // Process webhook - await to ensure completion
  console.log(`Processing webhook for ${ctx.owner}/${ctx.repo}#${ctx.number}`)

  await processWebhook()

  console.log(`Webhook completed for ${ctx.owner}/${ctx.repo}#${ctx.number}`)
  return NextResponse.json({ accepted: true, deliveryId })
}
