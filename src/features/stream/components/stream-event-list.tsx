'use client'

import { useEffect, useRef } from 'react'
import { Radio } from 'lucide-react'
import type { AgentStreamEvent } from '../types'

interface StreamEventListProps {
  events: AgentStreamEvent[]
}

export function StreamEventList({ events }: StreamEventListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [events.length])

  if (events.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Radio className="size-5" />
        </div>
        <p className="mt-4 text-sm font-medium">正在等待 Agent 输出</p>
        <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
          连接建立后，此处将按接收顺序原样展示 /api/see 返回的内容。
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 p-4 sm:p-5">
      {events.map((event) => (
        <article key={event.id} className="rounded-xl border bg-background/70 px-4 py-3">
          <div className="mb-2 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <span className="rounded-md bg-muted px-2 py-0.5 font-mono">{event.eventType}</span>
            <time dateTime={event.receivedAt}>
              {new Date(event.receivedAt).toLocaleTimeString('zh-CN', { hour12: false })}
            </time>
          </div>
          <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-foreground sm:text-sm">
            {event.data}
          </pre>
        </article>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
