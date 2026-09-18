import { AGENT_SEE_URL } from '@/services/env'
import type { AgentStreamPacket } from '../types'

async function getErrorMessage(response: Response) {
  const body = await response.text().catch(() => '')
  return body.trim() || `Agent 流连接失败（${response.status}）`
}

async function* readTextStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder,
): AsyncGenerator<AgentStreamPacket> {
  while (true) {
    const result = await reader.read()
    const data = decoder.decode(result.value, { stream: !result.done })
    if (data) yield { data, eventType: 'message' }
    if (result.done) return
  }
}

async function* readSseStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder,
): AsyncGenerator<AgentStreamPacket> {
  let buffer = ''
  let eventType = 'message'
  let dataLines: string[] = []

  while (true) {
    const result = await reader.read()
    buffer += decoder.decode(result.value, { stream: !result.done })
    const lines = buffer.split(/\r\n|\r|\n/)
    const trailing = lines.pop() ?? ''
    buffer = result.done ? '' : trailing

    for (const line of lines) {
      if (!line) {
        if (dataLines.length > 0) {
          yield { data: dataLines.join('\n'), eventType }
          dataLines = []
          eventType = 'message'
        }
        continue
      }
      if (line.startsWith(':')) continue
      if (line.startsWith('event:')) eventType = line.slice(6).trim() || 'message'
      if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart())
    }

    if (!result.done) continue
    if (trailing) dataLines.push(trailing.startsWith('data:') ? trailing.slice(5).trimStart() : trailing)
    if (dataLines.length > 0) yield { data: dataLines.join('\n'), eventType }
    return
  }
}

export async function* openAgentStream(
  signal: AbortSignal,
): AsyncGenerator<AgentStreamPacket> {
  const response = await fetch(AGENT_SEE_URL, {
    method: 'GET',
    headers: { Accept: 'text/event-stream' },
    cache: 'no-store',
    signal,
  })

  if (!response.ok) throw new Error(await getErrorMessage(response))
  if (!response.body) throw new Error('浏览器未收到可读取的 Agent 响应流')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  const isSse = response.headers.get('content-type')?.includes('text/event-stream')

  try {
    if (isSse) yield* readSseStream(reader, decoder)
    else yield* readTextStream(reader, decoder)
  } finally {
    reader.releaseLock()
  }
}
