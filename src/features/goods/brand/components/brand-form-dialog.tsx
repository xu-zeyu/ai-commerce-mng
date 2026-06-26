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
import { FileUpload } from '@/features/file/components/file-upload'
import { BRAND_CREATE_CODES, BRAND_UPDATE_CODES } from '../lib/brand-permissions'
import { brandSchema, type BrandFormValues } from '../schemas/brand-schema'
import { useCreateBrand, useUpdateBrand } from '../hooks/use-brands'
import { useCategoryTree } from '../hooks/use-category-tree'
import type { GoodsBrand } from '../types'
import type { CategoryTreeNode } from '../api/get-category-tree'
import { BrandIcon } from './brand-icon'

interface Props {
  open: boolean
  onClose: () => void
  editData: GoodsBrand | null
}

/** 将分类树拍平为可选列表，显示层级路径 */
function flattenCategoryTree(
  nodes: CategoryTreeNode[],
  parentPath = '',
): { id: number; label: string; level: number }[] {
  const result: { id: number; label: string; level: number }[] = []
  for (const node of nodes) {
    const path = parentPath ? `${parentPath} > ${node.name}` : node.name
    result.push({ id: node.id, label: path, level: node.level })
    if (node.children && node.children.length > 0) {
      result.push(...flattenCategoryTree(node.children, path))
    }
  }
  return result
}

/** 查找分类树中的第一个叶子节点（用于新建时自动选中） */
function findFirstLeaf(nodes: CategoryTreeNode[]): CategoryTreeNode | null {
  for (const node of nodes) {
    if (!node.children || node.children.length === 0) return node
    const leaf = findFirstLeaf(node.children)
    if (leaf) return leaf
  }
  return null
}

export function BrandFormDialog({ open, onClose, editData }: Props) {
  const isEdit = Boolean(editData)
  const create = useCreateBrand()
  const update = useUpdateBrand()
  const treeQuery = useCategoryTree()
  const loading = create.isPending || update.isPending

  const tree = treeQuery.data ?? []
  const flatCategories = useMemo(() => flattenCategoryTree(tree), [tree])
  const firstLeaf = useMemo(() => findFirstLeaf(tree), [tree])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: '',
      logo: '',
      firstLetter: '',
      categoryId: firstLeaf?.id ?? 0,
      sort: 0,
      status: 1,
    },
  })

  const logoValue = useWatch({ control, name: 'logo' })
  const uploadedLogoValue =
    logoValue?.startsWith('http') || logoValue?.startsWith('/') ? [logoValue] : []

  useEffect(() => {
    if (!open) return
    // 等待分类树加载完成后再设置默认值
    if (!isEdit && tree.length > 0) {
      const defaultCategoryId = firstLeaf?.id ?? tree[0]?.id ?? 0
      reset({
        name: '',
        logo: '',
        firstLetter: '',
        categoryId: defaultCategoryId,
        sort: 0,
        status: 1,
      })
      return
    }
    reset(
      editData
        ? {
            name: editData.name,
            logo: editData.logo || '',
            firstLetter: editData.firstLetter || '',
            categoryId: editData.categoryId,
            sort: editData.sort ?? 0,
            status: editData.status,
          }
        : {
            name: '',
            logo: '',
            firstLetter: '',
            categoryId: firstLeaf?.id ?? 0,
            sort: 0,
            status: 1,
          },
    )
  }, [open, editData, tree, firstLeaf, isEdit, reset])

  const onSubmit = async (values: BrandFormValues) => {
    const payload = {
      name: values.name.trim(),
      logo: values.logo?.trim() || undefined,
      firstLetter: values.firstLetter?.trim()?.toUpperCase() || undefined,
      categoryId: values.categoryId,
      sort: values.sort,
      status: values.status,
    }

    if (editData) {
      await update.mutateAsync({ id: editData.id, ...payload })
      toast.success('品牌更新成功')
    } else {
      await create.mutateAsync(payload)
      toast.success('品牌创建成功')
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑商品品牌' : '新增商品品牌'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 品牌名称 */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="brand-name">品牌名称</Label>
              <Input
                id="brand-name"
                placeholder="如：Apple"
                disabled={loading}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* 品牌 Logo */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="brand-logo">品牌 Logo</Label>
              <div className="flex items-center gap-3">
                <BrandIcon value={logoValue} name="品牌 Logo" className="size-10 shrink-0" />
                <Input
                  id="brand-logo"
                  placeholder="图片地址（可选）"
                  disabled={loading}
                  {...register('logo')}
                />
              </div>
              <FileUpload
                value={uploadedLogoValue}
                onChange={(urls) =>
                  setValue('logo', urls[0] ?? '', {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                accept="image/jpeg,image/png,image/webp"
                maxFiles={1}
                maxSizeMb={5}
                disabled={loading}
                emptyTitle="上传品牌 Logo"
                emptyDescription="JPG、PNG、WebP · 上传后自动填入地址"
              />
              {errors.logo && (
                <p className="text-xs text-destructive">{errors.logo.message}</p>
              )}
            </div>

            {/* 首字母 */}
            <div className="space-y-2">
              <Label htmlFor="brand-firstLetter">首字母</Label>
              <Input
                id="brand-firstLetter"
                placeholder="如：A"
                maxLength={1}
                disabled={loading}
                {...register('firstLetter')}
              />
              {errors.firstLetter && (
                <p className="text-xs text-destructive">{errors.firstLetter.message}</p>
              )}
            </div>

            {/* 排序 */}
            <div className="space-y-2">
              <Label htmlFor="brand-sort">排序</Label>
              <Input
                id="brand-sort"
                type="number"
                min={0}
                disabled={loading}
                {...register('sort')}
              />
              {errors.sort && (
                <p className="text-xs text-destructive">{errors.sort.message}</p>
              )}
            </div>

            {/* 状态 */}
            <div className="space-y-2">
              <Label htmlFor="brand-status">状态</Label>
              <select
                id="brand-status"
                disabled={loading}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register('status')}
              >
                <option value={1}>启用</option>
                <option value={0}>停用</option>
              </select>
            </div>

            {/* 所属分类 - 可选择 */}
            <div className="space-y-2">
              <Label htmlFor="brand-categoryId">所属分类</Label>
              <select
                id="brand-categoryId"
                disabled={loading || treeQuery.isLoading}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register('categoryId')}
              >
                {treeQuery.isLoading && (
                  <option value={0}>加载中…</option>
                )}
                {flatCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-xs text-destructive">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              取消
            </Button>
            <Button
              type="submit"
              permission={isEdit ? BRAND_UPDATE_CODES : BRAND_CREATE_CODES}
              disabled={loading}
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
