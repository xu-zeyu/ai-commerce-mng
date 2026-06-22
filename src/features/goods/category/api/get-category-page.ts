import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { CategoryPageParams, CategoryPageResult } from '../types'

export async function getCategoryPage(params: CategoryPageParams): Promise<CategoryPageResult> {
  const res: ApiResult<CategoryPageResult> = await request.get('/goods/category/page', { params })
  return res.data
}
