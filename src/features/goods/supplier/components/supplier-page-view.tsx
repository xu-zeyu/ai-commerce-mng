'use client'

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DataTableToolbar } from '@/components/common/data-table-toolbar'
import { SUPPLIER_CREATE_CODES } from '../lib/supplier-permissions'
import { useDeleteSupplier, useSupplierPage } from '../hooks/use-suppliers'
import { SupplierFormDialog } from './supplier-form-dialog'
import { SupplierPagination } from './supplier-pagination'
import { SupplierTable } from './supplier-table'
import { SupplierBrandSheet } from './supplier-brand-sheet'
import { SupplierFilterFields } from './supplier-filter-fields'
import type { Supplier, SupplierStatus } from '../types'

type StatusFilter = 'all' | SupplierStatus

export function SupplierPageView() {
  const [keyword, setKeyword] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null)
  const [brandSheetSupplier, setBrandSheetSupplier] = useState<Supplier | null>(null)

  const deleteMutation = useDeleteSupplier()

  const params = useMemo(
    () => ({
      page,
      size: pageSize,
      supplierName: query.trim() || undefined,
      status: status === 'all' ? undefined : status,
    }),
    [page, pageSize, query, status],
  )

  const pageQuery = useSupplierPage(params)

  const suppliers = pageQuery.data?.records ?? []
  const total = pageQuery.data?.total ?? 0

  const handleSearch = () => {
    setPage(1)
    setQuery(keyword)
  }

  const handleReset = () => {
    setKeyword('')
    setQuery('')
    setStatus('all')
    setPage(1)
  }

  const handleStatusChange = (value: StatusFilter) => {
    setPage(1)
    setStatus(value)
  }

  const handleCreate = () => {
    setEditingSupplier(null)
    setFormOpen(true)
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingSupplier(null)
  }

  const handleDelete = (supplier: Supplier) => {
    setDeletingSupplier(supplier)
  }

  const handleConfirmDelete = () => {
    if (!deletingSupplier) return
    deleteMutation.mutate(deletingSupplier.id, {
      onSuccess: () => {
        toast.success('删除成功')
        setDeletingSupplier(null)
      },
      onError: () => {
        toast.error('删除失败，请重试')
      },
    })
  }

  const hasActiveFilters = Boolean(keyword || query) || status !== 'all'

  return (
    <div className="space-y-4">
      <DataTableToolbar
        searchValue={keyword}
        onSearchChange={setKeyword}
        onSearchSubmit={handleSearch}
        searchPlaceholder="搜索供应商名称"
        onReset={handleReset}
        resetDisabled={!hasActiveFilters}
        filters={<SupplierFilterFields status={status} onStatusChange={handleStatusChange} />}
        actions={
          <Button type="button" permission={SUPPLIER_CREATE_CODES} onClick={handleCreate}>
            <Plus className="size-4" />
            新增供应商
          </Button>
        }
        className="rounded-2xl border border-border/60 border-b-border/60 bg-card/80 p-3 shadow-sm backdrop-blur-xl dark:bg-card/70 sm:p-4"
      />

      <SupplierTable
        data={suppliers}
        loading={pageQuery.isLoading}
        refreshing={pageQuery.isFetching}
        onRefresh={() => pageQuery.refetch()}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManageBrands={setBrandSheetSupplier}
      />

      <SupplierPagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      <SupplierFormDialog open={formOpen} onClose={handleFormClose} editData={editingSupplier} />

      <SupplierBrandSheet
        open={!!brandSheetSupplier}
        onClose={() => setBrandSheetSupplier(null)}
        supplier={brandSheetSupplier}
      />

      <Dialog open={!!deletingSupplier} onOpenChange={() => setDeletingSupplier(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除供应商「{deletingSupplier?.supplierName}」吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingSupplier(null)}
            >
              取消
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
