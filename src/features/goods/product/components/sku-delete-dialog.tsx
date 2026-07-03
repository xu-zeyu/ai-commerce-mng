'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SKU_DELETE_CODES } from '../lib/product-permissions'
import type { ProductSku } from '../types'

interface Props {
  sku: ProductSku | null
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function SkuDeleteDialog({ sku, loading, onClose, onConfirm }: Props) {
  return (
    <Dialog open={Boolean(sku)} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>确认删除 SKU</DialogTitle>
          <DialogDescription>
            删除后将无法恢复，确认要删除 SKU「{sku?.skuCode}」吗？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            permission={SKU_DELETE_CODES}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            确认删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
