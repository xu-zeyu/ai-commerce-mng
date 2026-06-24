'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SUPPLIER_CREATE_CODES, SUPPLIER_UPDATE_CODES } from '../lib/supplier-permissions'
import { supplierSchema, type SupplierFormValues } from '../schemas/supplier-schema'
import { useCreateSupplier, useUpdateSupplier } from '../hooks/use-suppliers'
import type { CreateSupplierPayload, Supplier } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  editData: Supplier | null
}

const EMPTY_VALUES: SupplierFormValues = {
  supplierCode: '',
  supplierName: '',
  contactName: '',
  contactPhone: '',
  email: '',
  address: '',
  status: 1,
  remark: '',
}

function optionalValue(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed || undefined
}

function toPayload(values: SupplierFormValues): CreateSupplierPayload {
  return {
    supplierCode: values.supplierCode.trim(),
    supplierName: values.supplierName.trim(),
    contactName: optionalValue(values.contactName),
    contactPhone: optionalValue(values.contactPhone),
    email: optionalValue(values.email),
    address: optionalValue(values.address),
    status: values.status,
    remark: optionalValue(values.remark),
  }
}

export function SupplierFormDialog({ open, onClose, editData }: Props) {
  const isEdit = Boolean(editData)
  const create = useCreateSupplier()
  const update = useUpdateSupplier()
  const loading = create.isPending || update.isPending

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (!open) return
    reset(
      editData
        ? {
            supplierCode: editData.supplierCode || '',
            supplierName: editData.supplierName,
            contactName: editData.contactName || '',
            contactPhone: editData.contactPhone || '',
            email: editData.email || '',
            address: editData.address || '',
            status: editData.status,
            remark: editData.remark || '',
          }
        : EMPTY_VALUES,
    )
  }, [open, editData, reset])

  const onSubmit = async (values: SupplierFormValues) => {
    const payload = toPayload(values)

    if (editData) {
      await update.mutateAsync({ id: editData.id, ...payload })
      toast.success('供应商更新成功')
    } else {
      await create.mutateAsync(payload)
      toast.success('供应商创建成功')
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑供应商' : '新增供应商'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supplier-code">供应商编码</Label>
              <Input id="supplier-code" placeholder="如：SUP-2026001" disabled={loading} {...register('supplierCode')} />
              {errors.supplierCode && <p className="text-xs text-destructive">{errors.supplierCode.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier-name">供应商名称</Label>
              <Input id="supplier-name" placeholder="如：金晗优选供应链" disabled={loading} {...register('supplierName')} />
              {errors.supplierName && <p className="text-xs text-destructive">{errors.supplierName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-name">联系人</Label>
              <Input id="contact-name" placeholder="联系人姓名" disabled={loading} {...register('contactName')} />
              {errors.contactName && <p className="text-xs text-destructive">{errors.contactName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">联系电话</Label>
              <Input id="contact-phone" placeholder="手机号或座机" disabled={loading} {...register('contactPhone')} />
              {errors.contactPhone && <p className="text-xs text-destructive">{errors.contactPhone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier-email">邮箱</Label>
              <Input id="supplier-email" placeholder="contact@example.com" disabled={loading} {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier-status">状态</Label>
              <select
                id="supplier-status"
                disabled={loading}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register('status')}
              >
                <option value={1}>启用</option>
                <option value={0}>停用</option>
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="supplier-address">地址</Label>
              <textarea
                id="supplier-address"
                placeholder="供应商地址（可选）"
                disabled={loading}
                className="min-h-20 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register('address')}
              />
              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="supplier-remark">备注</Label>
              <textarea
                id="supplier-remark"
                placeholder="合作范围、账期或其他备注（可选）"
                disabled={loading}
                className="min-h-20 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register('remark')}
              />
              {errors.remark && <p className="text-xs text-destructive">{errors.remark.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              取消
            </Button>
            <Button type="submit" permission={isEdit ? SUPPLIER_UPDATE_CODES : SUPPLIER_CREATE_CODES} disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
