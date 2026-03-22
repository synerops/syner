import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    ANTHROPIC_API_KEY: z.string().min(1),
    GITHUB_APP_ID: z.string().min(1),
    GITHUB_APP_INSTALLATION_ID: z.string().min(1),
    GITHUB_APP_PRIVATE_KEY: z.string().min(1),
    GITHUB_WEBHOOK_SECRET: z.string().min(1),
    AI_GATEWAY_API_KEY: z.string().min(1).optional(),
    SLACK_BOT_TOKEN: z.string().startsWith('xoxb-').optional(),
    SLACK_SIGNING_SECRET: z.string().min(1).optional(),
    SANDBOX_REPO: z.string().url().optional(),
    SANDBOX_BRANCH: z.string().min(1).optional(),
  },
  client: {},
  runtimeEnv: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    GITHUB_APP_ID: process.env.GITHUB_APP_ID,
    GITHUB_APP_INSTALLATION_ID: process.env.GITHUB_APP_INSTALLATION_ID,
    GITHUB_APP_PRIVATE_KEY: process.env.GITHUB_APP_PRIVATE_KEY,
    GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET,
    AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
    SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
    SANDBOX_REPO: process.env.SANDBOX_REPO,
    SANDBOX_BRANCH: process.env.SANDBOX_BRANCH,
  },
  // Skip validation during build (vars available at runtime via Vercel)
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
