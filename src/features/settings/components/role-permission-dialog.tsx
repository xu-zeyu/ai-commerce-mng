'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { usePermissionList } from '../hooks/use-permissions'
import { useRolePermissions, useAssignRolePermissions } from '../hooks/use-roles'
import { buildPermissionTree } from '../lib/permission-tree'
import { PermissionTreeChecklist } from './permission-tree-checklist'
import type { PermissionTreeNode } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  roleId: number | null
  roleName: string
}

export function RolePermissionDialog({ open, onClose, roleId, roleName }: Props) {
  const { data: allPermissions, isLoading: loadingAll } = usePermissionList()
  const { data: rolePermissions, isLoading: loadingRole } = useRolePermissions(roleId)
  const assign = useAssignRolePermissions()

  const [selected, setSelected] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (rolePermissions) {
      setSelected(new Set(rolePermissions.map((p) => p.id)))
    }
  }, [rolePermissions])

  const loading = loadingAll || loadingRole
  const tree = buildPermissionTree(allPermissions ?? [])

  const handleToggle = (node: PermissionTreeNode) => {
    setSelected((prev) => {
      const next = new Set(prev)
      const allSelected = node.permissionIds.every((id) => next.has(id))
      node.permissionIds.forEach((id) => {
        if (allSelected) next.delete(id)
        else next.add(id)
      })
      return next
    })
  }

  const handleSave = async () => {
    if (!roleId) return
    await assign.mutateAsync({ roleId, permissionIds: Array.from(selected) })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>分配权限 — {roleName}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-2">
            <PermissionTreeChecklist nodes={tree} selected={selected} onToggle={handleToggle} />
            {!allPermissions?.length && (
              <p className="text-center text-sm text-muted-foreground py-6">暂无可分配的权限</p>
            )}
          </div>
        )}
        <div className="flex justify-end gap-3 pt-3 border-t">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleSave} disabled={assign.isPending || loading}>
            {assign.isPending && <Loader2 className="size-4 animate-spin" />}
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
