'use client'

import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { KeyRound, LockKeyhole, Pencil, ShieldCheck, Trash2, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/common/data-table'
import { Permissions } from '@/permissions/rbac'
import { getRoleDisplayName, isProtectedRole } from '../lib/role-guards'
import type { AdminRole } from '../types'

const ROLE_MANAGE_CODES = [
  Permissions.ROLE_MANAGE,
  Permissions.ROLE_MANAGE_LEGACY,
  'ADMIN_ROLE_UPDATE',
  'ADMIN_ROLE_DELETE',
  'ADMIN_ROLE_ASSIGN_PERMISSION',
] as const

interface RoleTableProps {
  roles: AdminRole[]
  loading?: boolean
  onAssign: (role: AdminRole) => void
  onEdit: (role: AdminRole) => void
  onDelete: (role: AdminRole) => void
}

interface RoleActionsProps {
  role: AdminRole
  onAssign: (role: AdminRole) => void
  onEdit: (role: AdminRole) => void
  onDelete: (role: AdminRole) => void
}

function formatDate(value?: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', { hour12: false })
}

function RoleNameCell({ role }: { role: AdminRole }) {
  const protectedRole = isProtectedRole(role)

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        {protectedRole ? (
          <LockKeyhole className="size-4.5 text-primary" />
        ) : (
          <Users className="size-4.5 text-primary" />
        )}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-medium">{getRoleDisplayName(role)}</span>
          {protectedRole && (
            <Badge variant="secondary" className="rounded-md text-[11px]">
              系统内置
            </Badge>
          )}
        </div>
        {role.description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{role.description}</p>
        )}
      </div>
    </div>
  )
}

function RoleActions({ role, onAssign, onEdit, onDelete }: RoleActionsProps) {
  if (isProtectedRole(role)) {
    return <span className="text-xs text-muted-foreground">默认拥有全部权限</span>
  }

  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        permission={ROLE_MANAGE_CODES}
        onClick={() => onAssign(role)}
        title="分配权限"
      >
        <KeyRound className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        permission={ROLE_MANAGE_CODES}
        onClick={() => onEdit(role)}
        title="编辑角色"
      >
        <Pencil className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        permission={ROLE_MANAGE_CODES}
        onClick={() => onDelete(role)}
        title="删除角色"
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </div>
  )
}

function RoleEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <ShieldCheck className="size-10 text-muted-foreground/30" />
      <p className="mt-3 text-sm text-muted-foreground">暂无角色数据</p>
    </div>
  )
}

export function RoleTable({ roles, loading, onAssign, onEdit, onDelete }: RoleTableProps) {
  const columns = useMemo<ColumnDef<AdminRole>[]>(
    () => [
      { accessorKey: 'id', header: 'ID', cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.id}</span> },
      { accessorKey: 'rname', header: '角色名称', cell: ({ row }) => <RoleNameCell role={row.original} /> },
      { accessorKey: 'createdTime', header: '创建时间', cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.createdTime)}</span> },
      { accessorKey: 'updatedTime', header: '更新时间', cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.updatedTime)}</span> },
      {
        id: 'operation',
        header: () => <span className="block text-right">操作</span>,
        cell: ({ row }) => (
          <RoleActions role={row.original} onAssign={onAssign} onEdit={onEdit} onDelete={onDelete} />
        ),
      },
    ],
    [onAssign, onDelete, onEdit],
  )

  return (
    <DataTable
      columns={columns}
      data={roles}
      loading={loading}
      getRowId={(role) => String(role.id)}
      empty={<RoleEmpty />}
      renderMobileCard={(role) => (
        <Card className="p-4">
          <div className="flex items-start justify-between gap-3">
            <RoleNameCell role={role} />
            <RoleActions role={role} onAssign={onAssign} onEdit={onEdit} onDelete={onDelete} />
          </div>
          <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
            <span>ID：{role.id}</span>
            <span>创建时间：{formatDate(role.createdTime)}</span>
            <span>更新时间：{formatDate(role.updatedTime)}</span>
          </div>
        </Card>
      )}
    />
  )
}
