'use client'

import { useMemo, type ReactNode } from 'react'
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
} from '@assistant-ui/react'
import { sendChatMessage } from '../api/send-chat-message'
import { getLatestUserMessage } from '../lib/get-latest-user-message'

interface AiChatRuntimeProviderProps {
  children: ReactNode
  modelId: number
}

function createChatModelAdapter(modelId: number): ChatModelAdapter {
  return {
    async run({ messages, abortSignal }) {
      const message = getLatestUserMessage(messages)
      const response = await sendChatMessage(
        { modelId, message },
        abortSignal,
      )

      return {
        content: [{ type: 'text', text: response.content }],
      }
    },
  }
}

export function AiChatRuntimeProvider({
  children,
  modelId,
}: AiChatRuntimeProviderProps) {
  const adapter = useMemo(() => createChatModelAdapter(modelId), [modelId])
  const runtime = useLocalRuntime(adapter)

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  )
}
