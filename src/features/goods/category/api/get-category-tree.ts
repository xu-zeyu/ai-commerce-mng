import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { GoodsCategoryTreeNode } from '../types'

export async function getCategoryTree(): Promise<GoodsCategoryTreeNode[]> {
  const res: ApiResult<GoodsCategoryTreeNode[]> = await request.get('/goods/category/tree')
  return res.data
}
