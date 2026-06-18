'use client'

import { ChevronRight, Shield } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { PermissionTreeNode } from '../types'

interface PermissionTreeChecklistProps {
  nodes: PermissionTreeNode[]
  selected: Set<number>
  onToggle: (node: PermissionTreeNode) => void
}

function getCheckedState(node: PermissionTreeNode, selected: Set<number>) {
  const selectedCount = node.permissionIds.filter((id) => selected.has(id)).length
  if (selectedCount === 0) return false
  if (selectedCount === node.permissionIds.length) return true
  return 'indeterminate'
}

interface PermissionCheckNodeProps {
  node: PermissionTreeNode
  selected: Set<number>
  onToggle: (node: PermissionTreeNode) => void
}

function PermissionCheckNode({ node, selected, onToggle }: PermissionCheckNodeProps) {
  const hasChildren = node.children.length > 0
  const checked = getCheckedState(node, selected)

  return (
    <Collapsible defaultOpen>
      <div className="rounded-2xl border border-border/60 bg-card/70 p-3">
        <div className="flex items-start gap-3">
          {hasChildren ? (
            <CollapsibleTrigger className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <ChevronRight className="size-4 transition-transform data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
          ) : (
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="size-3.5 text-primary" />
            </div>
          )}
          <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
            <Checkbox
              checked={checked}
              onCheckedChange={() => onToggle(node)}
              className="mt-1"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{node.label}</span>
                <Badge variant="secondary" className="font-mono text-[11px]">
                  {node.permission?.code ?? node.code}
                </Badge>
              </div>
              {hasChildren && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {node.permissionIds.length} 个权限
                </p>
              )}
            </div>
          </label>
        </div>
        {hasChildren && (
          <CollapsibleContent className="mt-3 space-y-2 border-l border-border/60 pl-4">
            {node.children.map((child) => (
              <PermissionCheckNode
                key={child.id}
                node={child}
                selected={selected}
                onToggle={onToggle}
              />
            ))}
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  )
}

export function PermissionTreeChecklist({ nodes, selected, onToggle }: PermissionTreeChecklistProps) {
  return (
    <div className="space-y-2">
      {nodes.map((node) => (
        <PermissionCheckNode
          key={node.id}
          node={node}
          selected={selected}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
