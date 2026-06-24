import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function deleteBrand(id: number): Promise<void> {
  await request.delete<ApiResult<void>>(`/goods/brand/${id}`)
}
