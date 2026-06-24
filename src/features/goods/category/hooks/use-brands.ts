import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createBrand } from '../api/create-brand'
import { deleteBrand } from '../api/delete-brand'
import { getBrandPage } from '../api/get-brand-page'
import { updateBrand } from '../api/update-brand'
import type { BrandPageParams } from '../types'

const BRAND_QUERY_KEY = ['goods-brands'] as const

export function useBrandPage(params: BrandPageParams) {
  return useQuery({
    queryKey: [...BRAND_QUERY_KEY, 'page', params],
    queryFn: () => getBrandPage(params),
    enabled: params.categoryId > 0,
  })
}

export function useCreateBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY }),
  })
}

export function useUpdateBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateBrand,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY }),
  })
}

export function useDeleteBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY }),
  })
}
