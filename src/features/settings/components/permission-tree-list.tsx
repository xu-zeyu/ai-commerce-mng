'use client'

import { ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Permissions } from '@/permissions/rbac'
import type { AdminPermission, PermissionTreeNode } from '../types'

const PERMISSION_MANAGE_CODES = [
  Permissions.PERMISSION_MANAGE,
  Permissions.PERMISSION_MANAGE_LEGACY,
] as const

interface PermissionTreeListProps {
  nodes: PermissionTreeNode[]
  onEdit: (permission: AdminPermission) => void
  onDelete: (permission: AdminPermission) => void
}

interface PermissionNodeRowProps {
  node: PermissionTreeNode
  depth: number
  onEdit: (permission: AdminPermission) => void
  onDelete: (permission: AdminPermission) => void
}

function PermissionNodeRow({ node, depth, onEdit, onDelete }: PermissionNodeRowProps) {
  const hasChildren = node.children.length > 0
  const permission = node.permission
  const indent = depth * 18

  const row = (
    <div
      className="group flex min-h-12 items-center gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-muted/50"
      style={{ paddingLeft: indent + 8 }}
    >
      {hasChildren ? (
        <CollapsibleTrigger className="group/trigger flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground">
          <ChevronRight className="size-4 transition-transform group-data-[state=open]/trigger:rotate-90" />
        </CollapsibleTrigger>
      ) : (
        <span className="size-7 shrink-0" />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">{node.label}</span>
          {hasChildren ? (
            <span className="shrink-0 text-xs text-muted-foreground">
              {node.permissionIds.length} 项
            </span>
          ) : (
            <Badge variant="secondary" className="min-w-0 truncate font-mono text-[11px]">
              {permission?.code ?? node.code}
            </Badge>
          )}
        </div>
      </div>

      {permission && (
        <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            permission={PERMISSION_MANAGE_CODES}
            onClick={() => onEdit(permission)}
            title="编辑权限"
            className="size-8"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            permission={PERMISSION_MANAGE_CODES}
            onClick={() => onDelete(permission)}
            title="删除权限"
            className="size-8"
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      )}
    </div>
  )

  if (!hasChildren) {
    return row
  }

  return (
    <Collapsible defaultOpen>
      <div>
        {row}
        <CollapsibleContent
          className="relative space-y-1 before:absolute before:bottom-1 before:top-1 before:w-px before:bg-border/70"
          style={{ marginLeft: indent + 21 }}
        >
          {node.children.map((child) => (
            <PermissionNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

export function PermissionTreeList({ nodes, onEdit, onDelete }: PermissionTreeListProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 p-2 shadow-sm">
      {nodes.map((node) => (
        <PermissionNodeRow
          key={node.id}
          node={node}
          depth={0}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
