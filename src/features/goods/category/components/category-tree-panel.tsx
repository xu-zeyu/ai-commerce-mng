'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Layers3 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CategoryIcon } from './category-icon'
import { getCategoryPath } from '../lib/category-tree'
import type { GoodsCategoryTreeNode } from '../types'

interface TreeNodeProps {
  node: GoodsCategoryTreeNode
  activeId: number
  expandedIds: Set<number>
  onSelect: (id: number) => void
  onToggle: (id: number) => void
}

function TreeNode({ node, activeId, expandedIds, onSelect, onToggle }: TreeNodeProps) {
  const active = activeId === node.id
  const children = node.children ?? []
  const hasChildren = children.length > 0
  const expanded = expandedIds.has(node.id)

  return (
    <motion.li initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
      <div
        className={cn(
          'flex w-full items-center gap-1 rounded-xl pr-2.5 text-sm transition-colors',
          active
            ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
            : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
        )}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(node.id)}
            aria-label={expanded ? '收起' : '展开'}
            aria-expanded={expanded}
            className="flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-muted"
          >
            <motion.span animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
              <ChevronRight className="size-4" />
            </motion.span>
          </button>
        ) : (
          <span className="size-7 shrink-0" />
        )}
        <button
          type="button"
          onClick={() => onSelect(node.id)}
          className="flex min-w-0 flex-1 items-center gap-2 py-2 text-left"
        >
          <CategoryIcon value={node.icon} name={node.name} className="size-4 shrink-0 rounded-xl text-sm" />
          <span className="min-w-0 flex-1 truncate">{node.name}</span>
          {hasChildren && <Badge variant="secondary">{children.length}</Badge>}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {hasChildren && expanded && (
          <motion.ul
            key="children"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="ml-4 space-y-1 overflow-hidden border-l border-border/60 pl-3"
          >
            {children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                activeId={activeId}
                expandedIds={expandedIds}
                onSelect={onSelect}
                onToggle={onToggle}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

interface Props {
  tree: GoodsCategoryTreeNode[]
  activeId: number
  onSelect: (id: number) => void
}

function collectParentIds(nodes: GoodsCategoryTreeNode[], acc: number[] = []): number[] {
  for (const node of nodes) {
    const children = node.children ?? []
    if (children.length > 0) {
      acc.push(node.id)
      collectParentIds(children, acc)
    }
  }
  return acc
}

export function CategoryTreePanel({ tree, activeId, onSelect }: Props) {
  const parentIds = useMemo(() => collectParentIds(tree), [tree])
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => new Set())

  // 树结构变化时，默认全部收起
  useEffect(() => {
    setExpandedIds(new Set())
  }, [parentIds])

  // 选中分类时，自动展开其所有祖先
  useEffect(() => {
    const path = getCategoryPath(tree, activeId)
    if (path.length === 0) return
    setExpandedIds((prev) => {
      const next = new Set(prev)
      path.forEach((node) => next.add(node.id))
      return next
    })
  }, [tree, activeId])

  const allExpanded = parentIds.length > 0 && parentIds.every((id) => expandedIds.has(id))

  const toggleNode = (id: number) =>
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const toggleAll = () => setExpandedIds(allExpanded ? new Set() : new Set(parentIds))

  return (
    <Card className="border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-xl dark:bg-card/70">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">分类结构</h2>
          <p className="mt-1 text-xs text-muted-foreground">按父子层级管理商品归类</p>
        </div>
        <div className="flex items-center gap-2">
          {parentIds.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {allExpanded ? '全部收起' : '全部展开'}
            </button>
          )}
          <span className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Layers3 className="size-4" />
          </span>
        </div>
      </div>
      {tree.length > 0 ? (
        <ul className="max-h-[520px] space-y-1 overflow-auto pr-1 scrollbar-thin">
          {tree.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              activeId={activeId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={toggleNode}
            />
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
