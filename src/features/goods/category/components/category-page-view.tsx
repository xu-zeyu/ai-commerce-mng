'use client'

import { useMemo, useState } from 'react'
import { FolderTree, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTableToolbar } from '@/components/common/data-table-toolbar'
import { useCategoryPageStore } from '@/stores/use-category-page-store'
import { CATEGORY_CREATE_CODES } from '../lib/category-permissions'
import { countEnabled, countTree, findCategory, flattenCategoryTree, getMaxLevel } from '../lib/category-tree'
import { useCategoryPage, useCategoryTree, useDeleteCategory } from '../hooks/use-categories'
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
  const parentOptions = flattenCategoryTree(tree)
  const activeParent = parentId > 0 ? findCategory(tree, parentId) : null

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

  return (
    <div className="mx-auto flex max-w-7xl animate-fade-in flex-col gap-6 p-6 md:p-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FolderTree className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">商品分类</h1>
            <p className="mt-1 text-sm text-muted-foreground">维护商品类目层级、启停状态和前台展示顺序</p>
          </div>
        </div>
        <Button permission={CATEGORY_CREATE_CODES} onClick={handleCreate}>
          <Plus className="size-4" />
          新增分类
        </Button>
      </header>

      <CategorySummaryCards
        total={countTree(tree)}
        enabled={countEnabled(tree)}
        rootCount={tree.length}
        maxLevel={getMaxLevel(tree)}
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <CategoryTreePanel tree={tree} activeId={parentId} onSelect={setParentId} />
          <CategoryInsightChart tree={tree} />
        </div>

        <Card className="overflow-hidden border-border/60 shadow-sm">
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
            filters={
              <select
                value={parentId}
                onChange={(event) => setParentId(Number(event.target.value))}
                className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-56"
              >
                <option value={0}>一级分类</option>
                {parentOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            }
            actions={
              <Button permission={CATEGORY_CREATE_CODES} onClick={handleCreate}>
                <Plus className="size-4" />
                新增
              </Button>
            }
          />
          <div className="border-b border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            当前查看：{activeParent ? `「${activeParent.name}」的子分类` : '一级分类'}
          </div>
          <CategoryCardList
            categories={categories}
            loading={pageQuery.isLoading}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
          />
          <CategoryPagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </Card>
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
