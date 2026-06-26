import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { UpdateBrandPayload } from '../types'

export async function updateBrand({
  id,
  ...data
}: { id: number } & UpdateBrandPayload): Promise<void> {
  const res: ApiResult<void> = await request.put(`/goods/brand/${id}`, data)
  return res.data
}
