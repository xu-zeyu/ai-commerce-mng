'use client'

import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Edit3, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import { PRODUCT_DELETE_CODES, PRODUCT_UPDATE_CODES } from '../lib/product-permissions'
import {
  AUDIT_STATUS_LABEL,
  AUDIT_STATUS_VARIANT,
  SALE_STATUS_LABEL,
} from '../lib/product-status'
import type { ProductSpu } from '../types'

interface Props {
  data: ProductSpu[]
  loading?: boolean
  refreshing?: boolean
  onEdit: (product: ProductSpu) => void
  onDelete: (product: ProductSpu) => void
  onRefresh?: () => void
}

function SaleBadge({ status }: { status: ProductSpu['saleStatus'] }) {
  return (
    <Badge variant={status === 1 ? 'default' : 'secondary'}>{SALE_STATUS_LABEL[status]}</Badge>
  )
}

function AuditBadge({ status }: { status: ProductSpu['auditStatus'] }) {
  return <Badge variant={AUDIT_STATUS_VARIANT[status]}>{AUDIT_STATUS_LABEL[status]}</Badge>
}

function formatDate(value?: string) {
  return value ? value.slice(0, 10) : '—'
}

export function ProductTable({ data, loading, refreshing, onEdit, onDelete, onRefresh }: Props) {
  const columns = useMemo<ColumnDef<ProductSpu>[]>(
    () => [
      {
        accessorKey: 'name',
        header: '商品',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.spuCode}</span>
            {row.original.subTitle && (
              <span className="text-xs text-muted-foreground line-clamp-1">{row.original.subTitle}</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'categoryName',
        header: '分类 / 品牌',
        cell: ({ row }) => (
          <div className="flex flex-col text-sm">
            <span className="text-foreground">{row.original.categoryName || '—'}</span>
            <span className="text-xs text-muted-foreground">{row.original.brandName || '—'}</span>
          </div>
        ),
      },
      {
        accessorKey: 'supplierName',
        header: '供应商',
        cell: ({ row }) => row.original.supplierName || '—',
      },
      {
        accessorKey: 'salesCount',
        header: '销量',
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">{row.original.salesCount ?? 0}</span>
        ),
      },
      {
        accessorKey: 'saleStatus',
        header: '销售状态',
        cell: ({ row }) => <SaleBadge status={row.original.saleStatus} />,
      },
      {
        accessorKey: 'auditStatus',
        header: '审核状态',
        cell: ({ row }) => <AuditBadge status={row.original.auditStatus} />,
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
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
              permission={PRODUCT_UPDATE_CODES}
              onClick={() => onEdit(row.original)}
            >
              <Edit3 className="size-3.5" />
              编辑
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-destructive"
              permission={PRODUCT_DELETE_CODES}
              onClick={() => onDelete(row.original)}
            >
              <Trash2 className="size-3.5" />
              删除
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete],
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
        emptyText="暂无商品"
        getRowId={(row) => String(row.id)}
        renderMobileCard={(row) => (
          <div className="space-y-2 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col">
                <span className="font-medium">{row.name}</span>
                <span className="text-xs text-muted-foreground">{row.spuCode}</span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <SaleBadge status={row.saleStatus} />
                <AuditBadge status={row.auditStatus} />
              </div>
            </div>
            <dl className="space-y-1 text-sm text-muted-foreground">
              <div className="flex justify-between gap-2">
                <dt>分类</dt>
                <dd className="text-foreground">{row.categoryName || '—'}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>品牌</dt>
                <dd className="text-foreground">{row.brandName || '—'}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>供应商</dt>
                <dd className="text-foreground">{row.supplierName || '—'}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>销量</dt>
                <dd className="text-foreground tabular-nums">{row.salesCount ?? 0}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>创建时间</dt>
                <dd className="text-foreground">{formatDate(row.createdTime)}</dd>
              </div>
            </dl>
            <div className="flex items-center justify-end gap-1 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                permission={PRODUCT_UPDATE_CODES}
                onClick={() => onEdit(row)}
              >
                <Edit3 className="size-3.5" />
                编辑
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-destructive"
                permission={PRODUCT_DELETE_CODES}
                onClick={() => onDelete(row)}
              >
                <Trash2 className="size-3.5" />
                删除
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  )
}
