'use client'

/* eslint-disable @next/next/no-img-element */

import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Edit3, Trash2, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import { SKU_DELETE_CODES, SKU_UPDATE_CODES } from '../lib/product-permissions'
import { SKU_STATUS_LABELS, SKU_STATUS } from '../types'
import type { ProductSku } from '../types'

interface Props {
  data: ProductSku[]
  loading?: boolean
  refreshing?: boolean
  onEdit: (sku: ProductSku) => void
  onDelete: (sku: ProductSku) => void
  onRefresh?: () => void
}

function StatusBadge({ status }: { status: ProductSku['status'] }) {
  return (
    <Badge variant={status === SKU_STATUS.ENABLED ? 'default' : 'secondary'}>
      {SKU_STATUS_LABELS[status]}
    </Badge>
  )
}

function formatPrice(price?: number | null) {
  if (price == null) return '—'
  return `¥${price.toFixed(2)}`
}

export function SkuTable({ data, loading, refreshing, onEdit, onDelete, onRefresh }: Props) {
  const columns = useMemo<ColumnDef<ProductSku>[]>(
    () => [
      {
        accessorKey: 'skuCode',
        header: 'SKU',
        cell: ({ row }) => {
          const imageUrl = row.original.image
          return (
            <div className="flex items-center gap-3">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={row.original.skuCode}
                  className="size-11 shrink-0 rounded-xl object-cover shadow-sm"
                />
              ) : (
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Package className="size-4 opacity-40" />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-foreground truncate">{row.original.skuCode}</span>
                {row.original.specInfo && (
                  <span className="text-xs text-muted-foreground truncate">{row.original.specInfo}</span>
                )}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'price',
        header: '售价',
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{formatPrice(row.original.price)}</span>
        ),
      },
      {
        accessorKey: 'originalPrice',
        header: '原价',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatPrice(row.original.originalPrice)}</span>
        ),
      },
      {
        accessorKey: 'stock',
        header: '库存',
        cell: ({ row }) => {
          const stock = row.original.stock
          return (
            <span className={stock <= 0 ? 'text-destructive font-medium' : 'text-foreground'}>
              {stock}
            </span>
          )
        },
      },
      {
        accessorKey: 'salesCount',
        header: '销量',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.salesCount ?? 0}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: '状态',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
              permission={SKU_UPDATE_CODES}
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
              permission={SKU_DELETE_CODES}
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
        emptyText="暂无 SKU"
        getRowId={(row) => String(row.id)}
        renderMobileCard={(row) => (
          <div className="space-y-2 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                {row.image ? (
                  <img
                    src={row.image}
                    alt={row.skuCode}
                    className="size-14 shrink-0 rounded-xl object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Package className="size-5 opacity-40" />
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{row.skuCode}</span>
                  {row.specInfo && (
                    <span className="text-xs text-muted-foreground">{row.specInfo}</span>
                  )}
                </div>
              </div>
              <StatusBadge status={row.status} />
            </div>
            <dl className="space-y-1 text-sm text-muted-foreground">
              <div className="flex justify-between gap-2">
                <dt>售价</dt>
                <dd className="font-medium text-foreground">{formatPrice(row.price)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>原价</dt>
                <dd className="text-foreground">{formatPrice(row.originalPrice)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>库存</dt>
                <dd className={row.stock <= 0 ? 'text-destructive font-medium' : 'text-foreground'}>
                  {row.stock}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>销量</dt>
                <dd className="text-foreground">{row.salesCount ?? 0}</dd>
              </div>
            </dl>
            <div className="flex items-center justify-end gap-1 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                permission={SKU_UPDATE_CODES}
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
                permission={SKU_DELETE_CODES}
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
