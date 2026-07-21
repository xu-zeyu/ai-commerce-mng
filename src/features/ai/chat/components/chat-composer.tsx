'use client'

import { AuiIf, ComposerPrimitive } from '@assistant-ui/react'
import { ArrowUp, Square } from 'lucide-react'

export function ChatComposer() {
  return (
    <ComposerPrimitive.Root className="rounded-[1.65rem] border border-border/80 bg-background/95 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.02] backdrop-blur-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.24)] dark:ring-white/[0.04]">
      <ComposerPrimitive.Input
        rows={1}
        submitMode="enter"
        placeholder="向 AI 运营助手提问…"
        className="max-h-40 min-h-12 w-full resize-none bg-transparent px-3 py-2.5 text-[15px] leading-6 outline-none placeholder:text-muted-foreground/65"
      />

      <div className="flex items-center justify-between gap-3 px-2 pb-1">
        <span className="hidden text-[11px] text-muted-foreground sm:inline">
          Enter 发送 · Shift + Enter 换行
        </span>
        <span className="text-[11px] text-muted-foreground sm:hidden">
          AI 内容仅供参考
        </span>

        <AuiIf condition={(state) => !state.thread.isRunning}>
          <ComposerPrimitive.Send
            title="发送消息"
            className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:scale-[1.03] hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="size-4" />
            <span className="sr-only">发送消息</span>
          </ComposerPrimitive.Send>
        </AuiIf>

        <AuiIf condition={(state) => state.thread.isRunning}>
          <ComposerPrimitive.Cancel
            title="停止生成"
            className="flex size-8 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition hover:scale-[1.03] hover:opacity-85"
          >
            <Square className="size-3.5 fill-current" />
            <span className="sr-only">停止生成</span>
          </ComposerPrimitive.Cancel>
        </AuiIf>
      </div>
    </ComposerPrimitive.Root>
  )
}
