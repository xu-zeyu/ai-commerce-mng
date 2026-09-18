import type { ThreadMessage } from '@assistant-ui/react'
import { contentCreationSchema, type ContentCreationValues } from '../schemas/content-creation-schema'

export function getLatestContentRequest(messages: readonly ThreadMessage[]): ContentCreationValues {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]
    if (message.role !== 'user') continue

    const text = message.content
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('')

    try {
      return contentCreationSchema.parse(JSON.parse(text))
    } catch {
      throw new Error('创作参数格式不正确，请重新填写创作设置')
    }
  }

  throw new Error('没有找到创作设置')
}

export function parseContentRequestMessage(text: string): ContentCreationValues | null {
  try {
    const result = contentCreationSchema.safeParse(JSON.parse(text))
    return result.success ? result.data : null
  } catch {
    return null
  }
}
