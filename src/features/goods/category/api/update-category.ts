import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { UpdateCategoryPayload } from '../types'

export async function updateCategory({ id, ...data }: { id: number } & UpdateCategoryPayload): Promise<void> {
  await request.put<ApiResult<void>>(`/goods/category/${id}`, data)
}
