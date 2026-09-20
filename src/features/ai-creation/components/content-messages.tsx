'use client'

import {
  ActionBarPrimitive,
  ErrorPrimitive,
  MessagePrimitive,
  useMessagePartText,
  useSmooth,
  type TextMessagePartProps,
} from '@assistant-ui/react'
import { AlertCircle, Bot, Copy, RefreshCw, Sparkles } from 'lucide-react'
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
    <MessagePrimitive.Root className="mx-auto flex w-full max-w-3xl justify-end px-4 py-3 sm:px-6">
      <div className="max-w-[88%] rounded-3xl rounded-br-lg bg-muted px-4 py-3 text-foreground sm:max-w-[78%]">
        <MessagePrimitive.Parts components={{ Text: RequestText }} />
      </div>
    </MessagePrimitive.Root>
  )
}

export function ContentAssistantMessage() {
  return (
    <MessagePrimitive.Root className="group mx-auto flex w-full max-w-3xl gap-3 px-4 py-4 sm:gap-4 sm:px-6">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Bot className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <MessagePrimitive.Parts components={{ Text: AssistantText }} />
        <MessagePrimitive.Error>
          <ErrorPrimitive.Root className="mt-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <ErrorPrimitive.Message />
          </ErrorPrimitive.Root>
        </MessagePrimitive.Error>
        <ActionBarPrimitive.Root
          hideWhenRunning
          autohide="not-last"
          className="flex items-center gap-1 pt-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"
        >
          <ActionBarPrimitive.Copy className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Copy className="size-4" /><span className="sr-only">复制内容</span>
          </ActionBarPrimitive.Copy>
          <ActionBarPrimitive.Reload className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <RefreshCw className="size-4" /><span className="sr-only">重新生成</span>
          </ActionBarPrimitive.Reload>
        </ActionBarPrimitive.Root>
      </div>
    </MessagePrimitive.Root>
  )
}
