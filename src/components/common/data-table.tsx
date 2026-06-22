'use client'

import { type ReactNode } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { Inbox, Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  /** 加载中显示骨架/loading */
  loading?: boolean
  /** 空状态文案 */
  emptyText?: string
  /** 自定义空状态内容（优先级高于 emptyText） */
  empty?: ReactNode
  /** 行唯一标识 */
  getRowId?: (row: TData, index: number) => string
  /** 行点击事件 */
  onRowClick?: (row: TData) => void
  /** 移动端卡片渲染：提供时小屏用卡片、桌面用表格 */
  renderMobileCard?: (row: TData) => ReactNode
  className?: string
}

/**
 * 通用数据表格 —— 封装 TanStack Table，统一处理表头渲染、
 * loading / empty 状态、桌面表格与移动端卡片布局。
 */
export function DataTable<TData>({
  columns,
  data,
  loading = false,
  emptyText = '暂无数据',
  empty,
  getRowId,
  onRowClick,
  renderMobileCard,
  className,
}: DataTableProps<TData>) {
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table manages its own memoized table instance.
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
  })

  const colSpan = columns.length || 1

  return (
    <div className={cn('w-full', className)}>
      {/* 桌面端表格 */}
      <div className={cn(renderMobileCard ? 'hidden md:block' : 'block')}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-border/60 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground/70"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={colSpan} className="h-40">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    加载中…
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={colSpan} className="h-40">
                  {empty ?? <DataTableEmpty text={emptyText} />}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(
                    'border-border/50 transition-colors',
                    onRowClick && 'cursor-pointer',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 移动端卡片 */}
      {renderMobileCard && (
        <div className="grid gap-3 p-4 md:hidden">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              加载中…
            </div>
          ) : data.length === 0 ? (
            empty ?? <DataTableEmpty text={emptyText} />
          ) : (
            data.map((row, index) => (
              <div key={getRowId?.(row, index) ?? index}>{renderMobileCard(row)}</div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function DataTableEmpty({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Inbox className="size-10 text-muted-foreground/30" />
      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
