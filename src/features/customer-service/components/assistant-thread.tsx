'use client'

import { ThreadPrimitive, useAui } from '@assistant-ui/react'
import { Bot, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AssistantMessage, UserMessage } from './chat-message'
import { ChatComposer } from './chat-composer'
import { ChatWelcome } from './chat-welcome'

function ChatHeader() {
  const aui = useAui()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bot className="size-4" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">企业智能客服</h1>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            AI 客服在线
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-xl bg-card/70"
        onClick={() => aui.thread.reset()}
      >
        <Plus className="size-4" />
        <span className="hidden sm:inline">新对话</span>
      </Button>
    </header>
  )
}

export function AssistantThread() {
  return (
    <ThreadPrimitive.Root className="flex h-full min-h-0 flex-col bg-card">
      <ChatHeader />
      <ThreadPrimitive.Viewport className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto scroll-smooth bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.045),transparent_32rem)]">
        <ThreadPrimitive.Empty>
          <ChatWelcome />
        </ThreadPrimitive.Empty>
        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            AssistantMessage,
          }}
        />
        <ThreadPrimitive.ViewportFooter className="sticky bottom-0 mt-auto bg-gradient-to-t from-card via-card to-card/0 pt-8">
          <ChatComposer />
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  )
}
