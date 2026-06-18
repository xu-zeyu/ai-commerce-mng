'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { usePermissionList, useDeletePermission } from '../hooks/use-permissions'
import { PermissionFormDialog } from './permission-form-dialog'
import type { AdminPermission } from '../types'

export function PermissionListView() {
  const { data: permissions, isLoading } = usePermissionList()
  const deleteMutation = useDeletePermission()

  const [formOpen, setFormOpen] = useState(false)
  const [editData, setEditData] = useState<AdminPermission | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminPermission | null>(null)

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">权限管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">管理系统权限编码</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="size-4" />
          新增权限
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : !permissions?.length ? (
        <Card className="flex flex-col items-center justify-center py-20 rounded-2xl">
          <Shield className="size-12 text-muted-foreground/30" />
          <p className="mt-4 text-sm text-muted-foreground">暂无权限数据</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {permissions.map((item) => (
            <Card key={item.id} className="flex items-center justify-between p-4 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <Badge variant="secondary" className="mt-1 font-mono text-xs">
                    {item.code}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
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
