'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Permissions } from '@/permissions/rbac'
import { usePermissionList, useDeletePermission } from '../hooks/use-permissions'
import { PermissionFormDialog } from './permission-form-dialog'
import { PermissionTreeList } from './permission-tree-list'
import { buildPermissionTree, filterVisiblePermissions } from '../lib/permission-tree'
import type { AdminPermission } from '../types'

const PERMISSION_MANAGE_CODES = [
  Permissions.PERMISSION_MANAGE,
  Permissions.PERMISSION_MANAGE_LEGACY,
] as const

export function PermissionListView() {
  const { data: permissions, isLoading } = usePermissionList()
  const deleteMutation = useDeletePermission()

  const [formOpen, setFormOpen] = useState(false)
  const [editData, setEditData] = useState<AdminPermission | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminPermission | null>(null)
  const visiblePermissions = filterVisiblePermissions(permissions ?? [])
  const tree = buildPermissionTree(visiblePermissions)

  const handleEdit = (item: AdminPermission) => {
    setEditData(item)
    setFormOpen(true)
  }

  const handleCreate = () => {
    setEditData(null)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex justify-end">
        <Button onClick={handleCreate} permission={PERMISSION_MANAGE_CODES}>
          <Plus className="size-4" />
          新增权限
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : !visiblePermissions.length ? (
        <Card className="flex flex-col items-center justify-center rounded-2xl py-20">
          <p className="mt-4 text-sm text-muted-foreground">暂无权限数据</p>
        </Card>
      ) : (
        <PermissionTreeList
          nodes={tree}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
        />
      )}

      {/* Form Dialog */}
      <PermissionFormDialog open={formOpen} onClose={() => setFormOpen(false)} editData={editData} />

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除权限「{deleteTarget?.name}」吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>取消</Button>
            <Button
              variant="destructive"
              permission={PERMISSION_MANAGE_CODES}
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              删除
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
