'use client'

import { useMemo, type ReactNode } from 'react'
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
} from '@assistant-ui/react'
import { useAuthStore } from '@/stores/use-auth-store'
import { streamChatMessage } from '../api/stream-chat-message'
import { getLatestUserMessage } from '../lib/get-latest-user-message'
import { smoothChatContent } from '../lib/smooth-chat-content'

interface AiChatRuntimeProviderProps {
  children: ReactNode
  modelId: number
}

function createChatModelAdapter(
  modelId: number,
  token: string | null,
): ChatModelAdapter {
  return {
    async *run({ messages, abortSignal }) {
      const message = getLatestUserMessage(messages)
      const stream = streamChatMessage(
        { modelId, message },
        { signal: abortSignal, token },
      )

      for await (const content of smoothChatContent(stream, abortSignal)) {
        yield {
          content: [{ type: 'text', text: content }],
        }
      }
    },
  }
}

export function AiChatRuntimeProvider({
  children,
  modelId,
}: AiChatRuntimeProviderProps) {
  const token = useAuthStore((state) => state.token)
  const adapter = useMemo(
    () => createChatModelAdapter(modelId, token),
    [modelId, token],
  )
  const runtime = useLocalRuntime(adapter)

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  )
}
