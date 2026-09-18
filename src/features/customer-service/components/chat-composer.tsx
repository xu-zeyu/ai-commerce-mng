'use client'

import { AuiIf, ComposerPrimitive, ThreadPrimitive } from '@assistant-ui/react'
import { ArrowDown, ArrowUp, Square } from 'lucide-react'

export function ChatComposer() {
  return (
    <div className="relative mx-auto w-full max-w-3xl px-3 pb-4 sm:px-6 sm:pb-6">
      <ThreadPrimitive.ScrollToBottom
        className="absolute -top-12 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-md transition hover:text-foreground disabled:hidden"
        title="滚动到底部"
      >
        <ArrowDown className="size-4" />
      </ThreadPrimitive.ScrollToBottom>

      <ComposerPrimitive.Root className="relative rounded-3xl border border-border/80 bg-card p-2 shadow-md ring-1 ring-black/[0.02] transition-shadow focus-within:border-primary/35 focus-within:shadow-lg dark:ring-white/[0.03]">
        <ComposerPrimitive.Input
          autoFocus
          submitMode="enter"
          placeholder="给企业客服发送消息"
          aria-label="消息内容"
          className="max-h-44 min-h-12 w-full resize-none bg-transparent px-3 py-2.5 pr-12 text-[15px] leading-6 outline-none placeholder:text-muted-foreground/65"
        />
        <div className="absolute bottom-2.5 right-2.5">
          <AuiIf condition={(state) => !state.thread.isRunning}>
            <ComposerPrimitive.Send
              className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background shadow-sm transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-25"
              title="发送消息"
            >
              <ArrowUp className="size-4" />
            </ComposerPrimitive.Send>
          </AuiIf>
          <AuiIf condition={(state) => state.thread.isRunning}>
            <ComposerPrimitive.Cancel
              className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background shadow-sm transition hover:opacity-85"
              title="停止生成"
            >
              <Square className="size-3 fill-current" />
            </ComposerPrimitive.Cancel>
          </AuiIf>
        </div>
      </ComposerPrimitive.Root>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        AI 生成内容可能存在错误，请核验重要信息
      </p>
    </div>
  )
}
