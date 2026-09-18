'use client'

import {
  ActionBarPrimitive,
  AuiIf,
  ErrorPrimitive,
  MessagePrimitive,
  type EmptyMessagePartProps,
  type TextMessagePartProps,
} from '@assistant-ui/react'
import { MarkdownTextPrimitive } from '@assistant-ui/react-markdown'
import { Bot, Check, CircleStop, Copy, RefreshCw } from 'lucide-react'

const actionClassName = 'flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

function UserText({ text }: TextMessagePartProps) {
  return <p className="whitespace-pre-wrap break-words text-[15px] leading-6">{text}</p>
}

function AssistantText() {
  return (
    <MarkdownTextPrimitive
      defer={false}
      smooth={{
        drainMs: 450,
        maxCharIntervalMs: 20,
        maxCharsPerFrame: 6,
        minCommitMs: 32,
      }}
      className="min-w-0 break-words text-[15px] leading-7 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:font-semibold [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-zinc-950 [&_pre]:p-4 [&_pre]:text-zinc-100 [&_table]:my-4 [&_table]:w-full [&_td]:border-b [&_td]:p-2 [&_th]:border-b [&_th]:p-2 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6"
    />
  )
}

function EmptyAssistantMessage({ status }: EmptyMessagePartProps) {
  if (status.type !== 'running') return null

  return (
    <div className="flex h-7 items-center gap-1" aria-label="正在思考">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="size-1.5 animate-pulse rounded-full bg-primary/70"
          style={{ animationDelay: `${index * 150}ms` }}
        />
      ))}
    </div>
  )
}

function CancelledNotice() {
  return (
    <AuiIf
      condition={(state) => {
        const status = state.message.status
        return status?.type === 'incomplete' && status.reason === 'cancelled'
      }}
    >
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <CircleStop className="size-3.5" />
        用户已停止生成
      </p>
    </AuiIf>
  )
}

function AssistantActions() {
  return (
    <ActionBarPrimitive.Root hideWhenRunning autohide="not-last" className="flex items-center gap-1 pt-1">
      <ActionBarPrimitive.Copy className={actionClassName} title="复制回复">
        <AuiIf condition={(state) => state.message.isCopied}>
          <Check className="size-4" />
        </AuiIf>
        <AuiIf condition={(state) => !state.message.isCopied}>
          <Copy className="size-4" />
        </AuiIf>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload className={actionClassName} title="重新生成">
        <RefreshCw className="size-4" />
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  )
}

export function UserMessage() {
  return (
    <MessagePrimitive.Root className="mx-auto flex w-full max-w-3xl justify-end px-4 py-3 sm:px-6">
      <div className="max-w-[88%] rounded-3xl rounded-br-lg bg-muted px-4 py-3 text-foreground sm:max-w-[78%]">
        <MessagePrimitive.Parts components={{ Text: UserText }} />
      </div>
    </MessagePrimitive.Root>
  )
}

export function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="group mx-auto flex w-full max-w-3xl gap-3 px-4 py-4 sm:gap-4 sm:px-6">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Bot className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <MessagePrimitive.Parts
          components={{
            Text: AssistantText,
            Empty: EmptyAssistantMessage,
          }}
        />
        <CancelledNotice />
        <MessagePrimitive.Error>
          <ErrorPrimitive.Root className="mt-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <ErrorPrimitive.Message />
          </ErrorPrimitive.Root>
        </MessagePrimitive.Error>
        <AssistantActions />
      </div>
    </MessagePrimitive.Root>
  )
}
