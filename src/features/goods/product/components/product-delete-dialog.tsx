'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PRODUCT_DELETE_CODES } from '../lib/product-permissions'
import type { ProductSpu } from '../types'

interface Props {
  product: ProductSpu | null
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ProductDeleteDialog({ product, loading, onClose, onConfirm }: Props) {
  return (
    <Dialog open={!!product} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            确定要删除商品「{product?.name}」（{product?.spuCode}）吗？此操作不可撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            permission={PRODUCT_DELETE_CODES}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? '删除中...' : '确认删除'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
