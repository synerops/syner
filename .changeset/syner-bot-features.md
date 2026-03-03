---
"@syner/github": minor
---

Add webhook events, actions, and AI SDK tools for syner.bot

- **events/**: Webhook signature verification (HMAC-SHA256) and event types
- **actions/**: Comment operations (create, update, delete, reactions)
- **tools/**: AI SDK tools for repo exploration
  - getFileContent
  - listDirectory
  - getRepoInfo
  - searchCode
  - createPullRequest
- **octokit**: Add createThrottledOctokit() with rate limit handling
