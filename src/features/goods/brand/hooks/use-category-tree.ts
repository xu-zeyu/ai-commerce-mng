import { useQuery } from '@tanstack/react-query'
import { getCategoryTree } from '../api/get-category-tree'

const CATEGORY_TREE_KEY = ['goods-category-tree'] as const

export function useCategoryTree() {
  return useQuery({
    queryKey: CATEGORY_TREE_KEY,
    queryFn: getCategoryTree,
    staleTime: 5 * 60 * 1000,
  })
}
