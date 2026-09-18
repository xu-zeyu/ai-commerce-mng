'use client'

import { AuiIf, ThreadPrimitive } from '@assistant-ui/react'
import { ArrowDown, FilePenLine, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContentAssistantMessage, ContentRequestMessage } from './content-messages'

export function ContentThread({ onCreate }: { onCreate: () => void }) {
  return (
    <ThreadPrimitive.Root className="flex min-h-[620px] flex-1 flex-col">
      <ThreadPrimitive.Viewport className="scrollbar-thin relative flex min-h-0 flex-1 flex-col overflow-y-auto">
        <AuiIf condition={(state) => state.thread.isEmpty}>
          <div className="flex min-h-[560px] flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <FilePenLine className="size-7" />
            </div>
            <h2 className="mt-5 text-lg font-semibold">开始一次新的 AI 创作</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              设置内容主题、风格和目标受众，生成结果会像 ChatGPT 一样逐字呈现并实时渲染 Markdown。
            </p>
            <Button type="button" className="mt-6" onClick={onCreate}>
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
