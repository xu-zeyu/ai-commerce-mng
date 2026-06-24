'use client'

import { useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { DataTableContent, type DataTableDensityClass } from './data-table-content'
import {
  DataTableTools,
  type DataTableDensity,
  type DataTableToolColumn,
  type DataTableToolOptions,
} from './data-table-tools'
import { useDataTableColumnSettings } from './use-data-table-column-settings'

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
  /** 表格工具，参考 antd table / ProTable 的刷新、密度、全屏、列设置 */
  tools?: DataTableToolOptions | boolean
  toolTitle?: ReactNode
  toolExtra?: ReactNode
  onRefresh?: () => void
  refreshing?: boolean
  settingsKey?: string
  className?: string
}

const defaultTools: Required<DataTableToolOptions> = {
  reload: true,
  density: true,
  fullScreen: true,
  columnSetting: true,
}

const densityClasses: Record<
  DataTableDensity,
  DataTableDensityClass
> = {
  default: {
    head: 'h-11 px-4',
    cell: 'px-4 py-3',
    row: '',
  },
  middle: {
    head: 'h-10 px-4',
    cell: 'px-4 py-2.5',
    row: '',
  },
  small: {
    head: 'h-9 px-3',
    cell: 'px-3 py-2 text-sm',
    row: '',
  },
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
  tools = false,
  toolTitle,
  toolExtra,
  onRefresh,
  refreshing = false,
  settingsKey,
  className,
}: DataTableProps<TData>) {
  const [density, setDensity] = useState<DataTableDensity>('default')
  const [fullScreen, setFullScreen] = useState(false)
  const resolvedTools = resolveToolOptions(tools)
  const {
    columnVisibility,
    updateColumnVisibility,
    setColumnVisible,
    resetColumnVisibility,
  } = useDataTableColumnSettings(columns, settingsKey)

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table manages its own memoized table instance.
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    state: { columnVisibility },
    onColumnVisibilityChange: updateColumnVisibility,
  })

  const toolColumns: DataTableToolColumn[] = table.getAllLeafColumns().map((column) => ({
    id: column.id,
    label: getColumnLabel(column.columnDef.header, column.id),
    visible: column.getIsVisible(),
    canHide: column.getCanHide(),
  }))

  const colSpan = table.getVisibleLeafColumns().length || 1
  const densityClass = densityClasses[density]

  const content = (
    <>
      {resolvedTools && (
        <DataTableTools
          title={toolTitle}
          extra={toolExtra}
          options={resolvedTools}
          columns={toolColumns}
          density={density}
          fullScreen={fullScreen}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onDensityChange={setDensity}
          onFullScreenChange={setFullScreen}
          onColumnVisibleChange={setColumnVisible}
          onResetColumns={resetColumnVisibility}
        />
      )}

      <DataTableContent
        table={table}
        data={data}
        loading={loading}
        colSpan={colSpan}
        emptyText={emptyText}
        empty={empty}
        densityClass={densityClass}
        getRowId={getRowId}
        onRowClick={onRowClick}
        renderMobileCard={renderMobileCard}
      />
    </>
  )

  if (fullScreen && typeof document !== 'undefined') {
    return createPortal(
      <div className="fixed inset-0 z-50 bg-background/80 p-4 backdrop-blur-sm">
        <div className="h-full overflow-auto rounded-2xl border border-border/60 bg-background shadow-md">
          {content}
        </div>
      </div>,
      document.body,
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {content}
    </div>
  )
}

function resolveToolOptions(
  tools: DataTableToolOptions | boolean,
): Required<DataTableToolOptions> | null {
  if (!tools) return null
  if (tools === true) return defaultTools

  return {
    reload: tools.reload ?? defaultTools.reload,
    density: tools.density ?? defaultTools.density,
    fullScreen: tools.fullScreen ?? defaultTools.fullScreen,
    columnSetting: tools.columnSetting ?? defaultTools.columnSetting,
  }
}

function getColumnLabel(header: unknown, fallback: string) {
  return typeof header === 'string' ? header : fallback
}
