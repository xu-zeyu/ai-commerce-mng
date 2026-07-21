import { API_BASE_URL } from '@/services/env'
import { readChatResponseStream } from '../lib/read-chat-response-stream'
import type { SendChatMessageRequest } from '../types'

interface StreamChatMessageOptions {
  signal: AbortSignal
  token: string | null
}

function createChatUrl(): URL {
  return new URL(`${API_BASE_URL}/ai/chat`, window.location.origin)
}

async function getErrorMessage(response: Response): Promise<string> {
  const fallback = `请求失败（${response.status}）`
  const body = await response.text().catch(() => '')

  if (!body) return fallback

  try {
    const data: unknown = JSON.parse(body)

    if (data && typeof data === 'object') {
      if ('message' in data && typeof data.message === 'string') {
        return data.message
      }
      if ('msg' in data && typeof data.msg === 'string') {
        return data.msg
      }
    }
  } catch {
    const contentType = response.headers.get('content-type') ?? ''
    return contentType.includes('text/html') ? fallback : body
  }

  return fallback
}

export async function* streamChatMessage(
  request: SendChatMessageRequest,
  { signal, token }: StreamChatMessageOptions,
): AsyncGenerator<string, void, void> {
  const response = await fetch(createChatUrl(), {
    method: 'POST',
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(request),
    cache: 'no-store',
    signal,
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  yield* readChatResponseStream(response)
}
