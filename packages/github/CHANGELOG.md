# @syner/github

## 0.1.1

### Patch Changes

- caa0db2: Fix repository URL format for npm trusted publishing

## 0.1.1

### Patch Changes

- d4202a1: Add webhook events, actions, and AI SDK tools for syner.bot

  - **events/**: Webhook signature verification (HMAC-SHA256) and event types
  - **actions/**: Comment operations (create, update, delete, reactions)
  - **tools/**: AI SDK tools for repo exploration
    - getFileContent
    - listDirectory
    - getRepoInfo
    - searchCode
    - createPullRequest
  - **octokit**: Add createThrottledOctokit() with rate limit handling

## 0.2.0

### Minor Changes

- 92ee83d: Initial release of @syner/github - GitHub App authentication utilities
