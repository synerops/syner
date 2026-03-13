# Adoption Path — Next.js Apps

Date: 2026-03-12

## The Opportunity

Millions of Next.js apps already deployed on Vercel. They already have Functions, the runtime, the infra. They don't need to migrate. They need to **add a layer**.

## The Pitch

For someone who already has a Next.js app on Vercel, joining syner is adding a dependency and a file.

```bash
npm install @syner/dev
```

Create a `SKILL.md` at the root of your project describing what your app does. In your `next.config`, register the endpoint:

```js
// next.config.js
import { withSyner } from '@syner/dev'

export default withSyner({
  // your normal Next.js config
})
```

That exposes `your-app.vercel.app/agent/` with your SKILL.md and the endpoints you defined. Your app keeps working exactly as before. You just gained an endpoint that makes you discoverable and consumable by other agents.

If you want to go further, add route handlers that follow osprotocol:

```
app/agent/route.ts → receives context, executes action, returns verification
```

Done. Your Next.js app is now an agent skill in the ecosystem. You didn't migrate anything. You didn't rewrite anything. You added a layer on top.

## The Ladder

| Step | What you do | What you become | Time |
|---|---|---|---|
| **1** | `npm install @syner/dev` + SKILL.md | Skill agent — discoverable, invocable | 5 minutes |
| **2** | Add Queues to communicate with other agents | Tool agent — composes skills, has state | Hours |
| **3** | Your app collaborates with other agents as a peer | App agent — full citizen | Days |

Each step adds, never replaces. Like adding Stripe doesn't force you to rewrite your frontend.

## The Pattern

This follows every successful developer platform adoption:

| Before | What they added | Result |
|---|---|---|
| Static website | `<script src="stripe.js">` + `/api/checkout` | Any site accepts payments |
| Next.js app | `next-auth` + config file | Any app has auth |
| Code repo | `.github/workflows/ci.yml` | Any repo has CI |
| Any server | `/.well-known/openid-configuration` | Any server is an identity provider |
| **Next.js app** | **`@syner/dev` + SKILL.md** | **Any app is an agent** |

## Why It Works

- BYOK already solved — they're on Vercel, they have their account, their billing, their infra
- No new hosting, no new platform, no migration
- `withSyner()` wraps their existing config — zero-breaking-change integration
- SKILL.md is just a markdown file — no new language, no new format
- osprotocol is the contract; syner.dev is the npm package that implements it
- Discovery is URLs — your-app.vercel.app/agent/ is your agent's address

## syner.dev's Role

syner.dev as SDK is exactly this: the npm package that makes it possible.

- `@syner/dev` — the package
- `withSyner()` — the Next.js integration
- `app/agent/route.ts` — the convention
- SKILL.md — the contract
- osprotocol — the standard underneath

## What This Means for the Stack

| App | Role in adoption |
|---|---|
| osprotocol | The standard that `app/agent/route.ts` follows |
| syner.dev | The `npm install` that makes it easy |
| syner.md | Optional — if the user wants context engineering for their agents |
| syner.bot | Optional — if the user wants conversational interface |
| syner.design | Optional — if the user wants visual coherence |
| syner.app | Optional — if the user wants the dashboard |

Only osprotocol and syner.dev are required. Everything else is opt-in. The minimum viable syner is: a Next.js app + `@syner/dev` + SKILL.md.
