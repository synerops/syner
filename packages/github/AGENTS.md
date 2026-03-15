# @syner/github

### Exports reference

#### Auth and Octokit (`@syner/github/octokit`)

```ts
function getToken(): Promise<string>
function clearTokenCache(): void
function isTokenValid(): boolean
function getTokenStatus(): { cached: boolean; expiresIn?: number }
function createOctokit(): Octokit
function createThrottledOctokit(callbacks?: ThrottlingCallbacks): Octokit

interface ThrottlingCallbacks {
  onRateLimit?: (retryAfter: number, retryCount: number) => void
  onSecondaryRateLimit?: (retryAfter: number) => void
}
```

#### Actions (`@syner/github/actions`)

**Comments:**

```ts
function createComment(options: CreateCommentOptions): Promise<number>
function updateComment(options: UpdateCommentOptions): Promise<void>
function deleteComment(options: DeleteCommentOptions): Promise<void>
function addReaction(options: AddReactionOptions): Promise<void>
function readThread(options: ReadThreadOptions): Promise<Comment[]>

interface CreateCommentOptions {
  octokit: Octokit
  owner: string
  repo: string
  issueNumber: number
  body: string
}

interface UpdateCommentOptions {
  octokit: Octokit
  owner: string
  repo: string
  commentId: number
  body: string
}

interface DeleteCommentOptions {
  octokit: Octokit
  owner: string
  repo: string
  commentId: number
}

interface AddReactionOptions {
  octokit: Octokit
  owner: string
  repo: string
  commentId: number
  reaction: '+1' | '-1' | 'laugh' | 'confused' | 'heart' | 'hooray' | 'rocket' | 'eyes'
}

interface ReadThreadOptions {
  octokit: Octokit
  owner: string
  repo: string
  issueNumber: number
  limit?: number
}

interface Comment {
  id: number
  author: string
  body: string
  createdAt: string
  updatedAt: string
  isBot: boolean
}
```

**Issues:**

```ts
function createIssue(options: CreateIssueOptions): Promise<CreateIssueResult>
function getIssue(options: GetIssueOptions): Promise<IssueDetail>
function listIssues(options: ListIssuesOptions): Promise<IssueSummary[]>
function closeIssue(options: CloseIssueOptions): Promise<void>
function addLabels(options: AddLabelsOptions): Promise<{ applied: string[]; skipped: string[] }>
function removeLabel(options: RemoveLabelOptions): Promise<void>

interface CreateIssueOptions {
  octokit: Octokit
  owner: string
  repo: string
  title: string
  body: string
  labels?: string[]
  assignees?: string[]
}

interface CreateIssueResult {
  id: number
  number: number
  url: string
  labelsApplied: string[]
  labelsSkipped: string[]
}

interface GetIssueOptions {
  octokit: Octokit
  owner: string
  repo: string
  issueNumber: number
}

interface IssueDetail {
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

interface ListIssuesOptions {
  octokit: Octokit
  owner: string
  repo: string
  labels?: string[]
  state?: 'open' | 'closed' | 'all'
  assignee?: string
}

interface IssueSummary {
  number: number
  title: string
  state: string
  labels: string[]
}

interface AddLabelsOptions {
  octokit: Octokit
  owner: string
  repo: string
  issueNumber: number
  labels: string[]
}

interface RemoveLabelOptions {
  octokit: Octokit
  owner: string
  repo: string
  issueNumber: number
  label: string
}

interface CloseIssueOptions {
  octokit: Octokit
  owner: string
  repo: string
  issueNumber: number
  reason?: 'completed' | 'not_planned'
}
```

#### Events (`@syner/github/events`)

```ts
function verifyWebhookSignature(options: VerifyWebhookOptions): boolean
function extractWebhookHeaders(headers: Headers | Record<string, string | undefined>): {
  signature: string | undefined
  event: string | undefined
  deliveryId: string | undefined
}

interface VerifyWebhookOptions {
  payload: string
  signature: string
  secret: string
}

// Webhook payload types
interface IssueEvent {
  action: 'opened' | 'edited' | 'closed' | 'reopened' | 'labeled' | 'unlabeled'
  issue: GitHubIssue
  repository: GitHubRepository
  sender: GitHubUser
  installation?: { id: number }
}

interface IssueCommentEvent {
  action: 'created' | 'edited' | 'deleted'
  issue: GitHubIssue
  comment: GitHubComment
  repository: GitHubRepository
  sender: GitHubUser
  installation?: { id: number }
}

interface PullRequestEvent {
  action: 'opened' | 'edited' | 'closed' | 'reopened' | 'synchronize' | 'review_requested'
  pull_request: GitHubPullRequest
  repository: GitHubRepository
  sender: GitHubUser
  installation?: { id: number }
}

interface PullRequestReviewCommentEvent {
  action: 'created' | 'edited' | 'deleted'
  pull_request: GitHubPullRequest
  comment: GitHubComment
  repository: GitHubRepository
  sender: GitHubUser
  installation?: { id: number }
}

type WebhookEvent =
  | { type: 'issues'; payload: IssueEvent }
  | { type: 'issue_comment'; payload: IssueCommentEvent }
  | { type: 'pull_request'; payload: PullRequestEvent }
  | { type: 'pull_request_review_comment'; payload: PullRequestReviewCommentEvent }

interface WebhookContext {
  eventType: string
  deliveryId: string
  owner: string
  repo: string
  number: number
  body: string
  sender: GitHubUser
  installationId?: number
  isPullRequest: boolean
  commentId?: number
}
```

