'use client'

import { useMemo } from 'react'
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { KeyRound, LockKeyhole, Pencil, ShieldCheck, Trash2, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
        {protectedRole ? (
          <LockKeyhole className="size-5 text-primary" />
        ) : (
          <Users className="size-5 text-primary" />
        )}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-medium">{getRoleDisplayName(role)}</span>
          {protectedRole && (
            <Badge variant="secondary" className="rounded-lg">
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
    return <span className="text-sm text-muted-foreground">默认拥有全部权限</span>
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

export function RoleTable({ roles, onAssign, onEdit, onDelete }: RoleTableProps) {
  const columns = useMemo<ColumnDef<AdminRole>[]>(
    () => [
      { accessorKey: 'id', header: 'ID', cell: ({ row }) => row.original.id },
      { accessorKey: 'rname', header: '角色名称', cell: ({ row }) => <RoleNameCell role={row.original} /> },
      {
        accessorKey: 'description',
        header: '描述',
        cell: ({ row }) => row.original.description || <span className="text-muted-foreground">-</span>,
      },
      { accessorKey: 'createdTime', header: '创建时间', cell: ({ row }) => formatDate(row.original.createdTime) },
      { accessorKey: 'updatedTime', header: '更新时间', cell: ({ row }) => formatDate(row.original.updatedTime) },
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
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table manages its own memoized table instance.
  const table = useReactTable({ data: roles, columns, getCoreRowModel: getCoreRowModel() })

  if (!roles.length) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <ShieldCheck className="size-12 text-muted-foreground/30" />
        <p className="mt-4 text-sm text-muted-foreground">暂无角色数据</p>
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid gap-3 p-4 md:hidden">
        {roles.map((role) => (
          <Card key={role.id} className="p-4">
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
        ))}
      </div>
    </>
  )
}
