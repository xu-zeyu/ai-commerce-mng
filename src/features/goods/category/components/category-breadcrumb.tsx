'use client'

import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GoodsCategoryTreeNode } from '../types'

interface Props {
  path: GoodsCategoryTreeNode[]
  total: number
  onNavigate: (id: number) => void
}

export function CategoryBreadcrumb({ path, total, onNavigate }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/80 px-4 py-3 shadow-sm backdrop-blur-xl dark:bg-card/70">
      <nav className="flex flex-wrap items-center gap-0.5 text-sm">
        <button
          type="button"
          onClick={() => onNavigate(0)}
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-muted',
            path.length === 0 ? 'font-medium text-foreground' : 'text-muted-foreground',
          )}
        >
          <Home className="size-3.5" />
          全部分类
        </button>
        {path.map((node, index) => {
          const isLast = index === path.length - 1
          return (
            <span key={node.id} className="flex items-center gap-0.5">
              <ChevronRight className="size-3.5 text-muted-foreground/40" />
              <button
                type="button"
                onClick={() => onNavigate(node.id)}
                disabled={isLast}
                className={cn(
                  'rounded-xl px-2.5 py-1.5 transition-colors disabled:cursor-default',
                  isLast
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {node.name}
              </button>
            </span>
          )
        })}
      </nav>
      <span className="text-xs tabular-nums text-muted-foreground">{total} 项</span>
    </div>
  )
}
