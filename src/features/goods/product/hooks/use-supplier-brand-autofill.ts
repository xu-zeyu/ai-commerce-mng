import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSupplierBrandPage } from '@/features/goods/supplier/api/get-supplier-brand-page'
import { getAllBrands } from '@/features/goods/supplier/api/get-all-brands'
import type { ProductOption } from '../types'

interface SupplierBrandAutoFill {
  brandOptions: ProductOption[]
  /** 供应商关联的第一个品牌ID，用于自动选中 */
  firstBrandId: number | null
  /** 第一个品牌对应的分类ID，用于自动选中 */
  firstCategoryId: number | null
  isLoading: boolean
}

/**
 * 选中供应商后，自动获取该供应商关联的品牌列表，并返回第一个品牌的分类ID。
 * 品牌和分类由此 hook 驱动，表单中禁用手动修改。
 */
export function useSupplierBrandAutoFill(supplierId: number): SupplierBrandAutoFill {
  const [brandId, setBrandId] = useState<number | null>(null)

  // 供应商有品牌时才启用
  const supplierBrandQuery = useQuery({
    queryKey: ['supplier-brand-page', supplierId],
    queryFn: () => getSupplierBrandPage({ supplierId, page: 1, size: 1000 }),
    enabled: supplierId > 0,
    staleTime: 5 * 60 * 1000,
  })

  const allBrandsQuery = useQuery({
    queryKey: ['all-brands-for-autofill'],
    queryFn: getAllBrands,
    staleTime: 5 * 60 * 1000,
  })

  // 供应商关联的品牌ID列表
  const supplierBrandIds = useMemo(
    () => new Set((supplierBrandQuery.data?.records ?? []).map((r) => r.brandId)),
    [supplierBrandQuery.data],
  )

  // 品牌选项：仅包含该供应商关联的品牌
  const brandOptions = useMemo<ProductOption[]>(() => {
    const all = allBrandsQuery.data ?? []
    return all
      .filter((b) => supplierBrandIds.has(b.id))
      .map((b) => ({ id: b.id, label: b.name }))
  }, [allBrandsQuery.data, supplierBrandIds])

  // 当品牌选项加载完成后，自动选中第一个
  useEffect(() => {
    if (brandOptions.length > 0) {
      setBrandId((prev) => {
        // 已经选中的品牌仍在列表中，不重复设置
        if (prev && brandOptions.some((b) => b.id === prev)) return prev
        return brandOptions[0].id
      })
    } else {
      setBrandId(null)
    }
  }, [brandOptions])

  // 从全量品牌数据中找到第一个品牌的 categoryId
  const firstCategoryId = useMemo(() => {
    if (!brandId) return null
    const all = allBrandsQuery.data ?? []
    const found = all.find((b) => b.id === brandId)
    return found?.categoryId ?? null
  }, [brandId, allBrandsQuery.data])

  const isLoading = supplierBrandQuery.isLoading || allBrandsQuery.isLoading

  return { brandOptions, firstBrandId: brandId, firstCategoryId, isLoading }
}
