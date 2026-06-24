'use client'

import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Edit3 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import { SUPPLIER_UPDATE_CODES } from '../lib/supplier-permissions'
import type { Supplier } from '../types'

interface Props {
  data: Supplier[]
  loading?: boolean
  refreshing?: boolean
  onEdit: (supplier: Supplier) => void
  onRefresh?: () => void
}

function StatusBadge({ status }: { status: Supplier['status'] }) {
  return (
    <Badge variant={status === 1 ? 'default' : 'secondary'}>
      {status === 1 ? '启用' : '停用'}
    </Badge>
  )
}

function formatDate(value?: string) {
  return value ? value.slice(0, 10) : '—'
}

export function SupplierTable({ data, loading, refreshing, onEdit, onRefresh }: Props) {
  const columns = useMemo<ColumnDef<Supplier>[]>(
    () => [
      {
        accessorKey: 'supplierName',
        header: '供应商',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{row.original.supplierName}</span>
            {row.original.supplierCode && (
              <span className="text-xs text-muted-foreground">{row.original.supplierCode}</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'contactName',
        header: '联系人',
        cell: ({ row }) => row.original.contactName || '—',
      },
      {
        accessorKey: 'contactPhone',
        header: '联系电话',
        cell: ({ row }) => row.original.contactPhone || '—',
      },
      {
        accessorKey: 'email',
        header: '邮箱',
        cell: ({ row }) => row.original.email || '—',
      },
      {
        accessorKey: 'status',
        header: '状态',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'createdTime',
        header: '创建时间',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDate(row.original.createdTime)}</span>
        ),
      },
      {
        id: 'actions',
        header: '操作',
        cell: ({ row }) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            permission={SUPPLIER_UPDATE_CODES}
            onClick={() => onEdit(row.original)}
          >
            <Edit3 className="size-3.5" />
            编辑
          </Button>
        ),
      },
    ],
    [onEdit],
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-xl dark:bg-card/70">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        tools
        emptyText="暂无供应商"
        getRowId={(row) => String(row.id)}
        renderMobileCard={(row) => (
          <div className="space-y-2 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="font-medium">{row.supplierName}</span>
                {row.supplierCode && (
                  <span className="text-xs text-muted-foreground">{row.supplierCode}</span>
                )}
              </div>
              <StatusBadge status={row.status} />
            </div>
            <dl className="space-y-1 text-sm text-muted-foreground">
              <div className="flex justify-between gap-2">
                <dt>联系人</dt>
                <dd className="text-foreground">{row.contactName || '—'}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>联系电话</dt>
                <dd className="text-foreground">{row.contactPhone || '—'}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>邮箱</dt>
                <dd className="text-foreground">{row.email || '—'}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>创建时间</dt>
                <dd className="text-foreground">{formatDate(row.createdTime)}</dd>
              </div>
            </dl>
            <div className="flex justify-end pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                permission={SUPPLIER_UPDATE_CODES}
                onClick={() => onEdit(row)}
              >
                <Edit3 className="size-3.5" />
                编辑
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  )
}
