import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function deleteCategory(id: number): Promise<void> {
  await request.post<ApiResult<void>>('/goods/category/delete', { id })
}
