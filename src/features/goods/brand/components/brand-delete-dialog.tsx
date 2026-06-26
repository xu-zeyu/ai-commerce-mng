'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BRAND_DELETE_CODES } from '../lib/brand-permissions'
import type { GoodsBrand } from '../types'

interface Props {
  brand: GoodsBrand | null
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

export function BrandDeleteDialog({ brand, loading, onClose, onConfirm }: Props) {
  return (
    <Dialog open={!!brand} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>删除品牌</DialogTitle>
          <DialogDescription>
            确定删除「{brand?.name ?? ''}」吗？删除后可能影响商品归类，请确认。
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            permission={BRAND_DELETE_CODES}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            删除
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
