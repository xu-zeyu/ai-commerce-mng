'use client'

import { FolderOpen, Layers3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CategoryIcon } from './category-icon'
import type { GoodsCategoryTreeNode } from '../types'

interface TreeNodeProps {
  node: GoodsCategoryTreeNode
  activeId: number
  onSelect: (id: number) => void
}

function TreeNode({ node, activeId, onSelect }: TreeNodeProps) {
  const active = activeId === node.id
  const children = node.children ?? []
  const hasChildren = children.length > 0

  return (
    <motion.li initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className={cn(
          'flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors',
          active
            ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
            : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
        )}
      >
        <CategoryIcon value={node.icon} name={node.name} className="size-4 shrink-0 rounded-xl text-sm" />
        <span className="min-w-0 flex-1 truncate">{node.name}</span>
        {hasChildren && <Badge variant="secondary">{children.length}</Badge>}
      </button>
      {hasChildren && (
        <ul className="ml-4 space-y-1 border-l border-border/60 pl-3">
          {children.map((child) => (
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
    <Card className="border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-xl dark:bg-card/70">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">分类结构</h2>
          <p className="mt-1 text-xs text-muted-foreground">按父子层级管理商品归类</p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Layers3 className="size-4" />
        </span>
      </div>
      {tree.length > 0 ? (
        <ul className="max-h-[520px] space-y-1 overflow-auto pr-1 scrollbar-thin">
          {tree.map((node) => (
            <TreeNode key={node.id} node={node} activeId={activeId} onSelect={onSelect} />
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl bg-muted/50 px-4 py-8 text-center text-sm text-muted-foreground">
          暂无分类结构
        </div>
      )}
    </Card>
  )
}
