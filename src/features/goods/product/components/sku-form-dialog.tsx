'use client'

/* eslint-disable @next/next/no-img-element */

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
import { SKU_CREATE_CODES, SKU_UPDATE_CODES } from '../lib/product-permissions'
import { SKU_STATUS_OPTIONS } from '../lib/sku-status'
import { skuSchema, type SkuFormValues } from '../schemas/sku-schema'
import { useCreateProductSku, useUpdateProductSku } from '../hooks/use-product-skus'
import { SKU_STATUS, type ProductSku, type SkuStatus } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  editData: ProductSku | null
  spuId: number
}

const EMPTY_VALUES: SkuFormValues = {
  spuId: 0,
  skuCode: '',
  specInfo: '',
  image: '',
  price: 0,
  originalPrice: undefined,
  stock: 0,
  status: SKU_STATUS.ENABLED,
}

export function SkuFormDialog({ open, onClose, editData, spuId }: Props) {
  const isEdit = Boolean(editData)
  const create = useCreateProductSku()
  const update = useUpdateProductSku()
  const loading = create.isPending || update.isPending

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<SkuFormValues>({
    resolver: zodResolver(skuSchema),
    defaultValues: EMPTY_VALUES,
  })

  const statusValue = useWatch({ control, name: 'status' })
  const imageValue = useWatch({ control, name: 'image' })

  useEffect(() => {
    if (!open) return
    reset(
      editData
        ? {
            spuId: editData.spuId,
            skuCode: editData.skuCode,
            specInfo: editData.specInfo || '',
            image: editData.image || '',
            price: editData.price,
            originalPrice: editData.originalPrice ?? undefined,
            stock: editData.stock,
            status: editData.status,
          }
        : { ...EMPTY_VALUES, spuId },
    )
  }, [open, editData, spuId, reset])

  const onSubmit = async (values: SkuFormValues) => {
    const payload = {
      spuId: values.spuId,
      skuCode: values.skuCode.trim(),
      specInfo: values.specInfo?.trim() || undefined,
      image: values.image?.trim() || undefined,
      price: values.price,
      originalPrice: values.originalPrice || undefined,
      stock: values.stock,
      status: values.status,
    }

    if (editData) {
      await update.mutateAsync({ id: editData.id, ...payload })
      toast.success('SKU 更新成功')
    } else {
      await create.mutateAsync(payload)
      toast.success('SKU 创建成功')
    }
    onClose()
  }

  const handleImageChange = (urls: string[]) => {
    setValue('image', urls[0] || '', { shouldDirty: true, shouldValidate: true })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑 SKU' : '新增 SKU'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* SKU 编码 */}
            <div className="space-y-2">
              <Label htmlFor="sku-code">SKU 编码</Label>
              <Input
                id="sku-code"
                placeholder="如：SKU-2026001"
                disabled={loading}
                {...register('skuCode')}
              />
              {errors.skuCode && (
                <p className="text-xs text-destructive">{errors.skuCode.message}</p>
              )}
            </div>

            {/* 状态 */}
            <div className="space-y-2">
              <Label htmlFor="sku-status">状态</Label>
              <SelectControl
                id="sku-status"
                value={statusValue ?? SKU_STATUS.ENABLED}
                onValueChange={(value) =>
                  setValue('status', value as SkuStatus, { shouldDirty: true, shouldValidate: true })
                }
                disabled={loading}
                options={SKU_STATUS_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                }))}
              />
              {errors.status && (
                <p className="text-xs text-destructive">{errors.status.message}</p>
              )}
            </div>

            {/* 售价 */}
            <div className="space-y-2">
              <Label htmlFor="sku-price">售价（元）</Label>
              <Input
                id="sku-price"
                type="number"
                step="0.01"
                min={0.01}
                placeholder="0.00"
                disabled={loading}
                {...register('price')}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price.message}</p>
              )}
            </div>

            {/* 原价 */}
            <div className="space-y-2">
              <Label htmlFor="sku-originalPrice">原价（元）</Label>
              <Input
                id="sku-originalPrice"
                type="number"
                step="0.01"
                min={0}
                placeholder="可选"
                disabled={loading}
                {...register('originalPrice')}
              />
              {errors.originalPrice && (
                <p className="text-xs text-destructive">{errors.originalPrice.message}</p>
              )}
            </div>

            {/* 库存 */}
            <div className="space-y-2">
              <Label htmlFor="sku-stock">库存</Label>
              <Input
                id="sku-stock"
                type="number"
                min={0}
                placeholder="0"
                disabled={loading}
                {...register('stock')}
              />
              {errors.stock && (
                <p className="text-xs text-destructive">{errors.stock.message}</p>
              )}
            </div>

            {/* 规格信息 */}
            <div className="space-y-2">
              <Label htmlFor="sku-specInfo">规格信息</Label>
              <Input
                id="sku-specInfo"
                placeholder="如：红色/XL（可选）"
                disabled={loading}
                {...register('specInfo')}
              />
              {errors.specInfo && (
                <p className="text-xs text-destructive">{errors.specInfo.message}</p>
              )}
            </div>

            {/* SKU 图片 */}
            <div className="space-y-2 sm:col-span-2">
              <Label>SKU 图片</Label>
              {imageValue ? (
                <div className="flex items-center gap-3">
                  <img
                    src={imageValue}
                    alt="SKU 图片"
                    className="size-20 rounded-xl object-cover shadow-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setValue('image', '', { shouldDirty: true, shouldValidate: true })
                    }
                    disabled={loading}
                  >
                    移除
                  </Button>
                </div>
              ) : (
                <FileUpload
                  value={[]}
                  onChange={handleImageChange}
                  multiple={false}
                  maxFiles={1}
                  disabled={loading}
                  emptyTitle="上传 SKU 图片"
                  emptyDescription="仅支持一张 · 不超过 8 MB"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              取消
            </Button>
            <Button
              type="submit"
              permission={isEdit ? SKU_UPDATE_CODES : SKU_CREATE_CODES}
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
