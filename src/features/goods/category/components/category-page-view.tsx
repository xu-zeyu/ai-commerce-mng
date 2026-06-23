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
            actions={
              <Button permission={CATEGORY_CREATE_CODES} onClick={handleCreate}>
                <Plus className="size-4" />
                新增
              </Button>
            }
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
