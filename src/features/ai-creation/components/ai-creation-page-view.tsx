'use client'

import { useState } from 'react'
import { useAui, useAuiState } from '@assistant-ui/react'
import { Bot, Eraser, Sparkles, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDialogOrigin } from '@/hooks/use-dialog-origin'
import type { ContentCreationValues } from '../schemas/content-creation-schema'
import { AiCreationRuntimeProvider } from './ai-creation-runtime-provider'
import { ContentCreationDialog } from './content-creation-dialog'
import { ContentThread } from './content-thread'

export function AiCreationPageView() {
  return (
    <AiCreationRuntimeProvider>
      <AiCreationWorkspace />
    </AiCreationRuntimeProvider>
  )
}

function AiCreationWorkspace() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { captureOrigin, getOriginPoint } = useDialogOrigin()
  const assistant = useAui()
  const isRunning = useAuiState((state) => state.thread.isRunning)
  const isEmpty = useAuiState((state) => state.thread.isEmpty)

  const submit = async (values: ContentCreationValues) => {
    assistant.thread.reset()
    assistant.thread.append({
      role: 'user',
      content: [{ type: 'text', text: JSON.stringify(values) }],
    })
  }

  return (
    <div className="h-[calc(100dvh-7.25rem)] min-h-[34rem] overflow-hidden rounded-3xl border border-white/55 bg-card shadow-md ring-1 ring-black/[0.03] dark:border-white/10 dark:ring-white/[0.04]">
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card/80 px-4 backdrop-blur-xl sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Bot className="size-4" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold">AI 创作</h1>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              AI 助手在线
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEmpty && (
            <Button type="button" variant="ghost" size="sm" onClick={() => assistant.thread.reset()} disabled={isRunning}>
              <Eraser className="size-4" />清空
            </Button>
          )}
          {isRunning ? (
            <Button type="button" variant="outline" onClick={() => assistant.thread.cancelRun()}>
              <Square className="size-3.5 fill-current" />停止生成
            </Button>
          ) : (
            <Button type="button" onClick={(e) => {
              captureOrigin(e)
              setDialogOpen(true)
            }}>
              <Sparkles className="size-4" />新建创作
            </Button>
          )}
        </div>
      </header>

      <ContentThread onCreate={(e) => {
        captureOrigin(e)
        setDialogOpen(true)
      }} />

      <ContentCreationDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={submit} originPoint={getOriginPoint()} />
    </div>
  )
}
