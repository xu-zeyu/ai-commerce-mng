'use client'

import { AssistantThread } from './assistant-thread'
import { CustomerChatRuntime } from './customer-chat-runtime'

export function CustomerServicePageView() {
  return (
    <div className="h-[calc(100dvh-7.25rem)] min-h-[34rem] overflow-hidden rounded-3xl border border-white/55 bg-card shadow-md ring-1 ring-black/[0.03] dark:border-white/10 dark:ring-white/[0.04]">
      <CustomerChatRuntime>
        <AssistantThread />
      </CustomerChatRuntime>
    </div>
  )
}
