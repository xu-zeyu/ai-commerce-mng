import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProductImage } from '../api/create-product-image'
import { deleteProductImage } from '../api/delete-product-image'
import { getProductImagePage } from '../api/get-product-image-page'
import { updateProductImage } from '../api/update-product-image'
import type { ProductImagePageParams } from '../types'

const PRODUCT_IMAGE_QUERY_KEY = ['goods-product-images'] as const

export function useProductImagePage(params: ProductImagePageParams) {
  return useQuery({
    queryKey: [...PRODUCT_IMAGE_QUERY_KEY, 'page', params],
    queryFn: () => getProductImagePage(params),
  })
}

export function useCreateProductImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProductImage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_IMAGE_QUERY_KEY }),
  })
}

export function useUpdateProductImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProductImage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_IMAGE_QUERY_KEY }),
  })
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProductImage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_IMAGE_QUERY_KEY }),
  })
}
