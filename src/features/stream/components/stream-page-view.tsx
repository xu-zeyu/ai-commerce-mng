'use client'

import { Activity, Circle, Eraser, Pause, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAgentStream } from '../hooks/use-agent-stream'
import type { AgentStreamStatus } from '../types'
import { StreamEventList } from './stream-event-list'

const STATUS_TEXT: Record<AgentStreamStatus, string> = {
  connecting: '连接中',
  connected: '实时连接',
  closed: '已暂停',
  error: '连接异常',
}

export function StreamPageView() {
  const { clearEvents, connect, disconnect, error, events, status } = useAgentStream()
  const isActive = status === 'connecting' || status === 'connected'

  return (
    <section className="flex min-h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-3xl border bg-card shadow-sm">
      <header className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Activity className="size-5" />
          </div>
          <div>
            <h1 className="font-semibold">实时输出</h1>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Circle className={`size-2 fill-current ${status === 'connected' ? 'text-emerald-500' : 'text-muted-foreground'}`} />
              <span>{STATUS_TEXT[status]}</span>
              <span>·</span>
              <code>/api/see</code>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={clearEvents} disabled={events.length === 0}>
            <Eraser className="size-4" />清空
          </Button>
          {isActive ? (
            <Button type="button" variant="outline" size="sm" onClick={disconnect}>
              <Pause className="size-4" />暂停
            </Button>
          ) : (
            <Button type="button" size="sm" onClick={connect}>
              <RefreshCw className="size-4" />重新连接
            </Button>
          )}
        </div>
      </header>

      {error && (
        <div className="border-b border-destructive/20 bg-destructive/5 px-5 py-3 text-sm text-destructive sm:px-6">
          {error}
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto bg-muted/20">
        <StreamEventList events={events} />
      </div>
      <footer className="border-t bg-card/80 px-5 py-3 text-xs text-muted-foreground sm:px-6">
        仅展示 Agent 原始返回数据，本页不执行业务逻辑。最多保留最新 500 条。
      </footer>
    </section>
  )
}
