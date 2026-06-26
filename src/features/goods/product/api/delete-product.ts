import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function deleteProduct(id: number): Promise<void> {
  const res: ApiResult<void> = await request.delete(`/product/${id}`)
  return res.data
}
