'use client'

import { Folder, FolderOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { GoodsCategoryTreeNode } from '../types'

interface TreeNodeProps {
  node: GoodsCategoryTreeNode
  activeId: number
  onSelect: (id: number) => void
}

function TreeNode({ node, activeId, onSelect }: TreeNodeProps) {
  const active = activeId === node.id
  const hasChildren = Boolean(node.children?.length)

  return (
    <motion.li initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className={cn(
          'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors',
          active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        {active ? <FolderOpen className="size-4" /> : <Folder className="size-4" />}
        <span className="min-w-0 flex-1 truncate">{node.name}</span>
        <Badge variant={node.status === 1 ? 'default' : 'secondary'}>{node.status === 1 ? '启用' : '停用'}</Badge>
      </button>
      {hasChildren && (
        <ul className="ml-4 space-y-1 border-l border-border/60 pl-3">
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} activeId={activeId} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </motion.li>
  )
}

interface Props {
  tree: GoodsCategoryTreeNode[]
  activeId: number
  onSelect: (id: number) => void
}

export function CategoryTreePanel({ tree, activeId, onSelect }: Props) {
  return (
    <Card className="border-border/60 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">分类树</h2>
          <p className="mt-1 text-sm text-muted-foreground">按父级查看子分类</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onSelect(0)}
        className={cn(
          'mb-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors',
          activeId === 0 ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        <FolderOpen className="size-4" />
        <span className="flex-1">全部一级分类</span>
        <Badge variant="secondary">{tree.length}</Badge>
      </button>
      <ul className="max-h-[520px] space-y-1 overflow-auto pr-1 scrollbar-thin">
        {tree.map((node) => (
          <TreeNode key={node.id} node={node} activeId={activeId} onSelect={onSelect} />
        ))}
      </ul>
    </Card>
  )
}
