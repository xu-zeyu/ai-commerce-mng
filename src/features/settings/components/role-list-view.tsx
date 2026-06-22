'use client'

import { FormEvent, useMemo, useState } from 'react'
import { CloudUpload, Loader2, Plus, RefreshCw, Search, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Permissions } from '@/permissions/rbac'
import { useDeleteRole, useRoleDetail, useRolePage, useSyncPermissions } from '../hooks/use-roles'
import { isProtectedRole } from '../lib/role-guards'
import { DeleteRoleDialog, SyncPermissionsDialog } from './role-confirm-dialogs'
import { RoleFormDialog } from './role-form-dialog'
import { RolePagination } from './role-pagination'
import { RolePermissionDialog } from './role-permission-dialog'
import { RoleTable } from './role-table'
import type { AdminRole } from '../types'

const ROLE_MANAGE_CODES = [
  Permissions.ROLE_MANAGE,
  Permissions.ROLE_MANAGE_LEGACY,
  'ADMIN_ROLE_CREATE',
  'ADMIN_ROLE_UPDATE',
  'ADMIN_ROLE_DELETE',
  'ADMIN_ROLE_ASSIGN_PERMISSION',
  'ADMIN_PERMISSION_SYNC',
] as const

export function RoleListView() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editRoleId, setEditRoleId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminRole | null>(null)
  const [syncOpen, setSyncOpen] = useState(false)
  const [permRole, setPermRole] = useState<AdminRole | null>(null)

  const params = useMemo(
    () => ({ page, size: pageSize, rname: query.trim() || undefined }),
    [page, pageSize, query],
  )
  const { data, isLoading, isFetching, refetch } = useRolePage(params)
  const { data: roleDetail } = useRoleDetail(editRoleId)
  const deleteMutation = useDeleteRole()
  const syncMutation = useSyncPermissions()

  const roles = data?.records ?? []
  const total = data?.total ?? 0
  const formOpen = createOpen || Boolean(editRoleId && roleDetail)

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPage(1)
    setQuery(keyword)
  }

  const handleCreate = () => {
    setEditRoleId(null)
    setCreateOpen(true)
  }

  const handleEdit = (role: AdminRole) => {
    if (isProtectedRole(role)) {
      toast.warning('超级管理员角色不允许编辑')
      return
    }
    setEditRoleId(role.id)
  }

  const handleAssign = (role: AdminRole) => {
    if (isProtectedRole(role)) {
      toast.warning('超级管理员默认拥有所有权限，无需分配')
      return
    }
    setPermRole(role)
  }

  const handleDelete = async () => {
    if (!deleteTarget || isProtectedRole(deleteTarget)) return
    await deleteMutation.mutateAsync(deleteTarget.id)
    toast.success('角色删除成功')
    setDeleteTarget(null)
  }

  const handleSyncPermissions = async () => {
    await syncMutation.mutateAsync()
    toast.success('权限同步成功')
    setSyncOpen(false)
  }

  const handlePageSizeChange = (nextPageSize: number) => {
    setPage(1)
    setPageSize(nextPageSize)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
            <ShieldCheck className="size-5 text-primary" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold">角色管理</h1>
            <p className="mt-1 text-sm text-muted-foreground">管理系统角色、同步权限定义并分配角色权限</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" permission={ROLE_MANAGE_CODES} onClick={() => setSyncOpen(true)}>
            <CloudUpload className="size-4" />
            同步权限
          </Button>
          <Button permission={ROLE_MANAGE_CODES} onClick={handleCreate}>
            <Plus className="size-4" />
            新增角色
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border/70 p-4 lg:flex-row lg:items-center lg:justify-between">
          <form onSubmit={handleSearch} className="flex w-full gap-2 lg:max-w-md">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索角色名称"
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="outline">
              搜索
            </Button>
          </form>
          <Button type="button" variant="ghost" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={isFetching ? 'size-4 animate-spin' : 'size-4'} />
            刷新
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <RoleTable
            roles={roles}
            onAssign={handleAssign}
            onEdit={handleEdit}
            onDelete={(role) => {
              if (isProtectedRole(role)) {
                toast.warning('超级管理员角色不允许删除')
                return
              }
              setDeleteTarget(role)
            }}
          />
        )}
        <RolePagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </Card>

      <RoleFormDialog
        open={formOpen}
        onClose={() => {
          setCreateOpen(false)
          setEditRoleId(null)
        }}
        editData={createOpen ? null : roleDetail ?? null}
      />
      <RolePermissionDialog
        open={!!permRole}
        onClose={() => setPermRole(null)}
        roleId={permRole?.id ?? null}
        roleName={permRole?.rname ?? ''}
      />

      <DeleteRoleDialog
        role={deleteTarget}
        loading={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
      <SyncPermissionsDialog
        open={syncOpen}
        loading={syncMutation.isPending}
        onOpenChange={setSyncOpen}
        onConfirm={handleSyncPermissions}
      />
    </div>
  )
}
