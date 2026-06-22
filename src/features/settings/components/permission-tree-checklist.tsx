'use client'

import { ChevronRight } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { RolePermissionTreeNode } from '../types'

interface PermissionTreeChecklistProps {
  nodes: RolePermissionTreeNode[]
  selected: Set<string>
  onToggle: (node: RolePermissionTreeNode) => void
}

function getCheckedState(node: RolePermissionTreeNode, selected: Set<string>) {
  const selectedCount = node.permissionCodes.filter((code) => selected.has(code)).length
  if (selectedCount === 0) return false
  if (selectedCount === node.permissionCodes.length) return true
  return 'indeterminate'
}

interface PermissionCheckNodeProps {
  node: RolePermissionTreeNode
  depth: number
  selected: Set<string>
  onToggle: (node: RolePermissionTreeNode) => void
}

function PermissionCheckNode({ node, depth, selected, onToggle }: PermissionCheckNodeProps) {
  const hasChildren = node.children.length > 0
  const checked = getCheckedState(node, selected)
  const indent = depth * 18

  return (
    <Collapsible defaultOpen>
      <div
        className="group flex min-h-11 items-center gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-muted/50"
        style={{ paddingLeft: indent + 8 }}
      >
        {hasChildren ? (
          <CollapsibleTrigger className="group/trigger flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground">
            <ChevronRight className="size-4 transition-transform group-data-[state=open]/trigger:rotate-90" />
          </CollapsibleTrigger>
        ) : (
          <span className="size-7 shrink-0" />
        )}

        <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
          <Checkbox
            checked={checked}
            onCheckedChange={() => onToggle(node)}
          />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{node.label}</span>
          {hasChildren ? (
            <span className="shrink-0 text-xs text-muted-foreground">
              {node.permissionCodes.length} 项
            </span>
          ) : (
            <Badge variant="secondary" className="min-w-0 truncate font-mono text-[11px]">
              {node.code}
            </Badge>
          )}
        </label>
      </div>
        {hasChildren && (
          <CollapsibleContent
            className="relative space-y-1 before:absolute before:bottom-1 before:top-1 before:w-px before:bg-border/70"
            style={{ marginLeft: indent + 21 }}
          >
            {node.children.map((child) => (
              <PermissionCheckNode
                key={child.id}
                node={child}
                depth={depth + 1}
                selected={selected}
                onToggle={onToggle}
              />
            ))}
          </CollapsibleContent>
        )}
    </Collapsible>
  )
}

export function PermissionTreeChecklist({ nodes, selected, onToggle }: PermissionTreeChecklistProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 p-2">
      {nodes.map((node) => (
        <PermissionCheckNode
          key={node.id}
          node={node}
          depth={0}
          selected={selected}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
