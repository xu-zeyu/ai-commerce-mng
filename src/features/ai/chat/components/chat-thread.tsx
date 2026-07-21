'use client'

import { AuiIf, ThreadPrimitive } from '@assistant-ui/react'
import { ArrowDown } from 'lucide-react'
import { ChatComposer } from './chat-composer'
import { ChatEmptyState } from './chat-empty-state'
import { AssistantMessage, UserMessage } from './chat-message'

export function ChatThread() {
  return (
    <ThreadPrimitive.Root className="flex min-h-0 flex-1 flex-col">
      <ThreadPrimitive.Viewport className="scrollbar-thin relative flex min-h-0 flex-1 flex-col overflow-y-auto">
        <AuiIf condition={(state) => state.thread.isEmpty}>
          <ChatEmptyState />
        </AuiIf>

        <div className="w-full pb-6 pt-3">
          <ThreadPrimitive.Messages>
            {({ message }) =>
              message.role === 'user' ? <UserMessage /> : <AssistantMessage />
            }
          </ThreadPrimitive.Messages>
        </div>

        <ThreadPrimitive.ScrollToBottom
          title="滚动到底部"
          className="sticky bottom-28 z-10 mx-auto flex size-9 items-center justify-center rounded-full border bg-background/90 text-muted-foreground shadow-md backdrop-blur transition hover:bg-muted hover:text-foreground disabled:invisible"
        >
          <ArrowDown className="size-4" />
          <span className="sr-only">滚动到底部</span>
        </ThreadPrimitive.ScrollToBottom>

        <ThreadPrimitive.ViewportFooter className="sticky bottom-0 z-20 mt-auto bg-gradient-to-t from-card via-card/95 to-transparent px-3 pb-3 pt-10 sm:px-6 sm:pb-5">
          <div className="mx-auto w-full max-w-3xl">
            <ChatComposer />
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              AI 可能产生不准确的信息，请结合业务数据进行判断。
            </p>
          </div>
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  )
}
