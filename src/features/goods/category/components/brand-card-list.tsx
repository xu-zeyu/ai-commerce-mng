'use client'

import { Edit3, Tag, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BRAND_MUTATE_CODES } from '../lib/brand-permissions'
import { CategoryIcon } from './category-icon'
import type { GoodsBrand } from '../types'

interface Props {
  brands: GoodsBrand[]
  loading: boolean
  onEdit: (brand: GoodsBrand) => void
  onDelete: (brand: GoodsBrand) => void
}

function BrandSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4">
      <div className="mb-4 h-10 w-10 animate-pulse rounded-2xl bg-muted" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-muted" />
    </div>
  )
}

export function BrandCardList({
  brands,
  loading,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <BrandSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (brands.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Tag className="size-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold">暂无品牌</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">当前分类下还没有品牌，可点击上方「新增」按钮添加。</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {brands.map((brand, index) => (
        <motion.article
          key={brand.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.025 }}
          className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/85 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:bg-card/70"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary/30 to-accent/70 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <CategoryIcon value={brand.logo} name={brand.name} className="size-10 shrink-0" />
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold">{brand.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {brand.firstLetter ? `首字母 ${brand.firstLetter}` : '暂无首字母'} · 排序 {brand.sort ?? 0}
                </p>
              </div>
            </div>
            <Badge variant={brand.status === 1 ? 'default' : 'secondary'}>
              {brand.status === 1 ? '启用' : '停用'}
            </Badge>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              ID: {brand.id}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                permission={BRAND_MUTATE_CODES}
                onClick={() => onEdit(brand)}
              >
                <Edit3 className="size-3.5" />
                编辑
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                permission={BRAND_MUTATE_CODES}
                className={cn('text-destructive hover:text-destructive')}
                onClick={() => onDelete(brand)}
              >
                <Trash2 className="size-3.5" />
                删除
              </Button>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  )
}
