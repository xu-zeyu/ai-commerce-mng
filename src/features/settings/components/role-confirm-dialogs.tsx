'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Permissions } from '@/permissions/rbac'
import { getRoleDisplayName } from '../lib/role-guards'
import type { AdminRole } from '../types'

const ROLE_MANAGE_CODES = [
  Permissions.ROLE_MANAGE,
  Permissions.ROLE_MANAGE_LEGACY,
  'ADMIN_ROLE_DELETE',
  'ADMIN_PERMISSION_SYNC',
] as const

interface DeleteRoleDialogProps {
  role: AdminRole | null
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

interface SyncPermissionsDialogProps {
  open: boolean
  loading: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteRoleDialog({ role, loading, onClose, onConfirm }: DeleteRoleDialogProps) {
  return (
    <Dialog open={!!role} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            确定要删除角色「{role ? getRoleDisplayName(role) : ''}」吗？此操作不可撤销。
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button variant="destructive" permission={ROLE_MANAGE_CODES} onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            删除
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function SyncPermissionsDialog({
  open,
  loading,
  onOpenChange,
  onConfirm,
}: SyncPermissionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>同步权限到后端</DialogTitle>
          <DialogDescription>
            将当前前端定义的权限模块、页面和操作同步到后端权限表。
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>取消</Button>
          <Button permission={ROLE_MANAGE_CODES} onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            同步
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
