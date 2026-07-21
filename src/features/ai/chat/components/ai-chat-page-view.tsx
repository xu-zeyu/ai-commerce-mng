'use client'

import { Circle, Sparkles } from 'lucide-react'
import { AiChatRuntimeProvider } from './ai-chat-runtime-provider'
import { ChatThread } from './chat-thread'

interface AiChatPageViewProps {
  modelId: number
}

export function AiChatPageView({ modelId }: AiChatPageViewProps) {
  return (
    <section className="flex h-[calc(100vh-7.75rem)] min-h-[540px] flex-col overflow-hidden rounded-2xl border border-white/60 bg-card/75 shadow-md ring-1 ring-black/[0.03] backdrop-blur-xl dark:border-white/10 dark:bg-card/60 dark:ring-white/[0.04]">
      <header className="flex items-center justify-between gap-4 border-b bg-card/70 px-4 py-3.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
            <Sparkles className="size-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold sm:text-base">AI 运营助手</h1>
            <p className="truncate text-xs text-muted-foreground">
              为跨境电商运营提供灵感与执行建议
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-700 dark:text-emerald-400">
          <Circle className="size-2 fill-current text-emerald-500" />
          <span>在线</span>
        </div>
      </header>

      <AiChatRuntimeProvider modelId={modelId}>
        <ChatThread />
      </AiChatRuntimeProvider>
    </section>
  )
}
