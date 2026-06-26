import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export interface CategoryTreeNode {
  id: number
  parentId: number
  name: string
  level: number
  sort?: number | null
  icon: string
  status: 0 | 1
  children?: CategoryTreeNode[]
}

export async function getCategoryTree(): Promise<CategoryTreeNode[]> {
  const res: ApiResult<CategoryTreeNode[]> = await request.get('/goods/category/tree')
  return res.data
}
