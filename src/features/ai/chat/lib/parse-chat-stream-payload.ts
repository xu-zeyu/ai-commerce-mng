const DONE_MARKERS = new Set(['[DONE]', 'DONE'])
const SUCCESS_CODES = new Set(['0', '200'])

export const CHAT_STREAM_DONE = Symbol('chat-stream-done')

export type ChatStreamPayload = string | null | typeof CHAT_STREAM_DONE

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getMessage(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value
  if (!isRecord(value)) return null

  for (const key of ['message', 'msg', 'detail']) {
    const message = value[key]
    if (typeof message === 'string' && message.trim()) return message
  }

  return null
}

function assertSuccessfulPayload(payload: Record<string, unknown>) {
  if (payload.success === false) {
    throw new Error(getMessage(payload) ?? 'AI 服务返回失败')
  }

  if ('code' in payload && !SUCCESS_CODES.has(String(payload.code))) {
    throw new Error(getMessage(payload) ?? `AI 服务返回错误（${String(payload.code)}）`)
  }

  if ('error' in payload && payload.error) {
    throw new Error(getMessage(payload.error) ?? getMessage(payload) ?? 'AI 服务返回错误')
  }
}

function getChoiceContent(choices: unknown): string | null {
  if (!Array.isArray(choices)) return null

  for (const choice of choices) {
    if (!isRecord(choice)) continue

    for (const source of [choice.delta, choice.message, choice]) {
      if (!isRecord(source)) continue
      if (typeof source.content === 'string') return source.content
      if (typeof source.text === 'string') return source.text
    }
  }

  return null
}

function unwrapPayload(value: unknown, depth = 0): string | null {
  if (depth > 4 || value === null || value === undefined) return null
  if (typeof value === 'string') {
    const normalized = value.trim()
    if (DONE_MARKERS.has(normalized)) return null

    if (normalized.startsWith('{') || normalized.startsWith('[')) {
      try {
        return unwrapPayload(JSON.parse(normalized) as unknown, depth + 1)
      } catch {
        return value
      }
    }

    return value
  }
  if (Array.isArray(value)) {
    const content = value
      .map((item) => unwrapPayload(item, depth + 1))
      .filter((item): item is string => item !== null)

    return content.length > 0 ? content.join('') : null
  }
  if (!isRecord(value)) return null

  assertSuccessfulPayload(value)

  const choiceContent = getChoiceContent(value.choices)
  if (choiceContent !== null) return choiceContent

  for (const key of ['content', 'text', 'answer', 'reply', 'output', 'response']) {
    if (typeof value[key] === 'string') return value[key]
  }

  for (const key of ['data', 'result']) {
    if (key in value) {
      const nested = unwrapPayload(value[key], depth + 1)
      if (nested !== null) return nested
    }
  }

  return null
}

export function parseChatStreamPayload(data: string): ChatStreamPayload {
  const normalized = data.trim()

  if (DONE_MARKERS.has(normalized)) return CHAT_STREAM_DONE
  if (!normalized) return data.length > 0 ? data : null

  try {
    const parsed = JSON.parse(normalized) as unknown
    if (typeof parsed === 'string' && DONE_MARKERS.has(parsed.trim())) {
      return CHAT_STREAM_DONE
    }
    return unwrapPayload(parsed)
  } catch (error) {
    if (error instanceof SyntaxError) return data
    throw error
  }
}
