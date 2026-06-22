'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Permissions } from '@/permissions/rbac'
import { usePermissionList } from '../hooks/use-permissions'
import { useRolePermissions, useAssignRolePermissions } from '../hooks/use-roles'
import {
  buildRolePermissionTree,
  convertCheckedCodesToPermissionIds,
  getAssignedPermissionCodes,
} from '../lib/admin-permissions'
import { PermissionTreeChecklist } from './permission-tree-checklist'
import type { AdminPermission, RolePermissionTreeNode } from '../types'

const ROLE_MANAGE_CODES = [
  Permissions.ROLE_MANAGE,
  Permissions.ROLE_MANAGE_LEGACY,
  'ADMIN_ROLE_ASSIGN_PERMISSION',
] as const

interface Props {
  open: boolean
  onClose: () => void
  roleId: number | null
  roleName: string
}

interface RolePermissionEditorProps {
  allPermissions: AdminPermission[]
  initialSelectedCodes: string[]
  saving: boolean
  tree: RolePermissionTreeNode[]
  onClose: () => void
  onSave: (permissionIds: number[]) => Promise<void>
}

function RolePermissionEditor({
  allPermissions,
  initialSelectedCodes,
  saving,
  tree,
  onClose,
  onSave,
}: RolePermissionEditorProps) {
  const [selected, setSelected] = useState(() => new Set(initialSelectedCodes))
  const handleToggle = (node: RolePermissionTreeNode) => {
    setSelected((prev) => {
      const next = new Set(prev)
      const allSelected = node.permissionCodes.every((code) => next.has(code))
      node.permissionCodes.forEach((code) => {
        if (allSelected) next.delete(code)
        else next.add(code)
      })
      return next
    })
  }

  const handleSave = async () => {
    const permissionIds = convertCheckedCodesToPermissionIds(Array.from(selected), allPermissions ?? [])
    await onSave(permissionIds)
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto py-2">
        <PermissionTreeChecklist nodes={tree} selected={selected} onToggle={handleToggle} />
        {!allPermissions.length && (
          <p className="px-2 pt-3 text-sm text-muted-foreground">
            后端暂无权限数据，请先在角色管理页同步权限。
          </p>
        )}
      </div>
      <div className="flex justify-end gap-3 pt-3 border-t">
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button
          permission={ROLE_MANAGE_CODES}
          onClick={handleSave}
          disabled={saving || !allPermissions.length}
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          保存
        </Button>
      </div>
    </>
  )
}

export function RolePermissionDialog({ open, onClose, roleId, roleName }: Props) {
  const { data: allPermissions, isLoading: loadingAll } = usePermissionList()
  const { data: rolePermissions, isLoading: loadingRole } = useRolePermissions(roleId)
  const assign = useAssignRolePermissions()

  const loading = loadingAll || loadingRole
  const tree = buildRolePermissionTree()
  const initialSelectedCodes = rolePermissions ? getAssignedPermissionCodes(rolePermissions) : []
  const editorKey = `${roleId ?? 'empty'}:${initialSelectedCodes.join(',')}`
  const canEdit = roleId !== null && !loading

  const handleSave = async (permissionIds: number[]) => {
    if (!roleId) return
    await assign.mutateAsync({ roleId, permissionIds })
    toast.success('权限分配成功')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>分配权限 — {roleName}</DialogTitle>
        </DialogHeader>
        {!canEdit ? (
          <div className="flex flex-1 justify-center py-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <RolePermissionEditor
            key={editorKey}
            allPermissions={allPermissions ?? []}
            initialSelectedCodes={initialSelectedCodes}
            saving={assign.isPending}
            tree={tree}
            onClose={onClose}
            onSave={handleSave}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
