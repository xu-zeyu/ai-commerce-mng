'use client'

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableToolbar } from '@/components/common/data-table-toolbar'
import { useCategoryPageStore } from '@/stores/use-category-page-store'
import { CATEGORY_CREATE_CODES } from '../lib/category-permissions'
import { BRAND_CREATE_CODES } from '../lib/brand-permissions'
import {
  countEnabled,
  countTree,
  createCategoryMetaMap,
  findCategory,
  getCategoryPath,
  getMaxLevel,
  MAX_CATEGORY_LEVEL,
} from '../lib/category-tree'
import { useCategoryPage, useCategoryTree, useDeleteCategory } from '../hooks/use-categories'
import { useBrandPage, useDeleteBrand } from '../hooks/use-brands'
import { CategoryBreadcrumb } from './category-breadcrumb'
import { CategoryCardList } from './category-card-list'
import { CategoryDeleteDialog } from './category-delete-dialog'
import { CategoryFormDialog } from './category-form-dialog'
import { CategoryInsightChart } from './category-insight-chart'
import { CategoryPagination } from './category-pagination'
import { CategorySummaryCards } from './category-summary-cards'
import { CategoryTreePanel } from './category-tree-panel'
import { BrandCardList } from './brand-card-list'
import { BrandFormDialog } from './brand-form-dialog'
import { BrandDeleteDialog } from './brand-delete-dialog'
import type { GoodsCategory, GoodsBrand } from '../types'

