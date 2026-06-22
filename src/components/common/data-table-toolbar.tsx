'use client'

import { type FormEvent, type ReactNode } from 'react'
import { RefreshCw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface DataTableToolbarProps {
  /** 搜索框值（受控）。不传则不渲染搜索框 */
  searchValue?: string
  onSearchChange?: (value: string) => void
  /** 点击搜索 / 回车提交 */
  onSearchSubmit?: () => void
  searchPlaceholder?: string
  /** 刷新回调。不传则不渲染刷新按钮 */
  onRefresh?: () => void
  refreshing?: boolean
  /** 额外筛选控件（下拉、日期、状态等） */
  filters?: ReactNode
  /** 右侧操作区（新增、导出等） */
  actions?: ReactNode
  className?: string
}

/**
 * 表格筛选层 —— 统一封装搜索框、筛选控件、刷新与操作按钮的布局。
 * 左侧为搜索与筛选，右侧为操作区，移动端自动换行。
 */
export function DataTableToolbar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = '搜索…',
  onRefresh,
  refreshing = false,
  filters,
  actions,
  className,
}: DataTableToolbarProps) {
  const showSearch = onSearchChange !== undefined

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearchSubmit?.()
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-b border-border/60 p-4 lg:flex-row lg:items-center lg:justify-between',
        className,
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {showSearch && (
          <form onSubmit={handleSubmit} className="flex w-full gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchValue ?? ''}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="outline">
              搜索
            </Button>
          </form>
        )}
        {filters}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onRefresh && (
          <Button type="button" variant="ghost" onClick={onRefresh} disabled={refreshing}>
            <RefreshCw className={cn('size-4', refreshing && 'animate-spin')} />
            刷新
          </Button>
        )}
        {actions}
      </div>
    </div>
  )
}
