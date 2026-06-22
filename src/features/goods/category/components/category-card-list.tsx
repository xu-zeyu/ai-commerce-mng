'use client'

import { Edit3, Layers3, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CATEGORY_MUTATE_CODES } from '../lib/category-permissions'
import type { GoodsCategory } from '../types'

interface Props {
  categories: GoodsCategory[]
  loading: boolean
  onEdit: (category: GoodsCategory) => void
  onDelete: (category: GoodsCategory) => void
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

export function CategoryCardList({ categories, loading, onEdit, onDelete }: Props) {
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
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Layers3 className="size-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold">暂无分类</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">当前父级下还没有商品分类，可新建一级或子级分类。</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category, index) => (
        <motion.article
          key={category.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.025 }}
          className="group rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-xl">
                {category.icon}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold">{category.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">ID {category.id}</p>
              </div>
            </div>
            <Badge variant={category.status === 1 ? 'default' : 'secondary'}>
              {category.status === 1 ? '启用' : '停用'}
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-xl bg-muted/60 px-2 py-2">
              <p className="text-xs text-muted-foreground">层级</p>
              <p className="mt-1 font-medium">{category.level}</p>
            </div>
            <div className="rounded-xl bg-muted/60 px-2 py-2">
              <p className="text-xs text-muted-foreground">排序</p>
              <p className="mt-1 font-medium">{category.sort ?? 0}</p>
            </div>
            <div className="rounded-xl bg-muted/60 px-2 py-2">
              <p className="text-xs text-muted-foreground">父级</p>
              <p className="mt-1 font-medium">{category.parentId || '根'}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" permission={CATEGORY_MUTATE_CODES} onClick={() => onEdit(category)}>
              <Edit3 className="size-4" />
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
              <Trash2 className="size-4" />
              删除
            </Button>
          </div>
        </motion.article>
      ))}
    </div>
  )
}