export function CategoryPageView() {
  const [catKeyword, setCatKeyword] = useState('')
  const [catQuery, setCatQuery] = useState('')
  const [catFormOpen, setCatFormOpen] = useState(false)
  const [catEditData, setCatEditData] = useState<GoodsCategory | null>(null)
  const [catDeleteTarget, setCatDeleteTarget] = useState<GoodsCategory | null>(null)

  const [brandKeyword, setBrandKeyword] = useState('')
  const [brandQuery, setBrandQuery] = useState('')
  const [brandFormOpen, setBrandFormOpen] = useState(false)
  const [brandEditData, setBrandEditData] = useState<GoodsBrand | null>(null)
  const [brandDeleteTarget, setBrandDeleteTarget] = useState<GoodsBrand | null>(null)

  const { parentId, page, pageSize, setParentId, setPage, setPageSize } = useCategoryPageStore()

  const catParams = useMemo(
    () => ({ page, size: pageSize, parentId, name: catQuery.trim() || undefined }),
    [page, pageSize, parentId, catQuery],
  )
  const catPageQuery = useCategoryPage(catParams)
  const treeQuery = useCategoryTree()
  const deleteCatMutation = useDeleteCategory()

  const currentParent = useMemo(() => {
    if (parentId <= 0) return null
    return findCategory(treeQuery.data ?? [], parentId)
  }, [treeQuery.data, parentId])
  const isMaxLevel = currentParent ? currentParent.level >= MAX_CATEGORY_LEVEL : false

  const brandParams = useMemo(
    () => ({
      page,
      size: pageSize,
      categoryId: isMaxLevel ? currentParent!.id : parentId,
      name: brandQuery.trim() || undefined,
    }),
    [page, pageSize, isMaxLevel, currentParent, parentId, brandQuery],
  )
  const brandPageQuery = useBrandPage(brandParams)
  const deleteBrandMutation = useDeleteBrand()

  const tree = useMemo(() => treeQuery.data ?? [], [treeQuery.data])
  const breadcrumbPath = useMemo(() => getCategoryPath(tree, parentId), [tree, parentId])
  const metaMap = useMemo(() => createCategoryMetaMap(tree), [tree])

  const categories = catPageQuery.data?.records ?? []
  const catTotal = catPageQuery.data?.total ?? 0

  const brands = brandPageQuery.data?.records ?? []
  const brandTotal = brandPageQuery.data?.total ?? 0

  const handleCatSearch = () => {
    setPage(1)
    setCatQuery(catKeyword)
  }

  const handleCatCreate = () => {
    setCatEditData(null)
    setCatFormOpen(true)
  }

  const handleCatEdit = (category: GoodsCategory) => {
    setCatEditData(category)
    setCatFormOpen(true)
  }

  const handleCatDelete = async () => {
    if (!catDeleteTarget) return
    await deleteCatMutation.mutateAsync(catDeleteTarget.id)
    toast.success('分类删除成功')
    setCatDeleteTarget(null)
  }

  const handleBrandSearch = () => {
    setPage(1)
    setBrandQuery(brandKeyword)
  }

  const handleBrandCreate = () => {
    setBrandEditData(null)
    setBrandFormOpen(true)
  }

  const handleBrandEdit = (brand: GoodsBrand) => {
    setBrandEditData(brand)
    setBrandFormOpen(true)
  }

  const handleBrandDelete = async () => {
    if (!brandDeleteTarget) return
    await deleteBrandMutation.mutateAsync(brandDeleteTarget.id)
    toast.success('品牌删除成功')
    setBrandDeleteTarget(null)
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
          {isMaxLevel ? (
            <DataTableToolbar
              searchValue={brandKeyword}
              onSearchChange={setBrandKeyword}
              onSearchSubmit={handleBrandSearch}
              searchPlaceholder="搜索品牌名称"
              onRefresh={() => brandPageQuery.refetch()}
              refreshing={brandPageQuery.isFetching}
              actions={
                <Button permission={BRAND_CREATE_CODES} onClick={handleBrandCreate}>
                  <Plus className="size-4" />
                  新增品牌
                </Button>
              }
              className="rounded-2xl border border-border/60 border-b-border/60 bg-card/80 p-3 shadow-sm backdrop-blur-xl dark:bg-card/70 sm:p-4"
            />
          ) : (
            <DataTableToolbar
              searchValue={catKeyword}
              onSearchChange={setCatKeyword}
              onSearchSubmit={handleCatSearch}
              searchPlaceholder="搜索分类名称"
              onRefresh={() => {
                catPageQuery.refetch()
                treeQuery.refetch()
              }}
              refreshing={catPageQuery.isFetching || treeQuery.isFetching}
              actions={
                isMaxLevel ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button permission={CATEGORY_CREATE_CODES} disabled onClick={handleCatCreate}>
                            <Plus className="size-4" />
                            新增
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>分类层级已达上限（最多 3 级），无法继续新增子级</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Button permission={CATEGORY_CREATE_CODES} onClick={handleCatCreate}>
                    <Plus className="size-4" />
                    新增
                  </Button>
                )
              }
              className="rounded-2xl border border-border/60 border-b-border/60 bg-card/80 p-3 shadow-sm backdrop-blur-xl dark:bg-card/70 sm:p-4"
            />
          )}

          <CategoryBreadcrumb
            path={breadcrumbPath}
            total={isMaxLevel ? brandTotal : catTotal}
            onNavigate={handleNavigate}
          />

          {isMaxLevel ? (
            <>
              <BrandCardList
                brands={brands}
                loading={brandPageQuery.isLoading}
                onEdit={handleBrandEdit}
                onDelete={setBrandDeleteTarget}
              />
              <CategoryPagination
                page={page}
                pageSize={pageSize}
                total={brandTotal}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </>
          ) : (
            <>
              <CategoryCardList
                categories={categories}
                loading={catPageQuery.isLoading}
                metaMap={metaMap}
                onEdit={handleCatEdit}
                onDelete={setCatDeleteTarget}
                onDrillDown={handleNavigate}
              />
              <CategoryPagination
                page={page}
                pageSize={pageSize}
                total={catTotal}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </>
          )}
        </section>
      </div>

      <CategoryFormDialog
        open={catFormOpen}
        onClose={() => {
          setCatFormOpen(false)
          setCatEditData(null)
        }}
        tree={tree}
        editData={catEditData}
        initialParentId={parentId}
      />
      <CategoryDeleteDialog
        category={catDeleteTarget}
        loading={deleteCatMutation.isPending}
        onClose={() => setCatDeleteTarget(null)}
        onConfirm={handleCatDelete}
      />

      {isMaxLevel && (
        <>
          <BrandFormDialog
            open={brandFormOpen}
            onClose={() => {
              setBrandFormOpen(false)
              setBrandEditData(null)
            }}
            category={currentParent}
            editData={brandEditData}
          />
          <BrandDeleteDialog
            brand={brandDeleteTarget}
            loading={deleteBrandMutation.isPending}
            onClose={() => setBrandDeleteTarget(null)}
            onConfirm={handleBrandDelete}
          />
        </>
      )}
    </div>
  )
}
