import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { UpdateCategoryPayload } from '../types'

export async function updateCategory(data: UpdateCategoryPayload): Promise<void> {
  await request.post<ApiResult<void>>('/goods/category/update', data)
}
