import {
  assertHasContent,
  detectStreamMode,
  findJsonValueEnd,
  mergeStreamContent,
  parseChunk,
  takeLine,
  type ParsedChunk,
  type StreamReadContext,
} from './chat-stream-parser'

async function* readEventStream({
  decoder,
  initialBuffer,
  reader,
}: StreamReadContext): AsyncGenerator<string, void, void> {
  let buffer = initialBuffer
  let content = ''
  let eventData: string[] = []
  let eventType: string | null = null

  const consumeEvent = (): ParsedChunk => {
    const data = eventData.join('\n')
    const type = eventType
    eventData = []
    eventType = null

    if (type === 'done' || type === 'complete') {
      return { done: true, value: null }
    }
    if (!data) return { done: false, value: null }
    return parseChunk(data, type)
  }

  while (true) {
    let nextLine = takeLine(buffer)
    while (nextLine) {
      buffer = nextLine.rest
      const line = nextLine.line.replace(/^\uFEFF/, '')

      if (!line) {
        const parsed = consumeEvent()
        if (parsed.done) {
          assertHasContent(content)
          return
        }
        if (parsed.value) {
          const nextContent = mergeStreamContent(content, parsed.value)
          if (nextContent !== content) {
            content = nextContent
            yield content
          }
        }
      } else if (!line.startsWith(':')) {
        const separator = line.indexOf(':')
        const field = separator === -1 ? line : line.slice(0, separator)
        const value = separator === -1
          ? ''
          : line.slice(separator + 1).replace(/^ /, '')

        if (field === 'data') {
          // Chat streams use one data field per event. Flushing here also
          // handles non-compliant servers that omit the blank event boundary.
          if (eventData.length > 0) {
            const parsed = consumeEvent()
            if (parsed.done) {
              assertHasContent(content)
              return
            }
            if (parsed.value) {
              const nextContent = mergeStreamContent(content, parsed.value)
              if (nextContent !== content) {
                content = nextContent
                yield content
              }
            }
          }
          eventData.push(value)
        }
        if (field === 'event') eventType = value
      }

      nextLine = takeLine(buffer)
    }

    // Some services omit the blank line required by the SSE specification.
    // A complete data line is still safe to render at the end of this network chunk.
    if (!buffer && eventData.length > 0) {
      const parsed = consumeEvent()
      if (parsed.done) {
        assertHasContent(content)
        return
      }
      if (parsed.value) {
        const nextContent = mergeStreamContent(content, parsed.value)
        if (nextContent !== content) {
          content = nextContent
          yield content
        }
      }
    }

    const result = await reader.read()
    buffer += decoder.decode(result.value, { stream: !result.done })

    if (!result.done) continue

    if (buffer) eventData.push(buffer.replace(/^data:\s?/, ''))
    const parsed = consumeEvent()
    if (parsed.value) {
      const nextContent = mergeStreamContent(content, parsed.value)
      if (nextContent !== content) {
        content = nextContent
        yield content
      }
    }
    assertHasContent(content)
    return
  }
}

async function* readJsonStream({
  decoder,
  initialBuffer,
  reader,
}: StreamReadContext): AsyncGenerator<string, void, void> {
  let buffer = initialBuffer
  let content = ''

  while (true) {
    buffer = buffer.trimStart()
    let valueEnd = findJsonValueEnd(buffer)

    while (valueEnd !== null) {
      const parsed = parseChunk(buffer.slice(0, valueEnd))
      buffer = buffer.slice(valueEnd)

      if (parsed.done) {
        assertHasContent(content)
        return
      }
      if (parsed.value) {
        const nextContent = mergeStreamContent(content, parsed.value)
        if (nextContent !== content) {
          content = nextContent
          yield content
        }
      }

      buffer = buffer.trimStart().replace(/^,/, '')
      valueEnd = findJsonValueEnd(buffer)
    }

    const result = await reader.read()
    buffer += decoder.decode(result.value, { stream: !result.done })
    if (!result.done) continue

    if (buffer.trim()) {
      const parsed = parseChunk(buffer)
      if (parsed.value) {
        const nextContent = mergeStreamContent(content, parsed.value)
        if (nextContent !== content) {
          content = nextContent
          yield content
        }
      }
    }

    assertHasContent(content)
    return
  }
}

async function* readTextStream({
  decoder,
  initialBuffer,
  reader,
}: StreamReadContext): AsyncGenerator<string, void, void> {
  let content = initialBuffer
  if (content) yield content

  while (true) {
    const result = await reader.read()
    const chunk = decoder.decode(result.value, { stream: !result.done })

    if (chunk) {
      content += chunk
      yield content
    }
    if (result.done) {
      assertHasContent(content)
      return
    }
  }
}

export async function* readChatResponseStream(
  response: Response,
): AsyncGenerator<string, void, void> {
  if (!response.body) throw new Error('浏览器未收到可读取的响应流')

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let initialBuffer = ''

  try {
    while (true) {
      const result = await reader.read()
      initialBuffer += decoder.decode(result.value, { stream: !result.done })
      const mode = detectStreamMode(initialBuffer, contentType, result.done)

      if (!mode) continue

      const context = { decoder, initialBuffer, reader }
      if (mode === 'sse') yield* readEventStream(context)
      else if (mode === 'json') yield* readJsonStream(context)
      else yield* readTextStream(context)
      return
    }
  } finally {
    await reader.cancel().catch(() => undefined)
    reader.releaseLock()
  }
}
