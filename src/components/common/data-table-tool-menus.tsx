'use client'

import { Columns3, RotateCcw, Rows3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { DataTableDensity, DataTableToolColumn } from './data-table-tools'

interface DensityMenuProps {
  density: DataTableDensity
  onDensityChange: (density: DataTableDensity) => void
}

interface ColumnMenuProps {
  columns: DataTableToolColumn[]
  onColumnVisibleChange: (columnId: string, visible: boolean) => void
  onResetColumns: () => void
}

const densityLabels: Record<DataTableDensity, string> = {
  default: '默认',
  middle: '中等',
  small: '紧凑',
}

export function DataTableDensityMenu({
  density,
  onDensityChange,
}: DensityMenuProps) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="size-9">
              <Rows3 className="size-4" />
              <span className="sr-only">密度</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>密度</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-32 rounded-xl">
        <DropdownMenuRadioGroup
          value={density}
          onValueChange={(value) => onDensityChange(value as DataTableDensity)}
        >
          {(Object.keys(densityLabels) as DataTableDensity[]).map((value) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {densityLabels[value]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DataTableColumnMenu({
  columns,
  onColumnVisibleChange,
  onResetColumns,
}: ColumnMenuProps) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="size-9">
              <Columns3 className="size-4" />
              <span className="sr-only">列设置</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>列设置</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-48 rounded-xl">
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-xs text-muted-foreground">
            列展示
          </DropdownMenuLabel>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetColumns}
            className="h-7 px-2 text-xs"
          >
            <RotateCcw className="size-3.5" />
            重置
          </Button>
        </div>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.visible}
            disabled={!column.canHide}
            onSelect={(event) => {
              event.preventDefault()
              if (!column.canHide) return
              onColumnVisibleChange(column.id, !column.visible)
            }}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
