'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, Users, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useRoleList, useDeleteRole } from '../hooks/use-roles'
import { RoleFormDialog } from './role-form-dialog'
import { RolePermissionDialog } from './role-permission-dialog'
import type { AdminRole } from '../types'

export function RoleListView() {
  const { data: roles, isLoading } = useRoleList()
  const deleteMutation = useDeleteRole()

  const [formOpen, setFormOpen] = useState(false)
  const [editData, setEditData] = useState<AdminRole | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminRole | null>(null)
  const [permRole, setPermRole] = useState<AdminRole | null>(null)

  const handleEdit = (item: AdminRole) => {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">角色管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">管理系统角色与权限分配</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="size-4" />
          新增角色
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : !roles?.length ? (
        <Card className="flex flex-col items-center justify-center py-20 rounded-2xl">
          <Users className="size-12 text-muted-foreground/30" />
          <p className="mt-4 text-sm text-muted-foreground">暂无角色数据</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {roles.map((item) => (
            <Card key={item.id} className="flex items-center justify-between p-4 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{item.rname}</div>
                  {item.description && (
                    <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => setPermRole(item)} title="分配权限">
                  <KeyRound className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(item)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <RoleFormDialog open={formOpen} onClose={() => setFormOpen(false)} editData={editData} />

      {/* Permission Dialog */}
      <RolePermissionDialog
        open={!!permRole}
        onClose={() => setPermRole(null)}
        roleId={permRole?.id ?? null}
        roleName={permRole?.rname ?? ''}
      />

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除角色「{deleteTarget?.rname}」吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              删除
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
