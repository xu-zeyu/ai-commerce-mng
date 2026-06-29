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
import { PRODUCT_CREATE_CODES, PRODUCT_UPDATE_CODES } from '../lib/product-permissions'
import { PRODUCT_FORM_SALE_STATUS_OPTIONS, toFormSaleStatus } from '../lib/product-status'
import { productSchema, type ProductFormValues } from '../schemas/product-schema'
import { useCreateProduct, useUpdateProduct } from '../hooks/use-products'
import {
  useSupplierOptions,
  useBrandOptions,
  useCategoryOptions,
} from '../hooks/use-product-options'
import { useSupplierBrandAutoFill } from '../hooks/use-supplier-brand-autofill'
import type { ProductSpu } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  editData: ProductSpu | null
}

const EMPTY_VALUES: ProductFormValues = {
  supplierId: 0,
  spuCode: '',
  name: '',
  subTitle: '',
  categoryId: 0,
  brandId: 0,
  saleStatus: 1,
  sort: 0,
}

export function ProductFormDialog({ open, onClose, editData }: Props) {
  const isEdit = Boolean(editData)
  const create = useCreateProduct()
  const update = useUpdateProduct()
  const loading = create.isPending || update.isPending

  const supplierQuery = useSupplierOptions()
  const brandQuery = useBrandOptions()
  const categoryQuery = useCategoryOptions()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: EMPTY_VALUES,
  })

  const supplierIdValue = useWatch({ control, name: 'supplierId' })
  const categoryIdValue = useWatch({ control, name: 'categoryId' })
  const brandIdValue = useWatch({ control, name: 'brandId' })
  const saleStatusValue = useWatch({ control, name: 'saleStatus' })

  // 新增模式：根据供应商自动填充品牌/分类
  const effectiveSupplierId = isEdit ? 0 : supplierIdValue
  const autoFill = useSupplierBrandAutoFill(effectiveSupplierId)

  // 自动填充品牌和分类（仅新增模式）
  useEffect(() => {
    if (isEdit) return
    if (effectiveSupplierId <= 0) {
      setValue('brandId', 0, { shouldValidate: true })
      setValue('categoryId', 0, { shouldValidate: true })
      return
    }
    if (autoFill.firstBrandId != null) {
      setValue('brandId', autoFill.firstBrandId, { shouldValidate: true })
    }
    if (autoFill.firstCategoryId != null) {
      setValue('categoryId', autoFill.firstCategoryId, { shouldValidate: true })
    }
  }, [autoFill.firstBrandId, autoFill.firstCategoryId, effectiveSupplierId, isEdit, setValue])

  const setNumberField = (
    name: 'supplierId' | 'categoryId' | 'brandId' | 'saleStatus',
    value: string,
  ) => {
    setValue(name, Number(value), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  useEffect(() => {
    if (!open) return
    reset(
      editData
        ? {
            supplierId: editData.supplierId,
            spuCode: editData.spuCode,
            name: editData.name,
            subTitle: editData.subTitle || '',
            categoryId: editData.categoryId,
            brandId: editData.brandId,
            saleStatus: toFormSaleStatus(editData.saleStatus),
            sort: editData.sort ?? 0,
          }
        : EMPTY_VALUES,
    )
  }, [open, editData, reset])

  const onSubmit = async (values: ProductFormValues) => {
    const payload = {
      supplierId: values.supplierId,
      spuCode: values.spuCode.trim(),
      name: values.name.trim(),
      subTitle: values.subTitle?.trim() || undefined,
      categoryId: values.categoryId,
      brandId: values.brandId,
      saleStatus: values.saleStatus,
      sort: values.sort,
    }

    if (editData) {
      await update.mutateAsync({ id: editData.id, ...payload })
      toast.success('商品更新成功')
    } else {
      await create.mutateAsync(payload)
      toast.success('商品创建成功')
    }
    onClose()
  }

  // 新增模式下品牌选项来自供应商关联，编辑模式保留全部品牌
  const brandOptions = isEdit ? (brandQuery.data ?? []) : autoFill.brandOptions
  const isBrandLocked = !isEdit && effectiveSupplierId > 0
  const isCategoryLocked = !isEdit && effectiveSupplierId > 0

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑商品' : '新增商品'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 供应商 */}
            <div className="space-y-2">
              <Label htmlFor="product-supplierId">供应商</Label>
              <SelectControl
                id="product-supplierId"
                value={String(supplierIdValue ?? 0)}
                onValueChange={(value) => setNumberField('supplierId', value)}
                disabled={loading || supplierQuery.isLoading}
                options={[
                  { value: '0', label: '请选择供应商' },
                  ...(supplierQuery.data?.map((s) => ({
                    value: String(s.id),
                    label: s.label,
                  })) ?? []),
                ]}
              />
              {errors.supplierId && (
                <p className="text-xs text-destructive">{errors.supplierId.message}</p>
              )}
            </div>

            {/* SPU编码 */}
            <div className="space-y-2">
              <Label htmlFor="product-spuCode">SPU编码</Label>
              <Input
                id="product-spuCode"
                placeholder="如：SPU-2026001"
                disabled={loading}
                {...register('spuCode')}
              />
              {errors.spuCode && (
                <p className="text-xs text-destructive">{errors.spuCode.message}</p>
              )}
            </div>

            {/* 商品名称 */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="product-name">商品名称</Label>
              <Input
                id="product-name"
                placeholder="如：金晗优选坚果礼盒"
                disabled={loading}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* 商品副标题 */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="product-subTitle">商品副标题</Label>
              <Input
                id="product-subTitle"
                placeholder="一句话描述商品卖点（可选）"
                disabled={loading}
                {...register('subTitle')}
              />
              {errors.subTitle && (
                <p className="text-xs text-destructive">{errors.subTitle.message}</p>
              )}
            </div>

            {/* 分类 */}
            <div className="space-y-2">
              <Label htmlFor="product-categoryId">分类</Label>
              <SelectControl
                id="product-categoryId"
                value={String(categoryIdValue ?? 0)}
                onValueChange={(value) => setNumberField('categoryId', value)}
                disabled={loading || categoryQuery.isLoading || isCategoryLocked}
                options={[
                  { value: '0', label: '请选择分类' },
                  ...(categoryQuery.data?.map((c) => ({
                    value: String(c.id),
                    label: c.label,
                  })) ?? []),
                ]}
              />
              {isCategoryLocked && (
                <p className="text-xs text-muted-foreground">已根据供应商自动选择分类</p>
              )}
              {errors.categoryId && (
                <p className="text-xs text-destructive">{errors.categoryId.message}</p>
              )}
            </div>

            {/* 品牌 */}
            <div className="space-y-2">
              <Label htmlFor="product-brandId">品牌</Label>
              <SelectControl
                id="product-brandId"
                value={String(brandIdValue ?? 0)}
                onValueChange={(value) => setNumberField('brandId', value)}
                disabled={loading || isBrandLocked || autoFill.isLoading}
                options={[
                  { value: '0', label: '请选择品牌' },
                  ...(brandOptions.map((b) => ({
                    value: String(b.id),
                    label: b.label,
                  }))),
                ]}
              />
              {isBrandLocked && (
                <p className="text-xs text-muted-foreground">已根据供应商自动选择品牌</p>
              )}
              {errors.brandId && (
                <p className="text-xs text-destructive">{errors.brandId.message}</p>
              )}
            </div>

            {/* 销售状态 */}
            <div className="space-y-2">
              <Label htmlFor="product-saleStatus">销售状态</Label>
              <SelectControl
                id="product-saleStatus"
                value={String(saleStatusValue ?? 1)}
                onValueChange={(value) => setNumberField('saleStatus', value)}
                disabled={loading}
                options={PRODUCT_FORM_SALE_STATUS_OPTIONS.map((opt) => ({
                  value: String(opt.value),
                  label: opt.label,
                }))}
              />
              {errors.saleStatus && (
                <p className="text-xs text-destructive">{errors.saleStatus.message}</p>
              )}
            </div>

            {/* 排序 */}
            <div className="space-y-2">
              <Label htmlFor="product-sort">排序</Label>
              <Input
                id="product-sort"
                type="number"
                min={0}
                disabled={loading}
                {...register('sort')}
              />
              {errors.sort && (
                <p className="text-xs text-destructive">{errors.sort.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              取消
            </Button>
            <Button
              type="submit"
              permission={isEdit ? PRODUCT_UPDATE_CODES : PRODUCT_CREATE_CODES}
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
