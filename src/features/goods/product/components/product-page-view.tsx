'use client'

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DataTableToolbar } from '@/components/common/data-table-toolbar'
import { PRODUCT_CREATE_CODES } from '../lib/product-permissions'
import { useProductPage, useDeleteProduct } from '../hooks/use-products'
import {
  useSupplierOptions,
  useBrandOptions,
  useCategoryOptions,
} from '../hooks/use-product-options'
import type { ProductSpu, SaleStatus, AuditStatus } from '../types'
import { ProductTable } from './product-table'
import { ProductPagination } from './product-pagination'
import { ProductFormDialog } from './product-form-dialog'
import { ProductDeleteDialog } from './product-delete-dialog'
import { ProductFilterFields } from './product-filter-fields'

type SaleStatusFilter = 'all' | SaleStatus
type AuditStatusFilter = 'all' | AuditStatus

export function ProductPageView() {
  const [keyword, setKeyword] = useState('')
  const [query, setQuery] = useState('')
  const [spuCode, setSpuCode] = useState('')
  const [saleStatus, setSaleStatus] = useState<SaleStatusFilter>('all')
  const [auditStatus, setAuditStatus] = useState<AuditStatusFilter>('all')
  const [supplierId, setSupplierId] = useState<number>(0)
  const [categoryId, setCategoryId] = useState<number>(0)
  const [brandId, setBrandId] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [editData, setEditData] = useState<ProductSpu | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ProductSpu | null>(null)

  const supplierQuery = useSupplierOptions()
  const brandQuery = useBrandOptions()
  const categoryQuery = useCategoryOptions()
  const deleteMutation = useDeleteProduct()

  const params = useMemo(
    () => ({
      page,
      size: pageSize,
      name: query.trim() || undefined,
      spuCode: spuCode.trim() || undefined,
      supplierId: supplierId > 0 ? supplierId : undefined,
      categoryId: categoryId > 0 ? categoryId : undefined,
      brandId: brandId > 0 ? brandId : undefined,
      saleStatus: saleStatus === 'all' ? undefined : saleStatus,
      auditStatus: auditStatus === 'all' ? undefined : auditStatus,
    }),
    [page, pageSize, query, spuCode, supplierId, categoryId, brandId, saleStatus, auditStatus],
  )

  const pageQuery = useProductPage(params)
  const products = pageQuery.data?.records ?? []
  const total = pageQuery.data?.total ?? 0

  const handleSearch = () => {
    setPage(1)
    setQuery(keyword)
  }

  const updateFilter = <TValue,>(setter: (value: TValue) => void) => (value: TValue) => {
    setter(value)
    setPage(1)
  }

  const handleReset = () => {
    setKeyword('')
    setQuery('')
    setSpuCode('')
    setSaleStatus('all')
    setAuditStatus('all')
    setSupplierId(0)
    setCategoryId(0)
    setBrandId(0)
    setPage(1)
  }

  const handleCreate = () => {
    setEditData(null)
    setFormOpen(true)
  }

  const handleEdit = (product: ProductSpu) => {
    setEditData(product)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditData(null)
  }

  const handleDelete = (product: ProductSpu) => {
    setDeleteTarget(product)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('商品删除成功')
        setDeleteTarget(null)
      },
      onError: () => {
        toast.error('删除失败，请重试')
      },
    })
  }

  const hasActiveFilters =
    Boolean(keyword || query || spuCode) ||
    supplierId > 0 ||
    categoryId > 0 ||
    brandId > 0 ||
    saleStatus !== 'all' ||
    auditStatus !== 'all'

  return (
    <div className="space-y-4">
      <DataTableToolbar
        searchValue={keyword}
        onSearchChange={setKeyword}
        onSearchSubmit={handleSearch}
        searchPlaceholder="搜索商品名称"
        onReset={handleReset}
        resetDisabled={!hasActiveFilters}
        onRefresh={() => pageQuery.refetch()}
        refreshing={pageQuery.isFetching}
        filters={
          <ProductFilterFields
            spuCode={spuCode}
            supplierId={supplierId}
            categoryId={categoryId}
            brandId={brandId}
            saleStatus={saleStatus}
            auditStatus={auditStatus}
            suppliers={supplierQuery.data}
            categories={categoryQuery.data}
            brands={brandQuery.data}
            onSpuCodeChange={updateFilter(setSpuCode)}
            onSupplierChange={updateFilter(setSupplierId)}
            onCategoryChange={updateFilter(setCategoryId)}
            onBrandChange={updateFilter(setBrandId)}
            onSaleStatusChange={updateFilter(setSaleStatus)}
            onAuditStatusChange={updateFilter(setAuditStatus)}
          />
        }
        actions={
          <Button type="button" permission={PRODUCT_CREATE_CODES} onClick={handleCreate}>
            <Plus className="size-4" />
            新增商品
          </Button>
        }
        className="rounded-2xl border border-border/60 border-b-border/60 bg-card/80 p-3 shadow-sm backdrop-blur-xl dark:bg-card/70 sm:p-4"
      />

      <ProductTable
        data={products}
        loading={pageQuery.isLoading}
        refreshing={pageQuery.isFetching}
        onRefresh={() => pageQuery.refetch()}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductPagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      <ProductFormDialog open={formOpen} onClose={handleFormClose} editData={editData} />

      <ProductDeleteDialog
        product={deleteTarget}
        loading={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
