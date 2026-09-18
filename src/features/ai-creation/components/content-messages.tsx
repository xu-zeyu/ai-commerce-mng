'use client'

import {
  ActionBarPrimitive,
  ErrorPrimitive,
  MessagePrimitive,
  useMessagePartText,
  useSmooth,
  type TextMessagePartProps,
} from '@assistant-ui/react'
import { AlertCircle, Copy, RefreshCw, Sparkles } from 'lucide-react'
import { ContentMarkdown } from './content-markdown'
import { parseContentRequestMessage } from '../lib/content-request-message'

const STREAMING_SMOOTH_OPTIONS = {
  drainMs: 320,
  maxCharIntervalMs: 12,
  maxCharsPerFrame: 12,
  minCommitMs: 32,
} as const

function AssistantText() {
  const { status, text } = useSmooth(
    useMessagePartText(),
    STREAMING_SMOOTH_OPTIONS,
  )

  if (status?.type === 'running' && !text) {
    return (
      <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
        <span className="flex size-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="size-4 animate-pulse" />
        </span>
        <span className="animate-pulse">正在构思内容…</span>
      </div>
    )
  }

  return <ContentMarkdown isStreaming={status?.type === 'running'} text={text} />
}

function RequestText({ text }: TextMessagePartProps) {
  const request = parseContentRequestMessage(text)
  if (!request) return null

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="font-medium text-foreground">{request.topic}</span>
      <span className="rounded-full bg-background px-2.5 py-1 text-muted-foreground">{request.style}</span>
      <span className="rounded-full bg-background px-2.5 py-1 text-muted-foreground">{request.audience}</span>
    </div>
  )
}

export function ContentRequestMessage() {
  return (
    <MessagePrimitive.Root className="mx-auto w-full max-w-4xl px-5 pt-6 sm:px-8">
      <div className="rounded-2xl border bg-muted/45 px-4 py-3">
        <MessagePrimitive.Parts components={{ Text: RequestText }} />
      </div>
    </MessagePrimitive.Root>
  )
}

export function ContentAssistantMessage() {
  return (
    <MessagePrimitive.Root className="group mx-auto w-full max-w-4xl px-5 py-6 sm:px-8 sm:py-8">
      <div className="min-w-0">
        <MessagePrimitive.Parts components={{ Text: AssistantText }} />
        <MessagePrimitive.Error>
          <ErrorPrimitive.Root className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <ErrorPrimitive.Message className="text-sm leading-6" />
          </ErrorPrimitive.Root>
        </MessagePrimitive.Error>
        <ActionBarPrimitive.Root
          hideWhenRunning
          autohide="not-last"
          className="-ml-2 mt-4 flex items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"
        >
          <ActionBarPrimitive.Copy className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <Copy className="size-4" /><span className="sr-only">复制内容</span>
          </ActionBarPrimitive.Copy>
          <ActionBarPrimitive.Reload className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <RefreshCw className="size-4" /><span className="sr-only">重新生成</span>
          </ActionBarPrimitive.Reload>
        </ActionBarPrimitive.Root>
      </div>
    </MessagePrimitive.Root>
  )
}
