'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Permissions } from '@/permissions/rbac'
import { roleSchema, type RoleFormValues } from '../schemas/role-schema'
import { useCreateRole, useUpdateRole } from '../hooks/use-roles'
import type { AdminRole } from '../types'

const ROLE_MANAGE_CODES = [
  Permissions.ROLE_MANAGE,
  Permissions.ROLE_MANAGE_LEGACY,
  'ADMIN_ROLE_CREATE',
  'ADMIN_ROLE_UPDATE',
] as const

interface Props {
  open: boolean
  onClose: () => void
  editData?: AdminRole | null
}

export function RoleFormDialog({ open, onClose, editData }: Props) {
  const isEdit = !!editData
  const create = useCreateRole()
  const update = useUpdateRole()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
  })

  useEffect(() => {
    if (open) {
      reset(
        editData
          ? { rname: editData.rname, description: editData.description || '' }
          : { rname: '', description: '' },
      )
    }
  }, [open, editData, reset])

  const loading = create.isPending || update.isPending

  const onSubmit = async (values: RoleFormValues) => {
    if (isEdit) {
      await update.mutateAsync({ id: editData!.id, ...values })
      toast.success('角色更新成功')
    } else {
      await create.mutateAsync(values)
      toast.success('角色创建成功')
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑角色' : '新增角色'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="rname">角色名称</Label>
            <Input id="rname" placeholder="如：运营管理员" disabled={loading} {...register('rname')} />
            {errors.rname && <p className="text-xs text-destructive">{errors.rname.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <textarea
              id="description"
              placeholder="角色描述（可选）"
              disabled={loading}
              className="min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('description')}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              取消
            </Button>
            <Button type="submit" permission={ROLE_MANAGE_CODES} disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
