'use client'

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DataTableToolbar } from '@/components/common/data-table-toolbar'
import { BRAND_CREATE_CODES } from '../lib/brand-permissions'
import { useBrandPage, useDeleteBrand } from '../hooks/use-brands'
import { useCategoryTree } from '../hooks/use-category-tree'
import type { GoodsBrand, BrandStatus } from '../types'
import type { CategoryTreeNode } from '../api/get-category-tree'
import { BrandCardList } from './brand-card-list'
import { BrandFormDialog } from './brand-form-dialog'
import { BrandDeleteDialog } from './brand-delete-dialog'
import { BrandPagination } from './brand-pagination'

type StatusFilter = 'all' | BrandStatus

/** 将分类树拍平为可选列表 */
function flattenCategoryTree(
  nodes: CategoryTreeNode[],
  parentPath = '',
): { id: number; label: string }[] {
  const result: { id: number; label: string }[] = []
  for (const node of nodes) {
    const path = parentPath ? `${parentPath} > ${node.name}` : node.name
    result.push({ id: node.id, label: path })
    if (node.children && node.children.length > 0) {
      result.push(...flattenCategoryTree(node.children, path))
    }
  }
  return result
}

export function BrandPageView() {
  const [keyword, setKeyword] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [categoryId, setCategoryId] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [formOpen, setFormOpen] = useState(false)
  const [editData, setEditData] = useState<GoodsBrand | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<GoodsBrand | null>(null)

  const treeQuery = useCategoryTree()
  const deleteMutation = useDeleteBrand()

  const tree = treeQuery.data ?? []
  const flatCategories = useMemo(() => flattenCategoryTree(tree), [tree])

  const params = useMemo(
    () => ({
      page,
      size: pageSize,
      name: query.trim() || undefined,
      categoryId: categoryId > 0 ? categoryId : undefined,
      status: status === 'all' ? undefined : status,
    }),
    [page, pageSize, query, categoryId, status],
  )

  const pageQuery = useBrandPage(params)
  const brands = pageQuery.data?.records ?? []
  const total = pageQuery.data?.total ?? 0

  const handleSearch = () => {
    setPage(1)
    setQuery(keyword)
  }

  const handleStatusChange = (value: StatusFilter) => {
    setPage(1)
    setStatus(value)
  }

  const handleCategoryChange = (value: string) => {
    setPage(1)
    setCategoryId(Number(value))
  }

  const handleCreate = () => {
    setEditData(null)
    setFormOpen(true)
  }

  const handleEdit = (brand: GoodsBrand) => {
    setEditData(brand)
    setFormOpen(true)
  }

  const handleDelete = (brand: GoodsBrand) => {
    setDeleteTarget(brand)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync(deleteTarget.id)
    toast.success('品牌删除成功')
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar
        searchValue={keyword}
        onSearchChange={setKeyword}
        onSearchSubmit={handleSearch}
        searchPlaceholder="搜索品牌名称"
        onRefresh={() => {
          pageQuery.refetch()
          treeQuery.refetch()
        }}
        refreshing={pageQuery.isFetching}
        filters={
          <div className="flex items-center gap-2">
            <select
              value={categoryId}
              onChange={(event) => handleCategoryChange(event.target.value)}
              className="h-9 rounded-xl border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value={0}>全部分类</option>
              {flatCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value === 'all'
                    ? 'all'
                    : (Number(event.target.value) as BrandStatus),
                )
              }
              className="h-9 rounded-xl border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">全部状态</option>
              <option value="1">启用</option>
              <option value="0">停用</option>
            </select>
          </div>
        }
        actions={
          <Button type="button" permission={BRAND_CREATE_CODES} onClick={handleCreate}>
            <Plus className="size-4" />
            新增品牌
          </Button>
        }
        className="rounded-2xl border border-border/60 border-b-border/60 bg-card/80 p-3 shadow-sm backdrop-blur-xl dark:bg-card/70 sm:p-4"
      />

      <BrandCardList
        brands={brands}
        loading={pageQuery.isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <BrandPagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      <BrandFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditData(null)
        }}
        editData={editData}
      />

      <BrandDeleteDialog
        brand={deleteTarget}
        loading={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
