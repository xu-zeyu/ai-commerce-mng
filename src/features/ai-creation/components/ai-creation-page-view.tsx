'use client'

import { useState } from 'react'
import { useAui, useAuiState } from '@assistant-ui/react'
import { Bot, Eraser, Sparkles, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <div className="flex min-h-[calc(100vh-9rem)] flex-col gap-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Bot className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">AI CONTENT STUDIO</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">AI 创作</h1>
            <p className="mt-1 text-sm text-muted-foreground">输入创作设置，实时生成结构清晰的 Markdown 内容。</p>
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
            <Button type="button" onClick={() => setDialogOpen(true)}>
              <Sparkles className="size-4" />新建创作
            </Button>
          )}
        </div>
      </header>

      <section className="flex min-h-0 flex-1 overflow-hidden rounded-3xl border bg-card shadow-sm">
        <ContentThread onCreate={() => setDialogOpen(true)} />
      </section>

      <ContentCreationDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={submit} />
    </div>
  )
}
