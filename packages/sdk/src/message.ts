export type Message = {
  id: string
  role: 'user' | 'agent' | 'system'
  content: string
  metadata?: Record<string, unknown>
}
