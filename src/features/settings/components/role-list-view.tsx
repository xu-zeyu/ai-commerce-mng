'use client'

import { useState } from 'react'
import { KeyRound, Loader2, LockKeyhole, Pencil, Plus, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Permissions } from '@/permissions/rbac'
import { useRoleList, useDeleteRole } from '../hooks/use-roles'
import { RoleFormDialog } from './role-form-dialog'
import { RolePermissionDialog } from './role-permission-dialog'
import { getRoleDisplayName, isProtectedRole } from '../lib/role-guards'
import type { AdminRole } from '../types'

const ROLE_MANAGE_CODES = [
  Permissions.ROLE_MANAGE,
  Permissions.ROLE_MANAGE_LEGACY,
] as const

export function RoleListView() {
  const { data: roles, isLoading } = useRoleList()
  const deleteMutation = useDeleteRole()

  const [formOpen, setFormOpen] = useState(false)
  const [editData, setEditData] = useState<AdminRole | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminRole | null>(null)
  const [permRole, setPermRole] = useState<AdminRole | null>(null)

  const handleEdit = (item: AdminRole) => {
    if (isProtectedRole(item)) return
    setEditData(item)
    setFormOpen(true)
  }

  const handleCreate = () => {
    setEditData(null)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    if (isProtectedRole(deleteTarget)) return
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
        <Button onClick={handleCreate} permission={ROLE_MANAGE_CODES}>
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
          {roles.map((item) => {
            const protectedRole = isProtectedRole(item)

            return (
              <Card
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                    {protectedRole ? (
                      <LockKeyhole className="size-5 text-primary" />
                    ) : (
                      <Users className="size-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 font-medium">
                      <span>{getRoleDisplayName(item)}</span>
                      {protectedRole && (
                        <Badge variant="secondary" className="rounded-lg">
                          系统内置
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                </div>
                {protectedRole ? (
                  <p className="text-sm text-muted-foreground">超级管理员角色不可查看、编辑或修改权限</p>
                ) : (
                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      permission={ROLE_MANAGE_CODES}
                      onClick={() => setPermRole(item)}
                      title="分配权限"
                    >
                      <KeyRound className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      permission={ROLE_MANAGE_CODES}
                      onClick={() => handleEdit(item)}
                      title="编辑角色"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      permission={ROLE_MANAGE_CODES}
                      onClick={() => setDeleteTarget(item)}
                      title="删除角色"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
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
              确定要删除角色「{deleteTarget ? getRoleDisplayName(deleteTarget) : ''}」吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>取消</Button>
            <Button
              variant="destructive"
              permission={ROLE_MANAGE_CODES}
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
