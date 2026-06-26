'use client'

import { type FormEvent, type ReactNode, useState } from 'react'
import { ChevronDown, RefreshCw, RotateCcw, Search } from 'lucide-react'
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
  searchLabel?: string
  /** 重置搜索与筛选 */
  onReset?: () => void
  resetDisabled?: boolean
  /** 刷新回调。不传则不渲染刷新按钮 */
  onRefresh?: () => void
  refreshing?: boolean
  /** 额外筛选控件（下拉、日期、状态等） */
  filters?: ReactNode
  /** 右侧操作区（新增、导出等） */
  actions?: ReactNode
  /** 高级筛选默认展开状态 */
  defaultFiltersExpanded?: boolean
  className?: string
}

/**
 * 表格筛选层 —— 统一封装搜索框、高级筛选、查询动作与表格操作区。
 * 查询与重置固定在筛选表单右下角，筛选项支持展开与收起。
 */
export function DataTableToolbar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = '搜索…',
  searchLabel = '关键词',
  onReset,
  resetDisabled = false,
  onRefresh,
  refreshing = false,
  filters,
  actions,
  defaultFiltersExpanded = false,
  className,
}: DataTableToolbarProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(defaultFiltersExpanded)
  const showSearch = onSearchChange !== undefined
  const showOperations = onRefresh || actions
  const hasFilters = Boolean(filters)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearchSubmit?.()
  }

  return (
    <div
      className={cn(
        'space-y-4 border-b border-border/60 bg-card/80 p-4 dark:bg-card/70',
        className,
      )}
    >
      {showOperations && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {onRefresh && (
            <Button type="button" variant="ghost" onClick={onRefresh} disabled={refreshing}>
              <RefreshCw className={cn('size-4', refreshing && 'animate-spin')} />
              刷新
            </Button>
          )}
          {actions}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border/60 bg-muted/20 p-3 shadow-sm dark:bg-muted/10 sm:p-4"
      >
        <div className="space-y-3">
          {showSearch && (
            <div className="grid gap-1.5 sm:grid-cols-[72px_minmax(0,1fr)] sm:items-center sm:gap-3 xl:max-w-xl">
              <span className="text-xs font-medium text-muted-foreground sm:justify-self-end">
                {searchLabel}
              </span>
              <div className="relative min-w-0">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchValue ?? ''}
                  onChange={(event) => onSearchChange?.(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-10 bg-background/80 pl-9 shadow-sm"
                />
              </div>
            </div>
          )}

          {hasFilters && (
            <div
              className={cn(
                'overflow-hidden transition-all duration-200',
                filtersExpanded ? 'max-h-[720px] opacity-100' : 'max-h-0 opacity-0',
              )}
            >
              <div className={cn(showSearch && 'border-t border-border/50 pt-3')}>
                {filters}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              className="text-primary hover:bg-primary/10 hover:text-primary"
              onClick={() => setFiltersExpanded((value) => !value)}
            >
              {filtersExpanded ? '收起' : '展开'}
              <ChevronDown
                className={cn(
                  'size-4 transition-transform',
                  filtersExpanded && 'rotate-180',
                )}
              />
            </Button>
          )}
          {onReset && (
            <Button
              type="button"
              variant="outline"
              disabled={resetDisabled}
              onClick={onReset}
            >
              <RotateCcw className="size-4" />
              重置
            </Button>
          )}
          <Button type="submit">
            <Search className="size-4" />
            查询
          </Button>
        </div>
      </form>
    </div>
  )
}
