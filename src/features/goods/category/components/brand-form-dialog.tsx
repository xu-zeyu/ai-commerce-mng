'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { SelectControl } from '@/components/common/select-control'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileUpload } from '@/features/file/components/file-upload'
import { BRAND_CREATE_CODES, BRAND_UPDATE_CODES } from '../lib/brand-permissions'
import { brandSchema, type BrandFormValues } from '../schemas/brand-schema'
import { useCreateBrand, useUpdateBrand } from '../hooks/use-brands'
import { CategoryIcon } from './category-icon'
import type { GoodsBrand, GoodsCategoryTreeNode } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  category: GoodsCategoryTreeNode | null
  editData: GoodsBrand | null
}

export function BrandFormDialog({ open, onClose, category, editData }: Props) {
  const isEdit = Boolean(editData)
  const create = useCreateBrand()
  const update = useUpdateBrand()
  const loading = create.isPending || update.isPending

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: '', logo: '', firstLetter: '', categoryId: category?.id ?? 0, sort: 0, status: 1 },
  })

  const logoValue = useWatch({ control, name: 'logo' })
  const statusValue = useWatch({ control, name: 'status' })
  const uploadedLogoValue = logoValue?.startsWith('http') || logoValue?.startsWith('/') ? [logoValue] : []

  useEffect(() => {
    if (!open) return
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
            categoryId: category?.id ?? 0,
            sort: 0,
            status: 1,
          },
    )
  }, [open, editData, category, reset])

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
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="brand-name">品牌名称</Label>
              <Input id="brand-name" placeholder="如：Apple" disabled={loading} {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="brand-logo">品牌 Logo</Label>
              <div className="flex items-center gap-3">
                <CategoryIcon value={logoValue} name="品牌 Logo" className="size-10 shrink-0" />
                <Input id="brand-logo" placeholder="图片地址（可选）" disabled={loading} {...register('logo')} />
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
              {errors.logo && <p className="text-xs text-destructive">{errors.logo.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-firstLetter">首字母</Label>
              <Input id="brand-firstLetter" placeholder="如：A" maxLength={1} disabled={loading} {...register('firstLetter')} />
              {errors.firstLetter && <p className="text-xs text-destructive">{errors.firstLetter.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-sort">排序</Label>
              <Input id="brand-sort" type="number" min={0} disabled={loading} {...register('sort')} />
              {errors.sort && <p className="text-xs text-destructive">{errors.sort.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-status">状态</Label>
              <SelectControl
                id="brand-status"
                value={String(statusValue ?? 1)}
                onValueChange={(value) =>
                  setValue('status', Number(value) as 0 | 1, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                disabled={loading}
                options={[
                  { value: '1', label: '启用' },
                  { value: '0', label: '停用' },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label>所属分类</Label>
              <div className="flex h-10 items-center rounded-xl border border-border bg-muted/50 px-3 text-sm text-muted-foreground">
                {category?.name ?? '—'}
              </div>
              <input type="hidden" {...register('categoryId')} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              取消
            </Button>
            <Button type="submit" permission={isEdit ? BRAND_UPDATE_CODES : BRAND_CREATE_CODES} disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
