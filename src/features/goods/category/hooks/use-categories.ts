import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCategory } from '../api/create-category'
import { deleteCategory } from '../api/delete-category'
import { getCategoryPage } from '../api/get-category-page'
import { getCategoryTree } from '../api/get-category-tree'
import { updateCategory } from '../api/update-category'
import type { CategoryPageParams } from '../types'

const CATEGORY_QUERY_KEY = ['goods-categories'] as const

export function useCategoryPage(params: CategoryPageParams) {
  return useQuery({
    queryKey: [...CATEGORY_QUERY_KEY, 'page', params],
    queryFn: () => getCategoryPage(params),
  })
}

export function useCategoryTree() {
  return useQuery({
    queryKey: [...CATEGORY_QUERY_KEY, 'tree'],
    queryFn: getCategoryTree,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY }),
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY }),
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY }),
  })
}
