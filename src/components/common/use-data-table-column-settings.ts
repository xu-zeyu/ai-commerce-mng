'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { ColumnDef, OnChangeFn, VisibilityState } from '@tanstack/react-table'

const tableStoragePrefix = 'ai-commerce:data-table-columns:'

export function useDataTableColumnSettings<TData>(
  columns: ColumnDef<TData>[],
  settingsKey?: string,
) {
  const pathname = usePathname()
  const storageKey = useMemo(
    () => settingsKey ?? createStorageKey(pathname, columns),
    [columns, pathname, settingsKey],
  )

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
    readColumnVisibility(storageKey),
  )

  const updateColumnVisibility: OnChangeFn<VisibilityState> = (updater) => {
    setColumnVisibility((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveColumnVisibility(storageKey, next)
      return next
    })
  }

  const setColumnVisible = (columnId: string, visible: boolean) => {
    updateColumnVisibility((prev) => {
      const next = { ...prev }
      if (visible) {
        delete next[columnId]
      } else {
        next[columnId] = false
      }
      return next
    })
  }

  const resetColumnVisibility = () => {
    clearColumnVisibility(storageKey)
    setColumnVisibility({})
  }

  return {
    columnVisibility,
    updateColumnVisibility,
    setColumnVisible,
    resetColumnVisibility,
  }
}

function createStorageKey<TData>(pathname: string, columns: ColumnDef<TData>[]) {
  const columnIds = columns.map((column, index) => getColumnStorageId(column, index))
  return `${tableStoragePrefix}${pathname}:${columnIds.join('|')}`
}

function getColumnStorageId(column: unknown, index: number) {
  if (!column || typeof column !== 'object') return `column-${index}`

  const record = column as Record<string, unknown>
  if (typeof record.id === 'string') return record.id
  if (typeof record.accessorKey === 'string') return record.accessorKey
  return `column-${index}`
}

function readColumnVisibility(storageKey: string): VisibilityState {
  if (typeof window === 'undefined') return {}

  try {
    const value = window.localStorage.getItem(storageKey)
    if (!value) return {}

    const parsed = JSON.parse(value)
    return isVisibilityState(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function saveColumnVisibility(storageKey: string, visibility: VisibilityState) {
  if (typeof window === 'undefined') return

  const hiddenColumnCount = Object.values(visibility).filter((visible) => !visible).length
  if (hiddenColumnCount === 0) {
    window.localStorage.removeItem(storageKey)
    return
  }

  window.localStorage.setItem(storageKey, JSON.stringify(visibility))
}

function clearColumnVisibility(storageKey: string) {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(storageKey)
}

function isVisibilityState(value: unknown): value is VisibilityState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false

  return Object.values(value).every((visible) => typeof visible === 'boolean')
}
