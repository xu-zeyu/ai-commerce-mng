'use client'

import { AuiIf, ThreadPrimitive } from '@assistant-ui/react'
import { ArrowDown, FilePenLine, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContentAssistantMessage, ContentRequestMessage } from './content-messages'

export function ContentThread({ onCreate }: { onCreate: (e: React.MouseEvent) => void }) {
  return (
    <ThreadPrimitive.Root className="flex h-full min-h-0 flex-col bg-card">
      <ThreadPrimitive.Viewport className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto scroll-smooth bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.045),transparent_32rem)]">
        <AuiIf condition={(state) => state.thread.isEmpty}>
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-10 sm:px-6">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <FilePenLine className="size-6" />
            </div>
            <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
              开始一次新的 AI 创作
            </h1>
            <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-muted-foreground">
              设置内容主题、风格和目标受众，生成结果会像 ChatGPT 一样逐字呈现并实时渲染 Markdown。
            </p>
            <Button type="button" className="mx-auto mt-6" onClick={(e) => onCreate(e)}>
              <Sparkles className="size-4" />设置创作内容
            </Button>
          </div>
        </AuiIf>

        <ThreadPrimitive.Messages>
          {({ message }) => message.role === 'user' ? <ContentRequestMessage /> : <ContentAssistantMessage />}
        </ThreadPrimitive.Messages>

        <ThreadPrimitive.ScrollToBottom className="sticky bottom-5 z-10 mx-auto mb-5 flex size-9 items-center justify-center rounded-full border bg-background/90 text-muted-foreground shadow-md backdrop-blur transition hover:bg-muted hover:text-foreground disabled:invisible">
          <ArrowDown className="size-4" />
          <span className="sr-only">滚动到底部</span>
        </ThreadPrimitive.ScrollToBottom>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  )
}
