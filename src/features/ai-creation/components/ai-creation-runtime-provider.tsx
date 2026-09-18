'use client'

import { useMemo, type ReactNode } from 'react'
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
} from '@assistant-ui/react'
import { streamContentAgent } from '../api/stream-content-agent'
import { getLatestContentRequest } from '../lib/content-request-message'

function createContentAdapter(): ChatModelAdapter {
  return {
    async *run({ abortSignal, messages }) {
      const input = getLatestContentRequest(messages)
      let content = ''

      for await (const delta of streamContentAgent(input, abortSignal)) {
        content += delta
        yield { content: [{ type: 'text', text: content }] }
      }
    },
  }
}

export function AiCreationRuntimeProvider({ children }: { children: ReactNode }) {
  const adapter = useMemo(() => createContentAdapter(), [])
  const runtime = useLocalRuntime(adapter)

  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>
}
