import { tool } from 'ai'
import { Sandbox } from '@vercel/sandbox'
import { z } from 'zod'

export const editInputSchema = z.object({
  file_path: z.string().describe('Absolute path to the file to edit'),
  old_string: z.string().describe('The exact text to find and replace'),
  new_string: z.string().describe('The replacement text'),
  replace_all: z.boolean().optional().default(false).describe('Replace all occurrences (default: false)'),
})

export type EditInput = z.infer<typeof editInputSchema>

/**
 * Execute edit with a provided sandbox (for session reuse)
 */
export async function executeEditWithSandbox(
  sandbox: Sandbox,
  { file_path, old_string, new_string, replace_all }: EditInput
): Promise<string> {
  // Read the file first
  const readResult = await sandbox.runCommand('cat', [file_path])
  const readStderr = await readResult.stderr()
  if (readResult.exitCode !== 0) {
    return `Error reading file: ${readStderr}`
  }

  const content = await readResult.stdout()

  // Check that old_string exists in the file
  if (!content.includes(old_string)) {
    return `Error: old_string not found in ${file_path}`
  }

  // Check uniqueness when not replacing all
  if (!replace_all) {
    const occurrences = content.split(old_string).length - 1
    if (occurrences > 1) {
      return `Error: old_string appears ${occurrences} times in ${file_path}. Use replace_all or provide more context to make it unique.`
    }
  }

  // Perform the replacement
  const newContent = replace_all
    ? content.split(old_string).join(new_string)
    : content.replace(old_string, new_string)

  // Write back using heredoc
  const cmd = `cat <<'SYNER_EOF' > '${file_path}'
${newContent}
SYNER_EOF`

  const writeResult = await sandbox.runCommand('sh', ['-c', cmd])
  const writeStderr = await writeResult.stderr()
  return writeResult.exitCode === 0 ? `Edited ${file_path}` : `Error: ${writeStderr}`
}

/**
 * Execute edit with a new ephemeral sandbox (standalone use)
 */
export async function executeEdit(input: EditInput): Promise<string> {
  const sandbox = await Sandbox.create({ runtime: 'node24', timeout: 60000 })
  try {
    return await executeEditWithSandbox(sandbox, input)
  } finally {
    await sandbox.stop()
  }
}

/**
 * Standalone Edit tool (creates its own sandbox)
 */
export const Edit = tool({
  description: 'Edit a file by replacing exact string matches',
  inputSchema: editInputSchema,
  execute: executeEdit,
})

/**
 * Create an Edit tool that uses a shared sandbox
 */
export function createEditTool(sandbox: Sandbox) {
  return tool({
    description: 'Edit a file by replacing exact string matches',
    inputSchema: editInputSchema,
    execute: (input) => executeEditWithSandbox(sandbox, input),
  })
}
