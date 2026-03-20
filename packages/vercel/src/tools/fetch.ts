import { z } from 'zod'

const MAX_CHARS = 50000 // ~12-15k tokens

export const fetchInputSchema = z.object({
  url: z.string().describe('URL to fetch'),
})

export type FetchInput = z.infer<typeof fetchInputSchema>

export async function executeFetch({ url }: FetchInput): Promise<string> {
  const response = await fetch(url, {
    headers: { Accept: 'text/markdown, text/plain, text/html' },
  })

  if (!response.ok) {
    return `Error: ${response.status} ${response.statusText}`
  }

  const text = await response.text()
  if (text.length > MAX_CHARS) {
    return text.slice(0, MAX_CHARS) + `\n\n[Truncated: ${text.length - MAX_CHARS} chars omitted]`
  }
  return text
}
