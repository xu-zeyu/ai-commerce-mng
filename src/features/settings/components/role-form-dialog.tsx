'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { roleSchema, type RoleFormValues } from '../schemas/role-schema'
import { useCreateRole, useUpdateRole } from '../hooks/use-roles'
import type { AdminRole } from '../types'

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
    } else {
      await create.mutateAsync(values)
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
            <Input id="description" placeholder="角色描述（可选）" disabled={loading} {...register('description')} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
