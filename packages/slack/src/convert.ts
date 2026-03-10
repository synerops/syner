import { markdownToSlack } from 'md-to-slack'

/**
 * Convert standard markdown to Slack's mrkdwn format
 *
 * Slack uses a custom markdown dialect called mrkdwn that differs from
 * standard markdown. This function handles the conversion.
 *
 * Key differences:
 * - Bold: **text** → *text*
 * - Italic: *text* or _text_ → _text_
 * - Strikethrough: ~~text~~ → ~text~
 * - Links: [text](url) → <url|text>
 * - Code blocks: ```lang\ncode``` → ```code```
 */
export function convertMarkdown(text: string): string {
  if (!text) return text
  return markdownToSlack(text)
}
