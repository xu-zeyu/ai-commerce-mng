import { useQuery } from '@tanstack/react-query'
import {
  getBrandOptions,
  getCategoryOptions,
  getSupplierOptions,
} from '../api/get-product-options'

const OPTIONS_STALE_TIME = 5 * 60 * 1000

export function useSupplierOptions() {
  return useQuery({
    queryKey: ['goods-product-options', 'suppliers'],
    queryFn: getSupplierOptions,
    staleTime: OPTIONS_STALE_TIME,
  })
}

export function useBrandOptions() {
  return useQuery({
    queryKey: ['goods-product-options', 'brands'],
    queryFn: getBrandOptions,
    staleTime: OPTIONS_STALE_TIME,
  })
}

export function useCategoryOptions() {
  return useQuery({
    queryKey: ['goods-product-options', 'categories'],
    queryFn: getCategoryOptions,
    staleTime: OPTIONS_STALE_TIME,
  })
}
