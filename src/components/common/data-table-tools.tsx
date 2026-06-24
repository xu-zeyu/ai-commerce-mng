'use client'

import type { ReactNode } from 'react'
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { DataTableColumnMenu, DataTableDensityMenu } from './data-table-tool-menus'

export type DataTableDensity = 'default' | 'middle' | 'small'

export interface DataTableToolOptions {
  reload?: boolean
  density?: boolean
  fullScreen?: boolean
  columnSetting?: boolean
}

export interface DataTableToolColumn {
  id: string
  label: string
  visible: boolean
  canHide: boolean
}

interface DataTableToolsProps {
  title?: ReactNode
  extra?: ReactNode
  options: Required<DataTableToolOptions>
  columns: DataTableToolColumn[]
  density: DataTableDensity
  fullScreen: boolean
  refreshing?: boolean
  onRefresh?: () => void
  onDensityChange: (density: DataTableDensity) => void
  onFullScreenChange: (fullScreen: boolean) => void
  onColumnVisibleChange: (columnId: string, visible: boolean) => void
  onResetColumns: () => void
}

export function DataTableTools({
  title,
  extra,
  options,
  columns,
  density,
  fullScreen,
  refreshing = false,
  onRefresh,
  onDensityChange,
  onFullScreenChange,
  onColumnVisibleChange,
  onResetColumns,
}: DataTableToolsProps) {
  const showReload = options.reload && Boolean(onRefresh)
  const showTools =
    showReload || options.density || options.fullScreen || options.columnSetting

  if (!title && !extra && !showTools) return null

  return (
    <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        {title && <div className="text-sm font-medium text-foreground">{title}</div>}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {extra}
        {showTools && (
          <TooltipProvider delayDuration={120}>
            <div className="flex items-center gap-1">
              {showReload && (
                <ToolButton
                  label="刷新"
                  disabled={refreshing}
                  onClick={onRefresh}
                  icon={<RefreshCw className={cn('size-4', refreshing && 'animate-spin')} />}
                />
              )}
              {options.density && (
                <DataTableDensityMenu
                  density={density}
                  onDensityChange={onDensityChange}
                />
              )}
              {options.fullScreen && (
                <ToolButton
                  label={fullScreen ? '退出全屏' : '全屏'}
                  onClick={() => onFullScreenChange(!fullScreen)}
                  icon={
                    fullScreen ? (
                      <Minimize2 className="size-4" />
                    ) : (
                      <Maximize2 className="size-4" />
                    )
                  }
                />
              )}
              {options.columnSetting && columns.length > 0 && (
                <DataTableColumnMenu
                  columns={columns}
                  onColumnVisibleChange={onColumnVisibleChange}
                  onResetColumns={onResetColumns}
                />
              )}
            </div>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}

function ToolButton({
  label,
  icon,
  disabled,
  onClick,
}: {
  label: string
  icon: ReactNode
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={label}
          title={label}
          disabled={disabled}
          onClick={onClick}
          className="size-9"
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
