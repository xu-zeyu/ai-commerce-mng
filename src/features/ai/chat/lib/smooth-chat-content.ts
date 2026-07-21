const LARGE_CHUNK_SIZE = 48
const REVEAL_STEP_SIZE = 18
const REVEAL_DELAY_MS = 14

function getRevealEnd(content: string, start: number): number {
  let end = Math.min(start + REVEAL_STEP_SIZE, content.length)

  if (end < content.length && /[\uD800-\uDBFF]/.test(content[end - 1] ?? '')) {
    end += 1
  }

  const nearbyBreak = content
    .slice(end, end + 8)
    .search(/[\s，。！？；：,.!?:;]/)

  return nearbyBreak === -1 ? end : Math.min(end + nearbyBreak + 1, content.length)
}

async function waitForReveal(signal: AbortSignal): Promise<void> {
  if (signal.aborted) throw new DOMException('生成已停止', 'AbortError')

  await new Promise<void>((resolve, reject) => {
    const finish = () => {
      signal.removeEventListener('abort', handleAbort)
      resolve()
    }
    const handleAbort = () => {
      window.clearTimeout(timer)
      reject(new DOMException('生成已停止', 'AbortError'))
    }
    const timer = window.setTimeout(finish, REVEAL_DELAY_MS)

    signal.addEventListener('abort', handleAbort, { once: true })
  })
}

export async function* smoothChatContent(
  stream: AsyncGenerator<string, void, void>,
  signal: AbortSignal,
): AsyncGenerator<string, void, void> {
  let displayed = ''

  for await (const target of stream) {
    if (!target.startsWith(displayed)) {
      displayed = target
      yield displayed
      continue
    }

    const addedLength = target.length - displayed.length
    if (addedLength <= LARGE_CHUNK_SIZE) {
      displayed = target
      yield displayed
      continue
    }

    while (displayed.length < target.length) {
      const end = getRevealEnd(target, displayed.length)
      displayed = target.slice(0, end)
      yield displayed

      if (displayed.length < target.length) await waitForReveal(signal)
    }
  }
}
