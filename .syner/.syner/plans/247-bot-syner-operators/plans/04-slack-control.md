# Plan 05: Slack como control remoto del OS

## Objetivo

Usar Slack como interfaz para operar el OS via syner.md — leer planes, crear observaciones, consultar estado. Thin client que llama a syner.md, no coding agent.

## Estado actual

El Slack handler (`apps/bot/app/api/commands/slack/route.ts`) usa:
- `createSession()` → clona repo en Vercel Sandbox
- Filesystem tools (Bash, Read, Write, Glob, Grep)
- `ToolLoopAgent` con max 10 steps

Es un coding agent. Necesita reescribirse.

## Estado deseado

```
Slack message
  → apps/bot Slack handler
    → LLM con tools que llaman a syner.md
      → fetch('https://syner.md/synerops/...')
    → Respond in Slack
```

Sin sandbox. Sin clone. Tools son wrappers HTTP a syner.md.

## Cómo

### Paso 1: Crear tools sobre syner.md

```typescript
// apps/bot/lib/os-tools.ts
import { tool } from 'ai'
import { z } from 'zod'

const SYNER_URL = process.env.SYNER_URL || 'https://syner.md'
const SYNER_TOKEN = process.env.SYNER_TOKEN

async function osFetch(path: string, opts?: RequestInit) {
  return fetch(`${SYNER_URL}/synerops/${path}`, {
    ...opts,
    headers: {
      'Accept': 'text/plain',
      'Authorization': `Bearer ${SYNER_TOKEN}`,
      ...opts?.headers,
    },
  })
}

export const readTool = tool({
  description: 'Read a file from the OS',
  parameters: z.object({ path: z.string() }),
  execute: async ({ path }) => {
    const res = await osFetch(path)
    return res.ok ? await res.text() : null
  },
})

export const globTool = tool({
  description: 'Find files matching a pattern',
  parameters: z.object({ pattern: z.string() }),
  execute: async ({ pattern }) => {
    const res = await osFetch(`?glob=${encodeURIComponent(pattern)}`)
    return res.json()
  },
})

export const grepTool = tool({
  description: 'Search content across files',
  parameters: z.object({
    query: z.string(),
    glob: z.string().optional(),
  }),
  execute: async ({ query, glob }) => {
    const params = new URLSearchParams({ grep: query })
    if (glob) params.set('glob', glob)
    const res = await osFetch(`?${params}`)
    return res.json()
  },
})

export const writeTool = tool({
  description: 'Write a file to the OS',
  parameters: z.object({
    path: z.string(),
    content: z.string(),
    message: z.string().optional(),
  }),
  execute: async ({ path, content, message }) => {
    await osFetch(path, {
      method: 'PUT',
      body: content,
      headers: {
        'Content-Type': 'text/plain',
        'x-commit-message': message || `update: ${path}`,
      },
    })
    return { ok: true }
  },
})
```

### Paso 2: Reescribir Slack handler

```typescript
const tools = { read: readTool, glob: globTool, grep: grepTool, write: writeTool }

const result = await generateText({
  model: anthropic('claude-sonnet-4-20250514'),
  system: `You are the operator of the Syner OS.
You can read plans, create observations, search vaults, and report status.
You cannot modify code, create PRs, or access external systems.`,
  prompt: userMessage,
  tools,
  maxSteps: 10,
})
```

### Paso 3: Eliminar sandbox dependency

El Slack handler deja de usar `createSession()` y Vercel Sandbox.

## Definición de Done

- [ ] Slack handler reescrito — tools llaman a syner.md, no sandbox
- [ ] Tools: read, glob, grep, write funcionan via syner.md
- [ ] System prompt refleja rol de operador
- [ ] Sin Vercel Sandbox para Slack commands
- [ ] Respuestas en < 5s
- [ ] Funciona desde Slack en teléfono

## Riesgos

- **syner.md dependency**: Si syner.md está caído, Slack no funciona. Mitigación: error handling graceful, Vercel uptime es alto.
- **Token management**: El bot necesita un token para autenticarse contra syner.md. Mitigación: shared secret como env var en ambos apps.
