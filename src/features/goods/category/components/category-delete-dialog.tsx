'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CATEGORY_MUTATE_CODES } from '../lib/category-permissions'
import type { GoodsCategory } from '../types'

interface Props {
  category: GoodsCategory | null
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

export function CategoryDeleteDialog({ category, loading, onClose, onConfirm }: Props) {
  return (
    <Dialog open={!!category} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>删除分类</DialogTitle>
          <DialogDescription>
            确定删除「{category?.name ?? ''}」吗？删除后可能影响商品归类，请确认后端已处理关联校验。
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            取消
          </Button>
          <Button type="button" variant="destructive" permission={CATEGORY_MUTATE_CODES} onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            删除
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
