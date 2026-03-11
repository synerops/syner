# @syner/github

github integration for syner agents. auth, tools, actions, and webhooks in one package.

## what it does

- **auth**: generate short-lived tokens from GitHub App (no PATs to leak)
- **tools**: AI SDK tools so agents can read repos, search code, create PRs
- **actions**: programmatic issue/comment/reaction creation
- **events**: webhook signature verification and typed event handling

## how it fits

```
agent prompt
    ↓
┌─────────────────────────────────────────────┐
│               @syner/github                 │
├─────────────┬─────────────┬─────────────────┤
│    auth     │    tools    │    actions      │
│  (tokens)   │  (AI SDK)   │  (outbound)     │
└──────┬──────┴──────┬──────┴────────┬────────┘
       │             │               │
       ▼             ▼               ▼
   gh CLI      generateText()   octokit.rest
```

## cli

authenticate `gh` CLI for any subsequent commands:

```bash
bunx @syner/github create-app-token | gh auth login --with-token
```

## tools (for agents)

give your AI agent GitHub superpowers:

```typescript
import { createAllTools, createOctokit } from "@syner/github"
import { generateText } from "ai"

const octokit = createOctokit()
const tools = createAllTools({ octokit })

await generateText({
  model: anthropic("claude-sonnet-4-20250514"),
  tools,
  prompt: "Read the README from synerops/syner and summarize it",
})
```

available tools:
- `getFileContent` - read files from any repo
- `listDirectory` - browse repo structure
- `getRepoInfo` - get repo metadata
- `searchCode` - search across repos
- `createPullRequest` - create PRs programmatically

## actions (outbound operations)

create issues, comments, reactions directly:

```typescript
import { createIssue, createComment, addReaction } from "@syner/github/actions"

await createIssue({ owner, repo, title, body })
await createComment({ owner, repo, issue_number, body })
await addReaction({ owner, repo, comment_id, content: "+1" })
```

## events (webhook handling)

verify and type GitHub webhooks:

```typescript
import { verifyWebhookSignature, type IssueEvent } from "@syner/github/events"

const isValid = verifyWebhookSignature(body, signature, secret)
const event: IssueEvent = JSON.parse(body)
```

## plan mode

See `.syner/plans/README.md` for plan structure. Each plan lives in `.syner/plans/{id}-{slug}/README.md` with 3 sections: What/How, Definition of Done, Deliveries.

## setup

| variable | required | description |
|----------|----------|-------------|
| `GITHUB_APP_ID` | yes | your GitHub App ID |
| `GITHUB_APP_INSTALLATION_ID` | yes | installation ID for target org |
| `GITHUB_APP_PRIVATE_KEY` | one of | PEM key contents |
| `GITHUB_APP_PEM_PATH` | these | path to PEM file |

## skill

- `/syner-gh-auth` - authenticate gh CLI before GitHub operations

## why github app auth

- no stored tokens - generated on demand, expire fast
- fine-grained - only permissions the app has
- audit trail - actions attributed to app, not user
- higher rate limits - 5000 req/hour vs 60 for unauthenticated
