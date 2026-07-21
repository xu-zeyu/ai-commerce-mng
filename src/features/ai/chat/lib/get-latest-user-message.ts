import type { ThreadMessage } from '@assistant-ui/react'

export function getLatestUserMessage(messages: readonly ThreadMessage[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]

    if (message.role !== 'user') continue

    const text = message.content
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n')
      .trim()

    if (text) return text
  }

  throw new Error('没有可发送的用户消息')
}
