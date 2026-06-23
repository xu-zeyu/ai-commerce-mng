'use client'

import { ChevronRight, Edit3, FolderTree, Layers3, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CATEGORY_MUTATE_CODES } from '../lib/category-permissions'
import { CategoryIcon } from './category-icon'
import type { CategoryNodeMeta } from '../lib/category-tree'
import type { GoodsCategory } from '../types'

interface Props {
  categories: GoodsCategory[]
  loading: boolean
  metaMap: Map<number, CategoryNodeMeta>
  onEdit: (category: GoodsCategory) => void
  onDelete: (category: GoodsCategory) => void
  onDrillDown: (id: number) => void
}

function CategorySkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4">
      <div className="mb-4 h-10 w-10 animate-pulse rounded-2xl bg-muted" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-muted" />
    </div>
  )
}

export function CategoryCardList({
  categories,
  loading,
  metaMap,
  onEdit,
  onDelete,
  onDrillDown,
}: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CategorySkeleton key={index} />
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Layers3 className="size-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold">暂无分类</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">当前层级下还没有商品分类，可新建一级或子级分类。</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category, index) => {
        const meta = metaMap.get(category.id)
        const childCount = meta?.childCount ?? 0
        const descendantCount = meta?.descendantCount ?? 0

        return (
          <motion.article
            key={category.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.025 }}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/85 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:bg-card/70"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary/30 to-accent/70 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => onDrillDown(category.id)}
                className="flex min-w-0 items-center gap-3 text-left transition-colors hover:text-primary"
              >
                <CategoryIcon value={category.icon} name={category.name} className="size-5 shrink-0" />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold">{category.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    第 {category.level} 级 · 排序 {category.sort ?? 0}
                  </p>
                </div>
              </button>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant={category.status === 1 ? 'default' : 'secondary'}>
                  {category.status === 1 ? '启用' : '停用'}
                </Badge>
                <ChevronRight
                  className="size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-muted/40 p-2 text-xs text-muted-foreground">
              <div className="rounded-xl bg-background/70 px-3 py-2 dark:bg-background/40">
                <div className="flex items-center gap-1.5">
                  <FolderTree className="size-3.5" />
                  直属子级
                </div>
                <p className="mt-1 text-base font-semibold text-foreground">{childCount}</p>
              </div>
              <div className="rounded-xl bg-background/70 px-3 py-2 dark:bg-background/40">
                <div className="flex items-center gap-1.5">
                  <Layers3 className="size-3.5" />
                  全部下级
                </div>
                <p className="mt-1 text-base font-semibold text-foreground">{descendantCount}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => onDrillDown(category.id)}>
                进入层级
                <ChevronRight className="size-3.5" />
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  permission={CATEGORY_MUTATE_CODES}
                  onClick={() => onEdit(category)}
                >
                  <Edit3 className="size-3.5" />
                  编辑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  permission={CATEGORY_MUTATE_CODES}
                  className={cn('text-destructive hover:text-destructive')}
                  onClick={() => onDelete(category)}
                >
                  <Trash2 className="size-3.5" />
                  删除
                </Button>
              </div>
            </div>
          </motion.article>
        )
      })}
    </div>
  )
}
