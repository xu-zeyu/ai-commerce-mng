'use client'

import {
  ActionBarPrimitive,
  ErrorPrimitive,
  MessagePrimitive,
  type TextMessagePartProps,
} from '@assistant-ui/react'
import {
  AlertCircle,
  Copy,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { AssistantMarkdown } from './assistant-markdown'

function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
      <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="size-3.5 animate-pulse" />
      </span>
      <span className="animate-pulse">正在思考…</span>
    </div>
  )
}

function UserMessageText({ text }: TextMessagePartProps) {
  return <p className="whitespace-pre-wrap break-words leading-7">{text}</p>
}

function AssistantMessageText({ status, text }: TextMessagePartProps) {
  if (status?.type === 'running' && !text) {
    return <LoadingIndicator />
  }

  return <AssistantMarkdown isRunning={status?.type === 'running'} text={text} />
}

export function UserMessage() {
  return (
    <MessagePrimitive.Root className="group mx-auto flex w-full max-w-3xl justify-end px-4 py-3 sm:px-6 sm:py-4">
      <div className="max-w-[88%] rounded-[1.35rem] bg-muted px-4 py-2.5 text-[15px] text-foreground sm:max-w-[78%]">
        <MessagePrimitive.Parts components={{ Text: UserMessageText }} />
      </div>
    </MessagePrimitive.Root>
  )
}

export function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="group mx-auto w-full max-w-3xl px-4 py-4 sm:px-6 sm:py-5">
      <div className="min-w-0 w-full">
        <MessagePrimitive.Parts components={{ Text: AssistantMessageText }} />
        <MessagePrimitive.Error>
          <ErrorPrimitive.Root className="flex items-start gap-2 rounded-xl bg-destructive/8 px-3 py-2.5 text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <ErrorPrimitive.Message className="text-sm leading-6" />
          </ErrorPrimitive.Root>
        </MessagePrimitive.Error>

        <ActionBarPrimitive.Root
          hideWhenRunning
          autohide="not-last"
          className="-ml-2 mt-2 flex items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"
        >
          <ActionBarPrimitive.Copy
            title="复制回复"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Copy className="size-4" />
            <span className="sr-only">复制回复</span>
          </ActionBarPrimitive.Copy>
          <ActionBarPrimitive.Reload
            title="重新生成"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RefreshCw className="size-4" />
            <span className="sr-only">重新生成</span>
          </ActionBarPrimitive.Reload>
        </ActionBarPrimitive.Root>
      </div>
    </MessagePrimitive.Root>
  )
}
