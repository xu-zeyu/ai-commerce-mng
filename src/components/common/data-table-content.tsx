'use client'

import type { ReactNode } from 'react'
import { flexRender, type Table as ReactTable } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { DataTableEmpty } from './data-table-empty'

export interface DataTableDensityClass {
  head: string
  cell: string
  row: string
}

interface DataTableContentProps<TData> {
  table: ReactTable<TData>
  data: TData[]
  loading: boolean
  colSpan: number
  emptyText: string
  empty?: ReactNode
  densityClass: DataTableDensityClass
  getRowId?: (row: TData, index: number) => string
  onRowClick?: (row: TData) => void
  renderMobileCard?: (row: TData) => ReactNode
}

export function DataTableContent<TData>({
  table,
  data,
  loading,
  colSpan,
  emptyText,
  empty,
  densityClass,
  getRowId,
  onRowClick,
  renderMobileCard,
}: DataTableContentProps<TData>) {
  return (
    <>
      <div className={cn(renderMobileCard ? 'hidden md:block' : 'block')}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border/60 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'text-xs font-medium uppercase tracking-wide text-muted-foreground/70',
                      densityClass.head,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <LoadingRow colSpan={colSpan} />
            ) : table.getRowModel().rows.length === 0 ? (
              <EmptyRow colSpan={colSpan} empty={empty} emptyText={emptyText} />
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(
                    'border-border/50 transition-colors',
                    densityClass.row,
                    onRowClick && 'cursor-pointer',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={densityClass.cell}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {renderMobileCard && (
        <div className="grid gap-3 p-4 md:hidden">
          {loading ? (
            <MobileLoading />
          ) : data.length === 0 ? (
            empty ?? <DataTableEmpty text={emptyText} />
          ) : (
            data.map((row, index) => (
              <div key={getRowId?.(row, index) ?? index}>{renderMobileCard(row)}</div>
            ))
          )}
        </div>
      )}
    </>
  )
}

function LoadingRow({ colSpan }: { colSpan: number }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="h-40">
        <MobileLoading />
      </TableCell>
    </TableRow>
  )
}

function EmptyRow({
  colSpan,
  empty,
  emptyText,
}: {
  colSpan: number
  empty?: ReactNode
  emptyText: string
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="h-40">
        {empty ?? <DataTableEmpty text={emptyText} />}
      </TableCell>
    </TableRow>
  )
}

function MobileLoading() {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      加载中…
    </div>
  )
}
