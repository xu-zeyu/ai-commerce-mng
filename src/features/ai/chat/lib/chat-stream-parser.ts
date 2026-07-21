import {
  CHAT_STREAM_DONE,
  parseChatStreamPayload,
} from './parse-chat-stream-payload'

export type StreamMode = 'json' | 'sse' | 'text'

export interface StreamReadContext {
  decoder: TextDecoder
  initialBuffer: string
  reader: ReadableStreamDefaultReader<Uint8Array>
}

export interface ParsedChunk {
  done: boolean
  value: string | null
}

const SSE_FIELDS = ['data:', 'event:', 'id:', 'retry:'] as const

export function assertHasContent(content: string) {
  if (!content.trim()) throw new Error('AI 接口没有返回可显示内容')
}

export function mergeStreamContent(content: string, chunk: string): string {
  if (!chunk || chunk === content) return content
  if (chunk.startsWith(content)) return chunk
  return content + chunk
}

export function parseChunk(
  data: string,
  eventType: string | null = null,
): ParsedChunk {
  const payload = parseChatStreamPayload(data)

  if (payload === CHAT_STREAM_DONE) return { done: true, value: null }
  if (eventType === 'error') {
    throw new Error(payload || 'AI 服务流式响应出错')
  }

  return { done: false, value: payload }
}

export function detectStreamMode(
  buffer: string,
  contentType: string,
  streamEnded: boolean,
): StreamMode | null {
  if (contentType.includes('text/event-stream')) return 'sse'

  const value = buffer.trimStart().replace(/^\uFEFF/, '')
  if (!value) return streamEnded ? 'text' : null

  if (SSE_FIELDS.some((field) => value.startsWith(field)) || value.startsWith(':')) {
    return 'sse'
  }
  if (!streamEnded && SSE_FIELDS.some((field) => field.startsWith(value))) {
    return null
  }

  const isJsonContent = contentType.includes('json')
    || contentType.includes('application/x-ndjson')
  if (isJsonContent) {
    return /^[{["\d\-tfn]/.test(value) ? 'json' : 'text'
  }

  return 'text'
}

export function takeLine(
  buffer: string,
): { line: string; rest: string } | null {
  const boundary = buffer.match(/\r\n|\n|\r/)
  if (!boundary || boundary.index === undefined) return null

  return {
    line: buffer.slice(0, boundary.index),
    rest: buffer.slice(boundary.index + boundary[0].length),
  }
}

export function findJsonValueEnd(value: string): number | null {
  const first = value[0]
  if (first !== '{' && first !== '[' && first !== '"') return null

  let escaped = false
  let inString = first === '"'
  const stack: string[] = first === '{' ? ['}'] : first === '[' ? [']'] : []

  for (let index = 1; index < value.length; index += 1) {
    const character = value[index]

    if (inString) {
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === '"') {
        inString = false
        if (stack.length === 0) return index + 1
      }
      continue
    }

    if (character === '"') inString = true
    else if (character === '{') stack.push('}')
    else if (character === '[') stack.push(']')
    else if (character === stack.at(-1)) {
      stack.pop()
      if (stack.length === 0) return index + 1
    }
  }

  return null
}
