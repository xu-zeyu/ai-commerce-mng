'use client'

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SKU_CREATE_CODES } from '../lib/product-permissions'
import { useProductSkuPage, useDeleteProductSku } from '../hooks/use-product-skus'
import type { ProductSku } from '../types'
import { SkuTable } from './sku-table'
import { SkuFormDialog } from './sku-form-dialog'
import { SkuDeleteDialog } from './sku-delete-dialog'

interface Props {
  open: boolean
  onClose: () => void
  spuId: number
  productName: string
}

export function SkuManager({ open, onClose, spuId, productName }: Props) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [editData, setEditData] = useState<ProductSku | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ProductSku | null>(null)

  const deleteMutation = useDeleteProductSku()

  const params = useMemo(
    () => ({ page, size: pageSize, spuId }),
    [page, pageSize, spuId],
  )

  const pageQuery = useProductSkuPage(params)
  const skus = pageQuery.data?.records ?? []
  const total = pageQuery.data?.total ?? 0

  const handleCreate = () => {
    setEditData(null)
    setFormOpen(true)
  }

  const handleEdit = (sku: ProductSku) => {
    setEditData(sku)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditData(null)
  }

  const handleDelete = (sku: ProductSku) => {
    setDeleteTarget(sku)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('SKU 删除成功')
        setDeleteTarget(null)
      },
      onError: () => {
        toast.error('删除失败，请重试')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="truncate">SKU 管理 · {productName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 工具栏 */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              共 {total} 个 SKU
            </p>
            <Button
              type="button"
              size="sm"
              permission={SKU_CREATE_CODES}
              onClick={handleCreate}
            >
              <Plus className="size-4" />
              新增 SKU
            </Button>
          </div>

          {/* SKU 表格 */}
          <SkuTable
            data={skus}
            loading={pageQuery.isLoading}
            refreshing={pageQuery.isFetching}
            onRefresh={() => pageQuery.refetch()}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* 简单分页 */}
          {total > pageSize && (
            <div className="flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                上一页
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {Math.ceil(total / pageSize)}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(total / pageSize)}
                onClick={() => setPage((p) => p + 1)}
              >
                下一页
              </Button>
            </div>
          )}
        </div>

        {/* SKU 表单 */}
        <SkuFormDialog
          open={formOpen}
          onClose={handleFormClose}
          editData={editData}
          spuId={spuId}
        />

        {/* 删除确认 */}
        <SkuDeleteDialog
          sku={deleteTarget}
          loading={deleteMutation.isPending}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      </DialogContent>
    </Dialog>
  )
}
