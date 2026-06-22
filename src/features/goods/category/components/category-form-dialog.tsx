'use client'

import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CATEGORY_CREATE_CODES, CATEGORY_MUTATE_CODES } from '../lib/category-permissions'
import { findCategory, flattenCategoryTree } from '../lib/category-tree'
import { categorySchema, type CategoryFormValues } from '../schemas/category-schema'
import { useCreateCategory, useUpdateCategory } from '../hooks/use-categories'
import type { GoodsCategory, GoodsCategoryTreeNode } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  tree: GoodsCategoryTreeNode[]
  editData: GoodsCategory | null
  initialParentId: number
}

export function CategoryFormDialog({ open, onClose, tree, editData, initialParentId }: Props) {
  const isEdit = Boolean(editData)
  const create = useCreateCategory()
  const update = useUpdateCategory()
  const parentOptions = useMemo(() => flattenCategoryTree(tree).filter((item) => item.id !== editData?.id), [tree, editData])

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', parentId: 0, icon: '📦', sort: 0, status: 1 },
  })

  const parentId = useWatch({ control, name: 'parentId' })
  const selectedParent = parentId > 0 ? findCategory(tree, parentId) : null
  const level = selectedParent ? selectedParent.level + 1 : 1
  const loading = create.isPending || update.isPending

  useEffect(() => {
    if (!open) return
    reset(
      editData
        ? {
            name: editData.name,
            parentId: editData.parentId ?? 0,
            icon: editData.icon || '📦',
            sort: editData.sort ?? 0,
            status: editData.status,
          }
        : {
            name: '',
            parentId: initialParentId,
            icon: '📦',
            sort: 0,
            status: 1,
          },
    )
  }, [open, editData, initialParentId, reset])

  const onSubmit = async (values: CategoryFormValues) => {
    const payload = {
      parent_id: values.parentId,
      name: values.name.trim(),
      icon: values.icon.trim(),
      level,
      sort: values.sort,
      status: values.status,
    }

    if (editData) {
      await update.mutateAsync({ id: editData.id, ...payload })
      toast.success('分类更新成功')
    } else {
      await create.mutateAsync(payload)
      toast.success('分类创建成功')
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑商品分类' : '新增商品分类'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">分类名称</Label>
              <Input id="name" placeholder="如：厨房用品" disabled={loading} {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="parentId">父级分类</Label>
              <select
                id="parentId"
                disabled={loading}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register('parentId')}
              >
                <option value={0}>一级分类</option>
                {parentOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">图标</Label>
              <Input id="icon" placeholder="📦 或图标 URL" disabled={loading} {...register('icon')} />
              {errors.icon && <p className="text-xs text-destructive">{errors.icon.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort">排序</Label>
              <Input id="sort" type="number" min={0} disabled={loading} {...register('sort')} />
              {errors.sort && <p className="text-xs text-destructive">{errors.sort.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <select
                id="status"
                disabled={loading}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register('status')}
              >
                <option value={1}>启用</option>
                <option value={0}>停用</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>层级</Label>
              <div className="flex h-10 items-center rounded-xl border border-border bg-muted/50 px-3 text-sm text-muted-foreground">
                第 {level} 级
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              取消
            </Button>
            <Button type="submit" permission={isEdit ? CATEGORY_MUTATE_CODES : CATEGORY_CREATE_CODES} disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
