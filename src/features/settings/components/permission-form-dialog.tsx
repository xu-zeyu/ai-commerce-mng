'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Permissions } from '@/permissions/rbac'
import { permissionSchema, type PermissionFormValues } from '../schemas/permission-schema'
import { useCreatePermission, useUpdatePermission } from '../hooks/use-permissions'
import type { AdminPermission } from '../types'

const PERMISSION_MANAGE_CODES = [
  Permissions.PERMISSION_MANAGE,
  Permissions.PERMISSION_MANAGE_LEGACY,
] as const

interface Props {
  open: boolean
  onClose: () => void
  editData?: AdminPermission | null
}

export function PermissionFormDialog({ open, onClose, editData }: Props) {
  const isEdit = !!editData
  const create = useCreatePermission()
  const update = useUpdatePermission()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
  })

  useEffect(() => {
    if (open) {
      reset(editData ? { name: editData.name, code: editData.code } : { name: '', code: '' })
    }
  }, [open, editData, reset])

  const loading = create.isPending || update.isPending

  const onSubmit = async (values: PermissionFormValues) => {
    if (isEdit) {
      await update.mutateAsync({ id: editData!.id, ...values })
    } else {
      await create.mutateAsync(values)
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑权限' : '新增权限'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">权限名称</Label>
            <Input id="name" placeholder="如：商品管理" disabled={loading} {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">权限编码</Label>
            <Input id="code" placeholder="如：product:manage" disabled={loading} {...register('code')} />
            {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              取消
            </Button>
            <Button type="submit" permission={PERMISSION_MANAGE_CODES} disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
