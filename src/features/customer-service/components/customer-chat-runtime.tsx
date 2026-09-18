'use client'

import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
  type ThreadMessage,
} from '@assistant-ui/react'
import type { ReactNode } from 'react'
import { streamCustomerChat } from '../api/stream-customer-chat'

function getMessageText(message: ThreadMessage): string {
  return message.content
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
}

const customerChatAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal }) {
    const lastUserMessage = messages.findLast((message) => message.role === 'user')
    if (!lastUserMessage) throw new Error('请输入消息后再发送')

    let text = ''
    for await (const chunk of streamCustomerChat(
      { message: getMessageText(lastUserMessage) },
      abortSignal,
    )) {
      text += chunk
      yield { content: [{ type: 'text', text }] }
    }
  },
}

export function CustomerChatRuntime({ children }: { children: ReactNode }) {
  const runtime = useLocalRuntime(customerChatAdapter)

  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>
}
