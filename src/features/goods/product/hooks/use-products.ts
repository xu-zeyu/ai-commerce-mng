import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProduct } from '../api/create-product'
import { deleteProduct } from '../api/delete-product'
import { getProductPage } from '../api/get-product-page'
import { updateProduct } from '../api/update-product'
import type { ProductPageParams } from '../types'

const PRODUCT_QUERY_KEY = ['goods-products'] as const

export function useProductPage(params: ProductPageParams) {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEY, 'page', params],
    queryFn: () => getProductPage(params),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY }),
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY }),
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY }),
  })
}
