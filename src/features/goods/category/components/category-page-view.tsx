'use client'

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DataTableToolbar } from '@/components/common/data-table-toolbar'
import { useCategoryPageStore } from '@/stores/use-category-page-store'
import { CATEGORY_CREATE_CODES } from '../lib/category-permissions'
import {
  countEnabled,
  countTree,
  createCategoryMetaMap,
  getCategoryPath,
  getMaxLevel,
} from '../lib/category-tree'
import { useCategoryPage, useCategoryTree, useDeleteCategory } from '../hooks/use-categories'
import { CategoryBreadcrumb } from './category-breadcrumb'
import { CategoryCardList } from './category-card-list'
import { CategoryDeleteDialog } from './category-delete-dialog'
import { CategoryFormDialog } from './category-form-dialog'
import { CategoryInsightChart } from './category-insight-chart'
import { CategoryPagination } from './category-pagination'
import { CategorySummaryCards } from './category-summary-cards'
import { CategoryTreePanel } from './category-tree-panel'
import type { GoodsCategory } from '../types'

export function CategoryPageView() {
  const [keyword, setKeyword] = useState('')
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editData, setEditData] = useState<GoodsCategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<GoodsCategory | null>(null)
  const { parentId, page, pageSize, setParentId, setPage, setPageSize } = useCategoryPageStore()

  const params = useMemo(
    () => ({ page, size: pageSize, parentId, name: query.trim() || undefined }),
    [page, pageSize, parentId, query],
  )
  const pageQuery = useCategoryPage(params)
  const treeQuery = useCategoryTree()
  const deleteMutation = useDeleteCategory()

  const tree = treeQuery.data ?? []
  const categories = pageQuery.data?.records ?? []
  const total = pageQuery.data?.total ?? 0
  const breadcrumbPath = useMemo(() => getCategoryPath(tree, parentId), [tree, parentId])
  const metaMap = useMemo(() => createCategoryMetaMap(tree), [tree])
  const currentName = breadcrumbPath.at(-1)?.name ?? '全部一级分类'

  const handleSearch = () => {
    setPage(1)
    setQuery(keyword)
  }

  const handleCreate = () => {
    setEditData(null)
    setFormOpen(true)
  }

  const handleEdit = (category: GoodsCategory) => {
    setEditData(category)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync(deleteTarget.id)
    toast.success('分类删除成功')
    setDeleteTarget(null)
  }

  const handleNavigate = (id: number) => {
    setParentId(id)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border/60 bg-card/75 p-5 shadow-sm backdrop-blur-xl dark:bg-card/65 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">商品中心</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal sm:text-3xl">商品分类</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              当前查看 {currentName}，支持按父子层级维护分类、图片图标、启停状态与排序。
            </p>
          </div>
          <Button permission={CATEGORY_CREATE_CODES} onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="size-4" />
            新增分类
          </Button>
        </div>
      </section>

      <CategorySummaryCards
        total={countTree(tree)}
        enabled={countEnabled(tree)}
        rootCount={tree.length}
        maxLevel={getMaxLevel(tree)}
      />

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="space-y-5">
          <CategoryTreePanel tree={tree} activeId={parentId} onSelect={handleNavigate} />
          <CategoryInsightChart tree={tree} />
        </div>

        <section className="min-w-0 space-y-4">
          <DataTableToolbar
            searchValue={keyword}
            onSearchChange={setKeyword}
            onSearchSubmit={handleSearch}
            searchPlaceholder="搜索分类名称"
            onRefresh={() => {
              pageQuery.refetch()
              treeQuery.refetch()
            }}
            refreshing={pageQuery.isFetching || treeQuery.isFetching}
            className="rounded-2xl border border-border/60 border-b-border/60 bg-card/80 p-3 shadow-sm backdrop-blur-xl dark:bg-card/70 sm:p-4"
          />
          <CategoryBreadcrumb path={breadcrumbPath} total={total} onNavigate={handleNavigate} />
          <CategoryCardList
            categories={categories}
            loading={pageQuery.isLoading}
            metaMap={metaMap}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
            onDrillDown={handleNavigate}
          />
          <CategoryPagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </section>
      </div>

      <CategoryFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditData(null)
        }}
        tree={tree}
        editData={editData}
        initialParentId={parentId}
      />
      <CategoryDeleteDialog
        category={deleteTarget}
        loading={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
