import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function deleteBrand(id: number): Promise<void> {
  const res: ApiResult<void> = await request.delete(`/goods/brand/${id}`)
  return res.data
}