#### Tools (`@syner/github/tools`)

Five Vercel AI SDK tools, each created via a factory that takes `{ octokit: Octokit }`:

```ts
function getFileContentTool(options: { octokit: Octokit }): Tool
function listDirectoryTool(options: { octokit: Octokit }): Tool
function getRepoInfoTool(options: { octokit: Octokit }): Tool
function searchCodeTool(options: { octokit: Octokit }): Tool
function createPullRequestTool(options: { octokit: Octokit }): Tool

// Bundle all tools at once:
function createAllTools(options: { octokit: Octokit }): {
  getFileContent: Tool
  listDirectory: Tool
  getRepoInfo: Tool
  searchCode: Tool
  createPullRequest: Tool
}
```

**Tool input schemas:**

| Tool | Parameters | Returns |
|---|---|---|
| `getFileContent` | `owner`, `repo`, `path`, `ref?` | `{ found, content, path, sha }` or `{ found: false, error }` |
| `listDirectory` | `owner`, `repo`, `path?`, `ref?` | `{ items: [{ name, type, path }] }` |
| `getRepoInfo` | `owner`, `repo` | `{ name, fullName, description, language, defaultBranch, private, topics, stargazersCount, forksCount }` |
| `searchCode` | `query`, `owner`, `repo` | `{ totalCount, items: [{ path, name }] }` |
| `createPullRequest` | `owner`, `repo`, `title`, `body`, `head`, `base`, `draft?` | `{ number, url, state }` |

Usage with Vercel AI SDK:

```ts
import { createAllTools } from '@syner/github/tools'
import { createOctokit } from '@syner/github/octokit'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

const tools = createAllTools({ octokit: createOctokit() })

const result = await generateText({
  model: anthropic('claude-sonnet-4-20250514'),
  tools,
  prompt: 'Read the README.md from synerops/syner',
})
```

### Error handling

| HTTP status | From | Meaning |
|---|---|---|
| 401 | Any API call | Token expired or invalid App credentials |
| 403 | Actions or tools | App lacks required permission for this operation |
| 404 | `getFileContent`, `removeLabel`, `getIssue` | Resource not found |
| 422 | `createPullRequest`, `searchCode` | Validation failed (branch missing, PR exists, bad query) |
| 429 | Any API call | Rate limited (handled automatically by `createThrottledOctokit`) |

### Constraints

1. **Every function requires an Octokit instance.** Use `createOctokit()` or `createThrottledOctokit()` to get one. Do not construct `new Octokit()` directly -- auth wiring will be wrong.

2. **Do not cache Octokit across long-lived processes.** Tokens expire after 60 minutes (cache is 55 min). For short executions, one instance is fine. For long-running agents, call `createOctokit()` fresh or check `isTokenValid()`.

3. **Do not assume labels exist.** `createIssue` and `addLabels` auto-create missing labels. `removeLabel` throws 404 if the label is not on the issue.

4. **Always verify webhook signatures.** Call `verifyWebhookSignature()` before processing any payload. Do not roll your own HMAC check.

5. **Use declared subpath exports only.** Import from `@syner/github`, `@syner/github/octokit`, `@syner/github/actions`, `@syner/github/events`, or `@syner/github/tools`. Do not import from internal file paths.

6. **Do not call `getToken()` to pass tokens to Octokit.** `getToken()` is for CLI use (`create-app-token` command). For API calls, use `createOctokit()` which handles auth internally.

7. **Do not add retry logic on top of `createThrottledOctokit`.** It retries primary rate limits up to 2 times and always retries secondary limits. Additional retries will compound.

8. **Pass `owner` and `repo` as separate strings.** Every action and tool takes them separately. Do not pass `"synerops/syner"` as a combined slug.

### Status

| Area | Status |
|---|---|
| Token lifecycle (`getToken`, cache, dedup) | Production |
| Octokit factories (standard + throttled) | Production |
| Comment actions (create, update, delete, reaction, readThread) | Production |
| Issue actions (create, get, list, close, addLabels, removeLabel) | Production |
| Webhook verification (HMAC-SHA256, timing-safe) | Production |
| Webhook event types (4 event types + union + context) | Production |
| AI SDK tools (5 tools + createAllTools) | Production |
| CLI (`create-app-token`) | Production |
| Event dispatching/routing | Not implemented (types only) |
| PR review actions | Not implemented |
| File write / branch operations | Not implemented |

