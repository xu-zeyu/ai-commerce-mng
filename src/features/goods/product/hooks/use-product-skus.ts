import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProductSku } from '../api/create-product-sku'
import { deleteProductSku } from '../api/delete-product-sku'
import { getProductSkuPage } from '../api/get-product-sku-page'
import { updateProductSku } from '../api/update-product-sku'
import type { ProductSkuPageParams } from '../types'

const SKU_QUERY_KEY = ['goods-product-skus'] as const

export function useProductSkuPage(params: ProductSkuPageParams) {
  return useQuery({
    queryKey: [...SKU_QUERY_KEY, 'page', params],
    queryFn: () => getProductSkuPage(params),
  })
}

export function useCreateProductSku() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProductSku,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SKU_QUERY_KEY }),
  })
}

export function useUpdateProductSku() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProductSku,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SKU_QUERY_KEY }),
  })
}

export function useDeleteProductSku() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProductSku,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SKU_QUERY_KEY }),
  })
}
