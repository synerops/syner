# Syner Developer Hub

## What is the Developer Hub?

The Developer Hub (syner.dev) is the central documentation and API gateway for Syner OS. It serves developers who want to build with the OS Protocol, providing documentation, GitHub integration, and developer tools.

The hub connects your GitHub repositories to Syner OS, enabling agents to access your codebase through authenticated APIs with intelligent caching.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- GitHub OAuth App credentials

### Installation

```bash
# From monorepo root
bun install

# Copy environment template
cp apps/dev/.env.example apps/dev/.env.local
```

### Environment Variables

```env
# GitHub OAuth (required for GitHub features)
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

### Development

```bash
# Run the dev hub
bunx turbo run dev --filter=dev
```

The app runs at `http://localhost:3002`.

## Features

- **Documentation** - Full OS Protocol and SDK documentation
- **GitHub OAuth** - Connect GitHub accounts for repo access
- **Content API** - Fetch repository files with ETag caching
- **LLM Export** - Full documentation export for AI assistants

## Learn More

- [OS Protocol](https://github.com/synerops/protocol) - The specification
- [GitHub App Setup](https://docs.github.com/en/apps/creating-github-apps) - Create OAuth credentials
