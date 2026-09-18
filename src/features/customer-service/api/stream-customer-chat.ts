import { useAuthStore } from '@/stores/use-auth-store'
import type { CustomerChatRequest } from '../types'

const CUSTOMER_CHAT_URL = '/api/sse/chat'

function extractText(value: unknown): string {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return ''

  const record = value as Record<string, unknown>
  const choices = Array.isArray(record.choices) ? record.choices : []
  const firstChoice = choices[0]
  if (firstChoice && typeof firstChoice === 'object') {
    const choice = firstChoice as Record<string, unknown>
    return extractText(choice.delta) || extractText(choice.message) || extractText(choice.text)
  }

  for (const key of ['content', 'answer', 'text', 'delta', 'message', 'data']) {
    const text = extractText(record[key])
    if (text) return text
  }
  return ''
}

function parsePayload(payload: string): string {
  if (!payload || payload === '[DONE]') return ''
  try {
    const data: unknown = JSON.parse(payload)
    if (data && typeof data === 'object' && 'error' in data) {
      const error = (data as { error?: unknown }).error
      throw new Error(extractText(error) || '客服回复生成失败')
    }
    return extractText(data)
  } catch (error) {
    if (error instanceof SyntaxError) return payload
    throw error
  }
}

async function getErrorMessage(response: Response): Promise<string> {
  const body = await response.text().catch(() => '')
  if (!body) return `客服服务请求失败（${response.status}）`
  try {
    const data = JSON.parse(body) as { detail?: string; message?: string; msg?: string }
    return data.detail || data.message || data.msg || body
  } catch {
    return body
  }
}

async function* readSseStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
): AsyncGenerator<string> {
  const decoder = new TextDecoder()
  let buffer = ''
  let dataLines: string[] = []

  const flushEvent = () => {
    const text = parsePayload(dataLines.join('\n'))
    dataLines = []
    return text
  }

  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value, { stream: !done })
    const lines = buffer.split(/\r\n|\r|\n/)
    const trailingLine = lines.pop() ?? ''
    buffer = done ? '' : trailingLine

    for (const line of lines) {
      if (line === '') {
        const text = flushEvent()
        if (text) yield text
      } else if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).replace(/^ /, ''))
      }
    }

    if (!done) continue
    if (trailingLine.startsWith('data:')) dataLines.push(trailingLine.slice(5).replace(/^ /, ''))
    else if (trailingLine) dataLines.push(trailingLine)
    const text = flushEvent()
    if (text) yield text
    return
  }
}

async function* readTextStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
): AsyncGenerator<string> {
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    const text = decoder.decode(value, { stream: !done })
    if (text) yield text
    if (done) return
  }
}

export async function* streamCustomerChat(
  input: CustomerChatRequest,
  signal: AbortSignal,
): AsyncGenerator<string> {
  const token = useAuthStore.getState().token
  const headers: Record<string, string> = {
    Accept: 'text/event-stream',
    'Content-Type': 'application/json',
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(CUSTOMER_CHAT_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
    cache: 'no-store',
    credentials: 'include',
    signal,
  })

  if (!response.ok) throw new Error(await getErrorMessage(response))
  if (!response.body) throw new Error('客服服务未返回可读取的内容流')

  const reader = response.body.getReader()
  const isSse = response.headers.get('content-type')?.includes('text/event-stream')
  try {
    if (isSse) yield* readSseStream(reader)
    else yield* readTextStream(reader)
  } finally {
    reader.releaseLock()
  }
}
