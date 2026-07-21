'use client'

import { ThreadPrimitive } from '@assistant-ui/react'
import { PackageSearch, Sparkles, WandSparkles } from 'lucide-react'

const SUGGESTIONS = [
  {
    icon: PackageSearch,
    title: '梳理运营重点',
    prompt: '帮我分析跨境电商近期的商品运营重点',
  },
  {
    icon: Sparkles,
    title: '新品上架清单',
    prompt: '整理一份跨境电商新品上架检查清单',
  },
  {
    icon: WandSparkles,
    title: '提升商品转化',
    prompt: '给出提升跨境电商商品转化率的实用建议',
  },
] as const

export function ChatEmptyState() {
  return (
    <div className="mx-auto flex min-h-[430px] w-full max-w-3xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-sm ring-1 ring-primary/15">
        <Sparkles className="size-7" />
      </div>
      <h2 className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl">
        今天想优化什么？
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        我可以协助梳理商品运营思路、生成执行清单，并为日常电商工作提供建议。
      </p>

      <div className="mt-7 grid w-full gap-2 sm:grid-cols-3">
        {SUGGESTIONS.map((suggestion) => {
          const Icon = suggestion.icon

          return (
            <ThreadPrimitive.Suggestion
              key={suggestion.title}
              prompt={suggestion.prompt}
              send
              className="group flex min-h-24 flex-col items-start rounded-2xl border bg-card/70 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card hover:shadow-md"
            >
              <Icon className="size-4 text-primary" />
              <span className="mt-3 text-sm font-medium">{suggestion.title}</span>
              <span className="mt-1 text-xs text-muted-foreground group-hover:text-foreground/70">
                点击直接提问
              </span>
            </ThreadPrimitive.Suggestion>
          )
        })}
      </div>
    </div>
  )
}
