'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2, Plus, Search, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  SUPPLIER_BRAND_CREATE_CODES,
  SUPPLIER_BRAND_DELETE_CODES,
  SUPPLIER_BRAND_UPDATE_CODES,
} from '../lib/supplier-permissions'
import {
  useAllBrands,
  useCreateSupplierBrand,
  useDeleteSupplierBrand,
  useSupplierBrandPage,
  useUpdateSupplierBrand,
} from '../hooks/use-supplier-brands'
import type { Supplier, SupplierBrand } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  supplier: Supplier | null
}

function formatDate(value?: string) {
  return value ? value.slice(0, 10) : '—'
}

export function SupplierBrandSheet({ open, onClose, supplier }: Props) {
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null)
  const [brandSearch, setBrandSearch] = useState('')

  const brandsQuery = useAllBrands()
  const createMutation = useCreateSupplierBrand()
  const updateMutation = useUpdateSupplierBrand()
  const deleteMutation = useDeleteSupplierBrand()

  const pageQuery = useSupplierBrandPage(
    { page: 1, size: 100, supplierId: supplier?.id },
    open && !!supplier,
  )

  const relations = pageQuery.data?.records ?? []
  const brands = brandsQuery.data ?? []

  const brandMap = useMemo(() => new Map(brands.map((b) => [b.id, b.name])), [brands])

  const availableBrands = useMemo(
    () =>
      brands.filter((b) => {
        const alreadyLinked = relations.some((r) => r.brandId === b.id && r.id !== editingId)
        if (alreadyLinked) return false
        if (!brandSearch.trim()) return true
        return b.name.toLowerCase().includes(brandSearch.toLowerCase())
      }),
    [brands, relations, editingId, brandSearch],
  )

  const selectedBrand = brands.find((b) => b.id === selectedBrandId)

  // Reset state when sheet opens/closes or supplier changes
  useEffect(() => {
    if (open) {
      setAdding(false)
      setEditingId(null)
      setSelectedBrandId(null)
      setBrandSearch('')
    }
  }, [open, supplier?.id])

  const handleStartAdd = () => {
    setEditingId(null)
    setSelectedBrandId(null)
    setBrandSearch('')
    setAdding(true)
  }

  const handleStartEdit = (relation: SupplierBrand) => {
    setAdding(false)
    setEditingId(relation.id)
    setSelectedBrandId(relation.brandId)
    setBrandSearch('')
  }

  const handleCancelEdit = () => {
    setAdding(false)
    setEditingId(null)
    setSelectedBrandId(null)
    setBrandSearch('')
  }

  const handleSave = async () => {
    if (!supplier || !selectedBrandId) return

    if (editingId !== null) {
      await updateMutation.mutateAsync(
        { id: editingId, supplierId: supplier.id, brandId: selectedBrandId },
        {
          onSuccess: () => {
            toast.success('品牌关系更新成功')
            handleCancelEdit()
          },
          onError: () => toast.error('更新失败，请重试'),
        },
      )
    } else {
      await createMutation.mutateAsync(
        { supplierId: supplier.id, brandId: selectedBrandId },
        {
          onSuccess: () => {
            toast.success('品牌关系添加成功')
            handleCancelEdit()
          },
          onError: () => toast.error('添加失败，请重试'),
        },
      )
    }
  }

  const handleDelete = async (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('品牌关系已删除'),
      onError: () => toast.error('删除失败，请重试'),
    })
  }

  const isEditing = adding || editingId !== null
  const saving = createMutation.isPending || updateMutation.isPending

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-6 py-4">
          <SheetHeader className="p-0 text-left">
            <SheetTitle className="text-base">供应商品牌管理</SheetTitle>
            {supplier && (
              <p className="text-sm text-muted-foreground">
                {supplier.supplierName}
                {supplier.supplierCode && (
                  <span className="ml-1 text-xs text-muted-foreground/70">
                    ({supplier.supplierCode})
                  </span>
                )}
              </p>
            )}
          </SheetHeader>

          <Button
            type="button"
            size="sm"
            permission={SUPPLIER_BRAND_CREATE_CODES}
            onClick={handleStartAdd}
            disabled={isEditing}
            className="shrink-0 rounded-xl"
          >
            <Plus className="size-4" />
            新增品牌
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Add / Edit inline form */}
          {isEditing && (
            <div className="mb-4 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {editingId !== null ? '编辑品牌关系' : '新增品牌关系'}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 rounded-full p-0"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <X className="size-3.5" />
                </Button>
              </div>

              {/* Search input */}
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索品牌..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="h-9 rounded-xl pl-9 text-sm"
                />
              </div>

              {/* Brand select list */}
              <ScrollArea className="max-h-40 rounded-xl border border-border/60">
                {availableBrands.length === 0 ? (
                  <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                    {brandSearch.trim() ? '未找到匹配品牌' : '暂无可选品牌'}
                  </p>
                ) : (
                  <div className="flex flex-col p-1">
                    {availableBrands.slice(0, 30).map((brand) => (
                      <button
                        key={brand.id}
                        type="button"
                        onClick={() => setSelectedBrandId(brand.id)}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted/60',
                          selectedBrandId === brand.id &&
                            'bg-primary/10 text-primary font-medium',
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                            selectedBrandId === brand.id
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground/30',
                          )}
                        >
                          {selectedBrandId === brand.id && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                          )}
                        </span>
                        {brand.name}
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Selected feedback + actions */}
              <div className="mt-3 flex items-center justify-between gap-3">
                {selectedBrand ? (
                  <p className="text-sm text-muted-foreground">
                    已选择：<span className="font-medium text-foreground">{selectedBrand.name}</span>
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">请从列表中选择一个品牌</p>
                )}
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="rounded-xl"
                  >
                    取消
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSave}
                    disabled={!selectedBrandId || saving}
                    className="rounded-xl"
                  >
                    {saving && <Loader2 className="mr-1 size-3.5 animate-spin" />}
                    保存
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {pageQuery.isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">加载中...</span>
            </div>
          )}

          {/* Empty */}
          {!pageQuery.isLoading && relations.length === 0 && !isEditing && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 rounded-full bg-muted/50 p-3">
                <Plus className="size-6 text-muted-foreground/60" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">暂无品牌关联</p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                点击「新增品牌」为该供应商添加品牌
              </p>
            </div>
          )}

          {/* Brand list */}
          {relations.length > 0 && (
            <div className="space-y-2">
              {relations.map((relation) => (
                <div
                  key={relation.id}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm transition-colors',
                    editingId === relation.id &&
                      'ring-2 ring-primary/20 border-primary/40',
                  )}
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-foreground">
                      {brandMap.get(relation.brandId) ?? `品牌 #${relation.brandId}`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(relation.createdTime)}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
                      permission={SUPPLIER_BRAND_UPDATE_CODES}
                      onClick={() => handleStartEdit(relation)}
                      disabled={isEditing}
                    >
                      编辑
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg px-2 text-xs text-muted-foreground hover:text-destructive"
                      permission={SUPPLIER_BRAND_DELETE_CODES}
                      onClick={() => handleDelete(relation.id)}
                      disabled={deleteMutation.isPending || isEditing}
                    >
                      {deleteMutation.isPending && deleteMutation.variables === relation.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
