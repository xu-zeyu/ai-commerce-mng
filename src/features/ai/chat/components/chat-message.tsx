'use client'

import {
  ActionBarPrimitive,
  ErrorPrimitive,
  MessagePrimitive,
  type TextMessagePartProps,
} from '@assistant-ui/react'
import {
  AlertCircle,
  Bot,
  Copy,
  RefreshCw,
  UserRound,
} from 'lucide-react'

function MessageText({ status, text }: TextMessagePartProps) {
  if (status?.type === 'running' && !text) {
    return (
      <span className="flex items-center gap-1 py-2" aria-label="AI 正在思考">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="size-1.5 animate-pulse rounded-full bg-primary"
            style={{ animationDelay: `${index * 160}ms` }}
          />
        ))}
      </span>
    )
  }

  return <p className="whitespace-pre-wrap break-words leading-7">{text}</p>
}

export function UserMessage() {
  return (
    <MessagePrimitive.Root className="group mx-auto flex w-full max-w-3xl justify-end gap-3 px-4 py-3 sm:px-6">
      <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-sm text-primary-foreground shadow-sm sm:max-w-[75%]">
        <MessagePrimitive.Parts components={{ Text: MessageText }} />
      </div>
      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
        <UserRound className="size-4" />
      </div>
    </MessagePrimitive.Root>
  )
}

export function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="group mx-auto flex w-full max-w-3xl gap-3 px-4 py-3 sm:px-6">
      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
        <Bot className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="rounded-2xl rounded-tl-md border bg-card px-4 py-3 text-sm shadow-sm">
          <MessagePrimitive.Parts components={{ Text: MessageText }} />
          <MessagePrimitive.Error>
            <ErrorPrimitive.Root className="flex items-start gap-2 text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <ErrorPrimitive.Message className="text-sm" />
            </ErrorPrimitive.Root>
          </MessagePrimitive.Error>
        </div>

        <ActionBarPrimitive.Root
          hideWhenRunning
          autohide="not-last"
          className="mt-1 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"
        >
          <ActionBarPrimitive.Copy
            title="复制回复"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Copy className="size-3.5" />
            <span className="sr-only">复制回复</span>
          </ActionBarPrimitive.Copy>
          <ActionBarPrimitive.Reload
            title="重新生成"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RefreshCw className="size-3.5" />
            <span className="sr-only">重新生成</span>
          </ActionBarPrimitive.Reload>
        </ActionBarPrimitive.Root>
      </div>
    </MessagePrimitive.Root>
  )
}
