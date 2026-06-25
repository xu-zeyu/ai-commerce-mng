import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSupplierBrand } from '../api/create-supplier-brand'
import { deleteSupplierBrand } from '../api/delete-supplier-brand'
import { getAllBrands } from '../api/get-all-brands'
import { getSupplierBrandPage } from '../api/get-supplier-brand-page'
import { updateSupplierBrand } from '../api/update-supplier-brand'
import type { SupplierBrandPageParams } from '../types'

const SUPPLIER_BRAND_QUERY_KEY = ['supplier-brands'] as const

export function useSupplierBrandPage(params: SupplierBrandPageParams, enabled?: boolean) {
  return useQuery({
    queryKey: [...SUPPLIER_BRAND_QUERY_KEY, 'page', params],
    queryFn: () => getSupplierBrandPage(params),
    enabled,
  })
}

export function useCreateSupplierBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSupplierBrand,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUPPLIER_BRAND_QUERY_KEY }),
  })
}

export function useUpdateSupplierBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSupplierBrand,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUPPLIER_BRAND_QUERY_KEY }),
  })
}

export function useDeleteSupplierBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSupplierBrand,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUPPLIER_BRAND_QUERY_KEY }),
  })
}

export function useAllBrands() {
  return useQuery({
    queryKey: ['all-brands'],
    queryFn: getAllBrands,
    staleTime: 5 * 60 * 1000,
  })
}
