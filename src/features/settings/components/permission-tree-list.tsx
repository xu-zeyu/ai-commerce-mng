'use client'

import { ChevronRight, Pencil, Shield, Trash2 } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { AdminPermission, PermissionTreeNode } from '../types'

interface PermissionTreeListProps {
  nodes: PermissionTreeNode[]
  onEdit: (permission: AdminPermission) => void
  onDelete: (permission: AdminPermission) => void
}

interface PermissionNodeRowProps {
  node: PermissionTreeNode
  onEdit: (permission: AdminPermission) => void
  onDelete: (permission: AdminPermission) => void
}

function PermissionNodeRow({ node, onEdit, onDelete }: PermissionNodeRowProps) {
  const hasChildren = node.children.length > 0
  const permission = node.permission

  const content = (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Shield className="size-4 text-primary" />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{node.label}</span>
          <Badge variant="secondary" className="font-mono text-[11px]">
            {permission?.code ?? node.code}
          </Badge>
        </div>
        {hasChildren && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {node.permissionIds.length} 个权限
          </p>
        )}
      </div>
    </div>
  )

  if (!hasChildren) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/70 p-3 shadow-sm">
        {content}
        {permission && (
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(permission)}>
              <Pencil className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(permission)}>
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <Collapsible defaultOpen>
      <div className="rounded-2xl border border-border/60 bg-card/70 p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger className="flex size-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <ChevronRight className="size-4 transition-transform data-[state=open]:rotate-90" />
          </CollapsibleTrigger>
          {content}
          {permission && (
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(permission)}>
                <Pencil className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(permission)}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          )}
        </div>
        <CollapsibleContent className="mt-3 space-y-2 border-l border-border/60 pl-4">
          {node.children.map((child) => (
            <PermissionNodeRow
              key={child.id}
              node={child}
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
    <div className="grid gap-3">
      {nodes.map((node) => (
        <PermissionNodeRow
          key={node.id}
          node={node}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
