import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { CreateCategoryPayload } from '../types'

export async function createCategory(data: CreateCategoryPayload): Promise<number> {
  const res: ApiResult<number> = await request.post('/goods/category/create', data)
  return res.data
}
